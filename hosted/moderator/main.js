var socket = io();

let myId;

socket.on("connect", (data) => {
    socket.emit("identify", { "device": "moderator" }, (id) => {
        myId = id;
        console.log("My id is " + id);
    });
})

socket.on('viewcount', (data) => {
    $("#viewcount").text(data + " Zuschauer");
});

$(() => {
    $("#proposal_open").on("click", () => {
        socket.emit("askfor_proposals", { "close": false, "id": myId, "prompt": $("#proposal_text").val() })
    })

    $("#proposal_close").on("click", () => {
        socket.emit("askfor_proposals", { "close": true, "id": myId })
    })
})