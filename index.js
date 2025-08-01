import express from 'express'
import { WebSocket, WebSocketServer } from 'ws'
import http from "http"
import { Type, labels } from './constant.js';
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
    ws.userId = userId;
    //register all three events listeners 
    ws.on("message", (data)=>handleMessage(data))
    ws.on("close", ()=>handleDisconneting(userId))
    ws.on("error", ()=>console.log("error:", error))
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
        let message = JSON.parse(data)
        // process message depending on its lable type
        switch(message.label){
            case labels.NORMAL_SERVER_PROCESS:
                console.log("==== normal server message ====")
                normalServerProcessing(message.data)
                break;
            default:
                console.log("===== unknown message label =====")

        }
    }
    catch(error) {
        console.log("Error:", error)
    }
}
function handleDisconneting(userId) {
    
    const connectionIndex = connections.findIndex(conn => conn.userId === userId);
    if (connectionIndex === -1) {
        console.log("User not found");
        return;
    }

    connections.splice(connectionIndex, 1);
    console.log("User removed:", userId);
    console.log("Remaining connections:", connections.length);

    // Remove from rooms
    rooms.forEach(room => {
        if (room.peer1 === userId) {
            console.log("Removing peer1 from room:", room.roomName);
            room.peer1 = null;
        }
        if (room.peer2 === userId) {
            console.log("Removing peer2 from room:", room.roomName);
            room.peer2 = null;
        }

        if(room.peer1 === null && room.peer2 === null) {
            const roomIndex = rooms.findIndex(room2 => {
                return room2.roomName === room.roomName
            })
            if (roomIndex != -1){
                rooms.splice(roomIndex,1)
            }
        }
    });

} 
// >>>>> NORMAL SERVER
function normalServerProcessing(data) {
    switch(data.type) {
        case Type.ROOM_JOIN.REQUEST:
            joinRoomHanlder(data);
            break;
        case Type.ROOM_EXIT.EXIT:
            exitRoomHandler(data);
            break;
        default:
            console.log("unknown data type")
    }
}

function joinRoomHanlder(data){
    const {roomName, userId } = data;
    const existingRoom = rooms.find(room => room.roomName === roomName);
    let otheruserId = null;
    if(!existingRoom) {
        console.log("a user try to join, but room doesn't exists ")
        const failureMessage = {
            label: labels.NORMAL_SERVER_PROCESS,
            data: {
                type: Type.ROOM_JOIN.RESPONSE_FAILURE,
                message: "Room does not exists"
            }

        }
        sendWsMessageToUser(userId, failureMessage)
        return
    }
    if(existingRoom.peer1 && existingRoom.peer2){
        console.log("Room is full")
        const failureMessage = {
            label: labels.NORMAL_SERVER_PROCESS,
            data: {
                type: Type.ROOM_JOIN.RESPONSE_FAILURE,
                message: "This room is full"
            }

        }
        sendWsMessageToUser(userId, failureMessage)
        return
    }

    // allow user to join room 
    // room is available and not full
    console.log("A user is attempting to join a room")
    if(!existingRoom.peer1) {
        existingRoom.peer1 = userId;
        otheruserId = existingRoom.peer2
    } else {
        existingRoom.peer2 = userId;
        otheruserId = existingRoom.peer1
    }
    const successMessage = {
        label: labels.NORMAL_SERVER_PROCESS,
        data: {
            type: Type.ROOM_JOIN.RESPONSE_SUCCESS,
            message: `You have successfully joined ${roomName}`,
            creatorId: otheruserId,
            roomName: roomName
        }

    }
    sendWsMessageToUser(userId, successMessage)

    const notificationMessage = {
        label: labels.NORMAL_SERVER_PROCESS,
        data: {
            type: Type.ROOM_JOIN.NOTIFY,
            message: `User ${userId} has joined your room`,
            joineeId: userId
        }

    }
    sendWsMessageToUser(otheruserId, notificationMessage)
    return
}

function exitRoomHandler(data){
    const {roomName, userId} = data
    const existingRoom = rooms.find(room => room.roomName === roomName);
    const otheruserId = (existingRoom.peer1 === userId) ? existingRoom.peer2 : existingRoom.peer1;

    if(!existingRoom) {console.log(`Room ${roomName} does not exists`)
         return;}

    if(existingRoom.peer1 === userId){
        existingRoom.peer1 = null
        console.log("Removed peer1 from the ")
    } else {
        existingRoom.peer2 = null
    }

    // clean up and remove empty room
    if(existingRoom.peer1 === null && existingRoom.peer2 === null) {
        const roomIndex = rooms.findIndex(room2 => {
            return room2.roomName === existingRoom.roomName
        })
        if (roomIndex != -1){
            rooms.splice(roomIndex,1)
        }
    }
    const notificationMessage = {
        label: labels.NORMAL_SERVER_PROCESS,
        data: {
            type: Type.ROOM_EXIT.EXIT,
            message: `User ${userId} has left room`,
            joineeId: userId
        }

    }
    sendWsMessageToUser(otheruserId, notificationMessage)
    return




}
//>>>>> WEBRTC SERVER


// >>>>> WEBSOCKET GENERIC

function sendWsMessageToUser(sendToUserId, message) {
    const userConnection = connections.find(conn => conn.userId === sendToUserId);
    if(userConnection && userConnection.wsConnection) {
        userConnection.wsConnection.send(JSON.stringify(message))
        console.log(`Message sent to ${sendToUserId}`)
    }
    else {
        console.log(`User not found ${sendToUserId}`)
    }
}

// ############################### Sign Up Server

server.listen(4000,"0.0.0.0", ()=>{
    console.log("server listening on 4000")
})