var socket = io();

socket.on('viewcount', (data) => {
    console.log("there are now " + data + " connected viewers");
    $("#viewcount").text(data)
});

$(function () {
    $("#react_laugh").click(() => {
        socket.emit("react", "laugh");
    })

    $("#react_clap").click(() => {
        socket.emit("react", "clap");
    })

    $("#react_eggplant").on("click", () => {
        socket.emit("react", "eggplant");
    })
});