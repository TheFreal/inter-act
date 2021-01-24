var socket = io();

let canvasWidth;
let canvasHeight;
let particleConfig;
let player;
const emojiPerReact = 1;

socket.on('connect', () => {
    socket.emit("identify", { "device": "bigscreen" });
})

socket.on('viewcount', (data) => {
    $("#viewcount").text(data + " Zuschauer");
});

let previousReacts = new Array(20).fill(0)

socket.on('react', (data) => {
    console.log(data);

    // buffer previous reacts
    previousReacts.push(data);
    previousReacts.shift();
    if (previousReacts.every(v => v === data)) {
        console.log("that'S a lot of " + data + "!");
        previousReacts.fill(0);
        setTimeout(() => { $("#background").addClass("shake") }, 1000);
        setTimeout(() => { $("#background").removeClass("shake") }, 11000);
    }


    // audio logic
    if (previousReacts.filter((v) => (v == "clap")).length == 5 && player.paused) {
        player.src = "/res/sound/golfclap.mp3";
        player.play();
    }
    if (previousReacts.filter((v) => (v == "clap")).length == 15 && player.paused) {
        player.src = "/res/sound/applause.mp3";
        player.play();
    }

    switch (data) {
        case "laugh":
            for (let i = 0; i < emojiPerReact; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/laugh.png" });
            }
            break;
        case "eggplant":
            for (let i = 0; i < emojiPerReact; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/eggplant.png" });
            }
            break;
        case "clap":
            for (let i = 0; i < emojiPerReact; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/applause.png" });
            }
            break;
        case "wow":
            for (let i = 0; i < emojiPerReact; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/wow.png" });
            }
            break;
        case "think":
            for (let i = 0; i < emojiPerReact; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/think.png" });
            }
            break;
        case "heart":
            for (let i = 0; i < emojiPerReact; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/heart.png" });
            }
            break;
        case "no":
            for (let i = 0; i < emojiPerReact; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/no.png" });
            }
            break;
        case "sad":
            for (let i = 0; i < emojiPerReact; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/sad.png" });
            }
            break;
        case "yes":
            for (let i = 0; i < emojiPerReact; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/yes.png" });
            }
            break;
    }
});

socket.on("receive_proposal", (data) => {
    let id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    $("#proposal_list").append("<p id='" + id + "' class='proposal_text'>" + data + "</p>");
    $("#" + id).hide();
    $("#" + id).slideDown();
    setTimeout(() => {
        $("#" + id).slideUp(400, () => {
            $("#" + id).remove();
        });
    }, 4000)
});

$(() => {
    canvasWidth = $("#background").width();
    canvasHeight = $("#background").height();
    particleConfig = {
        end: "remove",
        amount: 0,
        duration: {
            duration: 10000,// 1000 == 1s default 10s
            random: false,// random between duration.duration and duration.min
            min: 5000,// minimum duration default 1s
        },
        speed: { speed: 1.6 },
        radius: { radius: 40, random: true, min: 10 },
        dir: {
            x: 1,
            y: -1,
            xrand: true,
            yrand: false,
            rand: false,
            xfunction: function (dx, px, dy, py, s, w, h, step) {
                return px += dx * s
            },
            yfunction: function (dx, px, dy, py, s, w, h, step) {
                return py += (dy * s)
            }
        },
        layout: "after",
        color: { color: { r: 255, g: 255, b: 255 }, random: false },
        bound: "hide",
        position: { x: (canvasWidth / 2), y: canvasHeight / 10 },
        opacity: {
            opacity: 0.7, // default opacity 1 if opacity.animation or opacity.random it is max opacity
            random: false,// random between opacity.opacity and opacity.min
            min: 0, // minimum opacity default 
            animation: true,
            decay: true  // if true opacity decreases until min opacity
        },
    }
    $("#background").particles(particleConfig);
    player = $("#audiotag")[0];
    $("#soundon").click(() => {
        $("#soundon").fadeOut();
    })
});
