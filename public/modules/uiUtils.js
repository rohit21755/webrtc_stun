
import { setUserID, getState, setRoom, resetState, setOtherUserId } from "./state.js";
// selecting DOM elements 
const user_session_id_element = document.getElementById("session_id_display");
const infoModalButton = document.getElementById('info_modal_button');
const infoModalContent = document.getElementById('info_modal_content_container');
const closeModalButton = document.getElementById('close');
const inputRoomNameElement = document.getElementById('input_room_channel_name');
const joinRoomButton = document.getElementById('join_button');
const createRoomButton = document.getElementById('create_room_button');
const roomNameHeadingTag = document.getElementById('room_name_heading_tag');
const landingPageContainer = document.getElementById('landing_page_container');
const roomInterface = document.getElementById('room_interface');
const messagesContainer = document.getElementById('messages');
const messageInputField = document.getElementById('message_input_field');
const messageInputContainer = document.getElementById('message_input');
const sendMessageButton = document.getElementById('send_message_button');
const destroyRoomButton = document.getElementById('destroy_button');
const exitButton = document.getElementById('exit_button');
const consoleDisplay = document.getElementById('console_display');

// learning purposes
const offerorButtonsContainer = document.getElementById("offeror_process_buttons");
const offerorCreatePcButton = document.getElementById("create_pc");
const offerorAddDataTypeButton = document.getElementById("add_data_type");
const offerorCreateOfferButton = document.getElementById("create_offer");
const offerorUpdateLocalDescriptionButton = document.getElementById("update_local_description");
const offerorSendOfferButton = document.getElementById("send_offer");
const offerorSetRemoteDescriptionButton = document.getElementById("set_remote_description");
const offerorIceButton = document.getElementById("ice_offeror");

const offereeButtonsContainer = document.getElementById("offeree_process_buttons");
const offereeCreatePcButton = document.getElementById("offeree_create_pc");
const offereeAddDataTypeButton = document.getElementById("offeree_add_data_type");
const offereeUpdateRemoteDescriptionButton = document.getElementById("offeree_update_remote_description");
const offereeCreateAnswerButton = document.getElementById("offeree_create_answer");
const offereeUpdateLocalDescriptionButton = document.getElementById("offeree_update_local_description");
const offereeSendAnswerButton = document.getElementById("offeree_send_answer");
const offereeIceButton = document.getElementById("ice_offeree");

export const DOM = {
    createRoomButton,
    inputRoomNameElement,
    destroyRoomButton,
    joinRoomButton,
    exitButton
}

// intialize UI events as soon as user enters page 
export function initializeUi(userId) {
    user_session_id_element.innerHTML = `Your session id is ${userId}`;
    setUserID(userId)
    // setup modal functionality 
    setUpModalEvents()
}
// create a function for creator to enter the room
export function creatorToProceed() {
    landingPageContainer.style.display = "none";
    exitButton.classList.add("hidden"); // or "hide", but make it consistent
    roomInterface.classList.remove("hidden")
    roomNameHeadingTag.textContent = `You are in room ${getState().room}`
}

export function exitRoom() {
    landingPageContainer.style.display = "block";
    roomInterface.classList.add("hidden")
    resetState()
    // roomNameHeadingTag.textContent = ``
    
}


function setUpModalEvents() {
    infoModalButton.onclick = openModal;
    closeModalButton.onclick = closeModal;
}

// ######Room Logic
// listen for the enter/ return key and trigger the create room button
inputRoomNameElement.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        createRoomButton.click()
    }
})


export function updateUIRemainingUser(){
    alert("Someone left")
    setOtherUserId(null)
    messagesContainer.innerHTML = "Waiting for a peer join";
    // have to add more lodic here
}

function openModal() {
    infoModalContent.classList.add("show")
    infoModalContent.classList.remove("hidden")
}
function closeModal() {
    infoModalContent.classList.add("hidden")
    infoModalContent.classList.remove("show")
}

export function LogToCustomConsole(message, color = "#FFFFFF", highlight = false, highlightColor = "#ffff83") {
    const messageElement = document.createElement("div")
    messageElement.classList.add("console-message")
    messageElement.textContent = message
    messageElement.style.color = color

    if (highlight) {
        messageElement.style.backgroundColor = highlightColor
        messageElement.style.fontWeight = "bold"
        messageElement.style.padding = "5px"
        messageElement.style.borderRadius = "3px"
        messageElement.style.transition = "background-color 0.5s ease"
    }
    // append our newly
    consoleDisplay.appendChild(messageElement)
    consoleDisplay.scrollTo = consoleDisplay.scrollHeight
    
}

export function joineeToProceedToRoom() {
    
    landingPageContainer.style.display = "none";
    roomInterface.classList.remove("hidden")
    destroyRoomButton.classList.add("hidden")
    roomNameHeadingTag.textContent = `You are in room ${getState().room}`
    messagesContainer.innerHTML = "Please wait..... connecting to webrtc"
}

export function updateCreatorsRoom(){
    destroyRoomButton.classList.add("hidden")
    exitButton.classList.remove("hidden")
    messagesContainer.innerHTML = "Please wait..... connecting to webrtc"
}