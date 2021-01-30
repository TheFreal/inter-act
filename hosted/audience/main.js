var socket = io();

socket.on('viewcount', (data) => {
    $("#viewcount").text(data + " Zuschauer");
});

socket.on('askfor_proposals', (data) => {
    if (data?.close != false) {
        $("#proposal").slideUp();
        return;
    }
    console.log("Asking for proposals!");
    $("#proposal").slideDown();
    $("#proposal_question").text(data.prompt);
});

$(() => {
    $("#proposal").hide();

    $("#react_laugh").click(() => {
        socket.emit("react", "laugh");
    })

    $("#react_clap").click(() => {
        socket.emit("react", "clap");
    })

    $("#react_eggplant").on("click", () => {
        socket.emit("react", "eggplant");
    })

    $("#react_wow").on("click", () => {
        socket.emit("react", "wow");
    })

    $("#react_heart").on("click", () => {
        socket.emit("react", "heart");
    })

    $("#react_think").on("click", () => {
        socket.emit("react", "think");
    })

    $("#react_yes").on("click", () => {
        socket.emit("react", "yes");
    })

    $("#react_sad").on("click", () => {
        socket.emit("react", "sad");
    })

    $("#react_no").on("click", () => {
        socket.emit("react", "no");
    })

    $("#proposal_form").submit((e) => {
        e.preventDefault();
        socket.emit("receive_proposal", $("#proposal_text").val());
        $("#proposal_text").val("");
    })
});