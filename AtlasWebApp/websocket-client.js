"use strict";

/** The websocket URL (endpoint) for the Atlas server. Default "ws://localhost:8080". */
const wsUrl = "wss://map.akenland.com";

/** The world to render. All other world data will be ignored. */
//let worldName = "galvin_flat_14";


/** The websocket connection. */
const connection = new WebSocket(wsUrl);

/** Data about the logged-in map user. */
let userData = {
    displayName: "Anonymous"
}


/**
 * Fired when the websocket connection is opened.
 */
connection.onopen = function () {
    logMessage("Connected to Atlas server.");

    document.getElementById("location-name").innerHTML = "World " + worldName;
};

/**
 * Fired when the websocket connection has an error.
 */
connection.onerror = function (error) {
    logMessage("Unable to connect to Atlas server.");
};

/**
 * Fired when a message is received from the websocket server.
 */
connection.onmessage = function (message) {
    let json;
    try {
        json = JSON.parse(message.data);
    } catch (e) {
        logMessage("Received invalid data: " + message.data);
        return;
    }

    switch (json.type) {
        case "game_chat": case "map_chat":
            displayChat(json.message);
            break;

        case "user_data":
            if (json.permissionLevel > 0) {
                userData.displayName = json.displayName;
                displayChat("Logged in as " + json.displayName);
            } else {
                displayChat("Join the server to enable all interactive map features.");
            }
            break;

        case "block_place":
            if (json.world === worldName) {
                placeBlock(json.x, json.y, json.z, json.material);
            }
            break;

        case "block_break":
            if (json.world === worldName) {
                breakBlock(json.x, json.y, json.z);
            }
            break;

        default:
            logMessage("Received unknown data: " + json.message);
            break;
    }
};


/**
 * Sends a message to the websocket server.
 */
function sendWsMessage(message) {
    connection.send(message);
}