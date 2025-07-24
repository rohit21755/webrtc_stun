// this file will keep all states related to our user

let state = {
    userId: null
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