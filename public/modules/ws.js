import * as state from "./state.js"
import * as uiUtils from "./uiUtils.js"
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

function handleMessage(message) {
    console.log(message)
}
function handleClose(closeEventObject) {
    console.log(closeEventObject)
    uiUtils.LogToCustomConsole("You have been disconneted for our ws server", null, true, "red")
}
function handleError(error) {
    uiUtils.LogToCustomConsole("An error occured", red)
}