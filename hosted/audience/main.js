var socket = io();

socket.on('viewcount', (data) => {
    $("#viewcount").text(data + " Zuschauer");
});

socket.on('askfor_proposals', (data) => {
    if (data?.close != false) {
        $("#proposal").hide();
        return;
    }
    console.log("Asking for proposals!");
    $("#proposal").show();
    $("#proposal_question").text(data.prompt);
});

$(() => {
    $("#react_laugh").click(() => {
        socket.emit("react", "laugh");
    })

    $("#react_clap").click(() => {
        socket.emit("react", "clap");
    })

    $("#react_eggplant").on("click", () => {
        socket.emit("react", "eggplant");
    })

    $("#react_angry").on("click", () => {
        socket.emit("react", "angry");
    })

    $("#proposal_submit").on("click", () => {
        socket.emit("receive_proposal", $("#proposal_text").val());
        $("#proposal_text").val("");
    })
});