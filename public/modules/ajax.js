import * as uiUtils from "./uiUtils.js"
export function createRoom(roomName, userId){
    fetch("/create-room", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({roomName, userId})
    }).then(response => response.json()).then(resObj => {

    }).
    catch(error => {
        console.log("An error ocurred trying to create a room", error);
        uiUtils.LogToCustomConsole("Some sort of error happend trying to create a room. Sorry :)", "red")
    })
}