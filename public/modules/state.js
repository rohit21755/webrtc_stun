// this file will keep all states related to our user

let state = {
    userId: null,
    userWebSocketConnection: null,
    room: null,
    otherUserId: null
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

export const setOtherUserId = (otherUserId) => {
    setState({otherUserId})
}

export const setWsConnection = (wsConnection) => {
    setState({userWebSocketConnection:wsConnection})
}
export const setRoom = (room) => {
    setState({room})
}
export const resetState = () => {
    setState({
        room: null,
        otherUserId: null
    })
}

export const getState = () => {
    return state;
}