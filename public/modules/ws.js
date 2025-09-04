import * as state from "./state.js"
import * as uiUtils from "./uiUtils.js"
import * as constants from "./constants.js"
import * as webrtcHandler from "./webrtcHandler.js"
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
            type: constants.Type.ROOM_EXIT.REQUEST,
            roomName,
            userId
        }
    };
    state.getState().userWebSocketConnection.send(JSON.stringify(message))
}
// sending an offer to the signaling server

export function sendOffer(offer){
    const message = {
        label: constants.labels.WEBRTC_PROCESS,
        data:{
            type: constants.Type.WEB_RTC.OFFER,
            offer: offer,
            otherUserId: state.getState().otherUserId
        }
    };
    state.getState().userWebSocketConnection.send(JSON.stringify(message))
}

export function sendAnswer(answer){
    const message = {
        label: constants.labels.WEBRTC_PROCESS,
        data: {
            type: constants.Type.WEB_RTC.ANSWER,
            answer,
            otherUserId: state.getState().otherUserId
        }
    }
    state.getState().userWebSocketConnection.send(JSON.stringify(message));
}

export function sendIceCandidates(arrayoficecandidates){
    
    const message = {
        label: constants.labels.WEBRTC_PROCESS,
        data:{
            type: constants.Type.WEB_RTC.ICE_CANDIDATE,
            candidates: arrayoficecandidates,
            otherUserId: state.getState().otherUserId
        }
    }
    state.getState().userWebSocketConnection.send(JSON.stringify(message));
}

//incomming message
function handleMessage(message) {
   
    const resp = JSON.parse(message.data)
    console.log(resp)
    switch(resp.label){
        case constants.labels.NORMAL_SERVER_PROCESS:
            console.log(resp.data)
            normalServerProcessing(resp.data)
            break;
        case constants.labels.WEBRTC_PROCESS:
            console.log(resp.data)
            webRTCServerProcessing(resp.data)
            break;
        default: 
            console.log("unknown server processing logic")
    }
}

// webrtc server processing
function webRTCServerProcessing(data){
    console.log(data)
    switch(data.type){
        case constants.Type.WEB_RTC.OFFER:
            webrtcHandler.handleOffer(data)
            break;
        case constants.Type.WEB_RTC.ANSWER:
            webrtcHandler.handleAnswer(data)
            break;    
        case constants.Type.WEB_RTC.ICE_CANDIDATE:
            console.log("calling ice candidate")
            webrtcHandler.handleIceCandidates(data)
            break;
        default:
            console.log("Unknown data type", data.type)
    }
}


// normal server processing
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
        case constants.Type.ROOM_EXIT.NOTIFY:
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
    // start the webrtc process
    webrtcHandler.startWebrtcProcess();
}

function joinNotificationHandler(data) {
    alert(`User ${data.joineeId} has joined you room`)
    state.setOtherUserId(data.joineeId)
    uiUtils.LogToCustomConsole(data.message, "green")
    uiUtils.updateCreatorsRoom()
}
