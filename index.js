import express from 'express'
import { WebSocket, WebSocketServer } from 'ws'
import http from "http"
import { Type } from './constant.js';
let app = express();
app.use(express.static("public"))
app.use(express.json())
//global variable 
const connections = []
const rooms = []
const server = http.createServer(app);
app.get("/", (req, res)=>{

    res.sendFile(process.cwd() + "/public/index.html")
})
app.post("/destroy-room", (req, res)=> {
    const {roomName} = req.body;
    const roomIndex = rooms.findIndex(room => room.roomName === roomName)
    if (roomIndex === -1) {
        const failureMessage = {
            data: {
                type: Type.ROOM_DESTROY.RESPONSE_FAILURE,
                message: "Room not found"
            }
        }
        return res.status(400).json(failureMessage)
    }
    rooms.splice(roomIndex, 1)
    return res.status(200).json({
        data: {
            type: Type.ROOM_DESTROY.RESPONSE_SUCCESS,
            message: "Room destroyed successfully"
        }
    })
})
app.post("/create-room", (req, res)=> {
    console.log("Creating rooom")
    const { roomName, userId } = req.body;
    const existingRoom = rooms.find(room => {
        return room.roomName == roomName;
    })
    console.log("Existing room:", existingRoom)
    if (existingRoom) {
        const failureMessage = {
            data: {
                type: Type.ROOM_CHECK.RESPONSE_FAILURE,
                message: "Room already exists, try to JOIN Room"
            }
        }
        return res.status(400).json(failureMessage)
    }
    else {
        rooms.push({
            roomName: roomName,
            peer1: userId,
            peer2: null
        })
        const successmessage = {
            data: {
                type: Type.ROOM_CHECK.RESPONSE_SUCCESS,
                message: "Room created successfully",
                roomName: roomName
            }
        }
        return res.status(200).json(successmessage)
    }
    
})
// ############################### Websocket server 
// Mounting ws server over http server

const wss = new WebSocketServer({server})

wss.on("connection", (ws, req) => {
    const userId = Number(new URLSearchParams(req.url.split('?')[1]).get("userId"));
    addConnection(ws, userId)
    //register all three events listeners 
    ws.on("message", (data)=>handleMessage(data))
    ws.on("close", (data)=>handleDisconneting(data))
    ws.on("error", (data)=>console.log("error:", data))
})
function addConnection(ws, userId) {
    connections.push({
        wsConnection: ws,
        userId: userId
    })
    console.log("Total connected user:", connections.length)
}

function handleMessage(data) {
    try{

    }
    catch(error) {
        console.log("Error:", error)
    }
}
function handleDisconneting(data) {
    const connectionIndex = connections.findIndex(conn => conn.userId === data.userId)
    if (connectionIndex === -1) {
        console.log("User not found")
    };
    connections.splice(connectionIndex, 1)
    console.log("User removed:", data.userId)
    console.log(connections.length)

} 

// ############################### Sign Up Server

server.listen(4000, ()=>{
    console.log("server listening on 4000")
})