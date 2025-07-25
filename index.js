import express from 'express'
import { WebSocket, WebSocketServer } from 'ws'
import http from "http"

let app = express();
app.use(express.static("public"))
//global variable 
const connections = []

const server = http.createServer(app);
app.get("/", (req, res)=>{

    res.sendFile(process.cwd() + "/public/index.html")
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