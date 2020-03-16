"use strict";

/** The chat history. */
const chatHistory = document.getElementById("chat-history");

document.getElementById("chat-input").addEventListener("keypress", onUserSendChat);

/**
 * Logs a message to the chat history.
 * @param {string} message
 */
function displayChat(message) {
    let paragraph = document.createElement("p");
    let node = document.createTextNode(message);
    paragraph.appendChild(node);

    chatHistory.appendChild(paragraph);

    scrollToLatestMessage();
}

/**
 * Logs a message to the chat history and console.
 * @param {string} message
 */
function logMessage(message) {
    console.log(message);
    displayChat(message);
}

/**
 * Scrolls to the bottom of the chat history.
 */
function scrollToLatestMessage() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

/**
 * Sends a chat message.
 * @param {string} message
 */
function sendChatMessage(message) {
    let data = {
        type: "map_chat",
        message: "&7<" + userData.displayName + ">&r " + message
    };
    data = `{"type":"map_chat","message":"<${userData.displayName}> ${message}"}`
    sendWsMessage(data);
}

/**
 * Called when the user sends a chat message.
 */
function onUserSendChat(event) {
    if (event.key === "Enter") {
        let message = event.target.value;
        sendChatMessage(message);
        event.target.value = '';
    }
}