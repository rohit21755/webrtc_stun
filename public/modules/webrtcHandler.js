import * as uiUtils from "./uiUtils.js"
import { DOM } from "./uiUtils.js"
// global variables
let pc; // PeerConnection object
let dataChannel;

const webRTCConfiguration = {
    iceServers:[
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
            ],
        }
    ]
}

export function startWebrtcProcess(){
    uiUtils.LogToCustomConsole("Starting WebRTC process by clicking on the button", "green")
    DOM.offeror.offerorCreatePcButton.addEventListener("click", ()=>{
        createPeerConnectionObject()

        // ui update
        uiUtils.updateUiButton(DOM.offeror.offerorCreatePcButton, "Peer connection object created, now add data  channel")
        // addDataLogic();
    })
    DOM.offeror.offerorAddDataTypeButton.addEventListener("click", ()=>{
        //create our dataChannel
        createDataChannel(true);
        uiUtils.updateUiButton(DOM.offeror.offerorAddDataTypeButton, "Now create your WebRTC offer")
    })
    
} // end of startWebrtcProcess

// search about sctp data channel, stcp bits and types
// data channels and how to use them + which type of data is needed for it
// RTCSCTPTransport object
function createDataChannel(isOfferor){
    if(isOfferor){
        // only need to create a data channel once, when offer is established
        // to mimic udp type transport on our data channel, set the ordered attribute to false, ans the maxretransmited to 0
        dataChannel = pc.createDataChannel("dataChannel", {
            ordered: false,
            maxRetransmits: 0,
        })
        // add an event listener to the data channel
        registerDataChannelEventListeners();
        uiUtils.LogToCustomConsole("Successfully created a data channel and added it to your pc object");
    } else {
        // if this else is executed, we are dealing with the oferree
        // the receiver needs to register a ondatachannel listener
        // this will only fire once a valid webrtc connection has been established

        pc.ondatachannel = (e) =>{
            dataChannel = e.channel;
            registerDataChannelEventListeners();
            uiUtils.LogToCustomConsole("SUccessfull registred the data channel it to your pc object")
        }
    }
}



function createPeerConnectionObject(){
    pc = new RTCPeerConnection(webRTCConfiguration)
    pc.addEventListener("connectionstatechange", ()=>{
        console.log("connectionstatechange", pc.connectionState)
        if(pc.connectionState === "connected"){
            alert("Connection established")
            uiUtils.LogToCustomConsole("Connection established", "green", true)
            // update ui to remove all the learning buttons, and allow users to insert text
        }
    })
    pc.addEventListener("signalingstatechange", ()=>{
        // console.log("signalingstatechange", pc.signalingState)
        // if(pc.signalingState === "stable"){
        //     alert("Signaling state stable")
        // }
        uiUtils.LogToCustomConsole("Signaling state stable", "orange", true)
    })

    return uiUtils.LogToCustomConsole("Peer connection object created", "green", true)
}

function registerDataChannelEventListeners(){
    dataChannel.addEventListener("message", (e)=>{
        console.log("message received", e.data)
        // later , ewe can implement logic to add the message to users frontend
    })
    dataChannel.addEventListener("open", (e)=>{
        console.log("data channel are open youre now ready to send/receive messages over your data channel")
    })
    dataChannel.addEventListener("close", (e)=>{
        console.log("Data channel has been closed")
    })
    dataChannel.addEventListener("error", (e)=>{})
}