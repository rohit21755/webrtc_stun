import * as uiUtils from "./uiUtils.js"
import { Type } from "./constants.js";
import * as state from "./state.js"
export function createRoom(roomName, userId){
    console.log("Creating room with name:", roomName, "for userId:", userId);
    fetch("/create-room", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomName, userId })
    })
    .then(response => response.json())
    .then(resObj => {
        console.log("Hello")
        if (resObj.data.type === Type.ROOM_CHECK.RESPONSE_SUCCESS) {
            console.log("Room created successfully", resObj.data.roomName);
            state.setRoom(resObj.data.roomName);
            uiUtils.LogToCustomConsole(resObj.data.message, "green");
            uiUtils.LogToCustomConsole("Waiting for peer to join the room", "yellow");
            uiUtils.creatorToProceed();
        } else if (resObj.data.type === Type.ROOM_CHECK.RESPONSE_FAILURE) {
            uiUtils.LogToCustomConsole(resObj.data.message, "red");

        }
    })
    .catch(error => {
        console.log("An error occurred trying to create a room", error);
        uiUtils.LogToCustomConsole("Some sort of error happened trying to create a room. Sorry :)", "red");
    });
}

export function destoryRoom(roomName) {
    fetch("/destroy-room", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomName })
    })
    .then(response => response.json())
    .then(resObj => {
       if(resObj.data.type === Type.ROOM_DESTROY.RESPONSE_SUCCESS) {
            uiUtils.LogToCustomConsole(resObj.data.message, "green");
            uiUtils.exitRoom();
            
        } 
         if (resObj.data.type === Type.ROOM_DESTROY.RESPONSE_FAILURE) {
            uiUtils.LogToCustomConsole(resObj.data.message, "red");
         }
        
    })
    .catch(error => {
        console.log("An error occurred trying to create a room", error);
        uiUtils.LogToCustomConsole("Some sort of error happened trying to create a room. Sorry :)", "red");
    });
}
