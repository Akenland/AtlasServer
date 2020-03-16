"use strict";

/** Server host name. */
const hostname = "0.0.0.0";
/** Server port. */
const port = 1337;


// websocket and http servers
const http = require("https");
const webSocketServer = require("websocket").server;
const fs = require("fs");

const httpsOptions = {
    key: fs.readFileSync("https\\map.akenland.com.key"),
    cert: fs.readFileSync("https\\map.akenland.com.pem")
}


/** Latest 100 messages. */
//var history = [];
/** Current connected clients. */
let clients = [];


/**
 * Helper function for escaping input strings.
 */
function htmlEntities(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}


/**
 * HTTP Server
 */
const httpServer = http.createServer(httpsOptions, function (request, response) {
    let path = request.url.replace("/", "\\");
    //console.log(path); // DEBUG - log the path of the file that will be returned

    if(path.length<=1){
        path = "\\index.html";
    }

    fs.readFile("AtlasWebApp" + path, function (err, data) {
        if (typeof (data) !== "undefined") {
            response.writeHead(200);
            response.write(data);
            response.end();
        } else {
            response.writeHead(404);
            response.end();
            console.log(new Date() + "File not found: AtlasWebApp" + path)
        }
    })
});

httpServer.listen(port, hostname, function () {
    console.log(new Date() + " Atlas Server running at " + hostname + ":" + port);
});


/**
 * WebSocket server
 */
var wsServer = new webSocketServer({ httpServer: httpServer });

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on("request", function (request) {
    console.log(new Date() + " WebSocket connection from IP " + request.remoteAddress + ", origin " + request.origin);

    // TODO check origin
    var connection = request.accept(null, request.origin);

    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;
    var userName = request.remoteAddress;

    // send back chat history
    /*if (history.length > 0) {
        connection.sendUTF(JSON.stringify({ type: "history", data: history }));
    }*/

    // user sent some message
    connection.on('message', function (message) {
        if (message.type === 'utf8') { // accept only text
            var messageText = message.utf8Data;

            // first message sent by user is their name
            if (userName === false) {
                // remember user name
                userName = htmlEntities(messageText);

                console.log(new Date() + ' User is known as: ' + userName);
            }
            else {
                // log and broadcast the message
                console.log(new Date() + ' [' + userName + '] ' + messageText);

                // we want to keep history of all sent messages
                /*var obj = {
                    time: (new Date()).getTime(),
                    text: htmlEntities(messageText),
                    author: userName,
                };
                history.push(obj);
                history = history.slice(-100);*/

                // broadcast message to all connected clients
                //var json = JSON.stringify({ type: 'message', data: obj });
                clients.forEach(client => client.sendUTF(messageText));
            }
        }
    });

    // user disconnected
    connection.on('close', function (connection) {
        if (userName !== false) {
            console.log(new Date() + " " + connection.remoteAddress + " disconnected");
            // remove user from the list of connected clients
            clients.splice(index, 1);
        }
    });
});


/**
 * Watch log file
 */
//const filePath = '\\\\MCSERVER\\Testing_Spigot\\logs\\latest.log';

/*const TailingReadableStream = require('tailing-stream');

const stream = TailingReadableStream.createReadStream("\\\\MCSERVER\\Testing_Spigot\\logs\\latest.log", { timeout: 100000 });

stream.on('data', buffer => {
    console.log(buffer.toString());

    // we want to keep history of all sent messages
    var obj = {
        time: (new Date()).getTime(),
        text: htmlEntities(buffer.toString()),
        author: "Phoenix",
        color: 'red'
    };
    history.push(obj);
    history = history.slice(-100);
    // broadcast message to all connected clients
    var json = JSON.stringify({ type: 'message', data: obj });
    for (var i = 0; i < clients.length; i++) {
        clients[i].sendUTF(json);
    }
});
stream.on('close', () => {
    console.log("close");
});*/

/*var consoleData;

fs.watchFile(filePath, () => {
    console.log('Received new console data...');

    fs.readFile(filePath, (err, data) => {
        if (err) throw err;

        newData = data.toString().replace(consoleData, '');
        consoleData = data;

        var obj = {
            time: (new Date()).getTime(),
            text: htmlEntities(newData),
            author: "Phoenix",
            color: 'red'
        };
        history.push(obj);
        history = history.slice(-100);
        // broadcast message to all connected clients
        var json = JSON.stringify({ type: 'message', data: obj });
        for (var i = 0; i < clients.length; i++) {
            clients[i].sendUTF(json);
        }
    });
});*/