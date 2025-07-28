// this file will keep all states related to our user

let state = {
    userId: null,
    userWebSocketConnection: null,
    room: null,
};

// generic setter function for our state object 
const setState = (newState) => {
    state = {
        ...state,
        ...newState
    }
};

// set the userID 
export const setUserID = (userId) => {
    setState(userId)
}

export const setWsConnection = (wsConnection) => {
    setState({userWebSocketConnection:wsConnection})
}
export const setRoom = (room) => {
    setState({room})
}

export const getState = () => {
    return state;
}