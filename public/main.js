import * as uiUtils from "./modules/uiUtils.js"
import * as ws from "./modules/ws.js"
import { createRoom, destoryRoom } from "./modules/ajax.js"
import * as state from "./modules/state.js"
// Generate  unique user code for every user that visits the page
const userId = Math.round(Math.random() * 1000000)
console.log(userId)
// initialize the DOM
uiUtils.initializeUi(userId)

// establish a ws connectioin 

const wsClient = new WebSocket(`/?userId=${userId}`)

ws.ResgisterSocketEvents(wsClient)
console.log("Hello")
// create room
uiUtils.DOM.createRoomButton.addEventListener("click", ()=>{
    const roomName = uiUtils.DOM.inputRoomNameElement.value;
    if(!roomName) {
        return alert("Enter the room name first")
    }
    uiUtils.LogToCustomConsole(`Ws server is checking wheather room ${roomName} is availlabe .... plz wait`)
    createRoom(roomName, userId)
})

uiUtils.DOM.destroyRoomButton.addEventListener("click", ()=>{
    const roomName = state.getState().room;
    destoryRoom(roomName)
})
// joining room (peer2)
uiUtils.DOM.joinRoomButton.addEventListener("click", ()=>{
    const roomName = uiUtils.DOM.inputRoomNameElement.value;
    if(!roomName){
        alert("You have to join a room with valid name");
    }
    ws.joinRoom(roomName, userId);
});

// exit room
uiUtils.DOM.exitButton.addEventListener("click", ()=>{
    const roomName = state.getState().room
    uiUtils.exitRoom()
    ws.exitRoom(roomName, userId)
    uiUtils.LogToCustomConsole(`You have left the room ${roomName}`)
})