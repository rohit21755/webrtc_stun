import * as state from "./state.js"
import * as uiUtils from "./uiUtils.js"
import * as constants from "./constants.js"
export function ResgisterSocketEvents(wsClientConnection) {
    state.setWsConnection(wsClientConnection)
    //Listen for those 4 events 
    wsClientConnection.onopen = () => {
        //
        uiUtils.LogToCustomConsole("You have connected with our websocket server")
        wsClientConnection.onmessage = handleMessage;
        wsClientConnection.onclose = handleClose;
        wsClientConnection.onerror = handleError;
    }
}


function handleClose(closeEventObject) {
    uiUtils.LogToCustomConsole("You have been disconneted for our ws server", null, true, "red")
}
function handleError(error) {
    uiUtils.LogToCustomConsole("An error occured", red)
}
//outgoing joining room
export function joinRoom(roomName, userId){
    const message = {
        label: constants.labels.NORMAL_SERVER_PROCESS,
        data:{
            type: constants.Type.ROOM_JOIN.REQUEST,
            roomName,
            userId
        }
    };
    state.getState().userWebSocketConnection.send(JSON.stringify(message))
};

export function exitRoom(roomName, userId){
    const message = {
        label: constants.labels.NORMAL_SERVER_PROCESS,
        data:{
            type: constants.Type.ROOM_EXIT.EXIT,
            roomName,
            userId
        }
    };
    state.getState().userWebSocketConnection.send(JSON.stringify(message))
}


//incomming message
function handleMessage(message) {
   
    const resp = JSON.parse(message.data)
   
    switch(resp.label){
        case constants.labels.NORMAL_SERVER_PROCESS:
            console.log(resp.data)
            normalServerProcessing(resp.data)
            break;
        default: 
            console.log("unknown server processing logic")
    }
}

function normalServerProcessing(data) {
    console.log(data.type)
    switch(data.type){
        case constants.Type.ROOM_JOIN.RESPONSE_SUCCESS:
            joinSuccessHandler(data);
            break;
        case constants.Type.ROOM_JOIN.RESPONSE_FAILURE:
            uiUtils.LogToCustomConsole(data.message, "red")
            break;
        case constants.Type.ROOM_JOIN.NOTIFY:
            // uiUtils.LogToCustomConsole(data.message, "green")
            joinNotificationHandler(data)
            break;
        case constants.Type.ROOM_EXIT.EXIT:
            console.log("exit notification handler")
            exitNotificationHandler(data)
            break;
        default:
            console.log("Unknown response")
    }
}
function exitNotificationHandler(data) {
    uiUtils.LogToCustomConsole(data.message, "red")
    uiUtils.updateUIRemainingUser()
}

function joinSuccessHandler(data){
    state.setOtherUserId(data.creatorId)
    state.setRoom(data.roomName)
    uiUtils.joineeToProceedToRoom();
}

function joinNotificationHandler(data) {
    alert(`User ${data.joineeId} has joined you room`)
    uiUtils.LogToCustomConsole(data.message, "green")
    uiUtils.updateCreatorsRoom()
}