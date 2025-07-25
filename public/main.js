import * as uiUtils from "./modules/uiUtils.js"
// Generate  unique user code for every user that visits the page
const userId = Math.round(Math.random() * 1000000)
console.log(userId)
// initialize the DOM
uiUtils.initializeUi(userId)

// establish a ws connectioin 

const wsClient = new WebSocket(`/?userId=${userId}`)