var socket = io();

let canvasWidth;
let canvasHeight;
let particleConfig;

socket.on('viewcount', (data) => {
    console.log("there are now " + data + " connected viewers");
    $("#viewcount").text(data + " Zuschauer");
});


//note, this is not a todo but just initial random data
let previousReacts = new Array(20).fill(0)

socket.on('react', (data) => {
    console.log(data);

    // buffer previous reacts
    previousReacts.push(data);
    previousReacts.shift();
    if (previousReacts.every(v => v === data)) {
        console.log("that'S a lot of " + data + "!");
        previousReacts.fill(0);
        $("#background").addClass("shake");
        setTimeout(() => { $("#background").removeClass("shake") }, 5000);
    }

    switch (data) {
        case "angry":
            for (let i = 0; i < 5; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/angry.png" });
            }
            break;
        case "laugh":
            for (let i = 0; i < 5; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/laugh.png" });
            }
            break;
        case "eggplant":
            for (let i = 0; i < 5; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/eggplant.png" });
            }
            break;
        case "clap":
            for (let i = 0; i < 5; i++) {
                $("#background").particles("add", { amount: 100, image: "/res/img/applause.png" });
            }
            break;
    }
});

$(() => {
    canvasWidth = $("#background").width();
    canvasHeight = $("#background").height();
    particleConfig = {
        end: "remove",
        amount: 0,
        duration: {
            duration: 7000,// 1000 == 1s default 10s
            random: true,// random between duration.duration and duration.min
            min: 4000,// minimum duration default 1s
        },
        speed: { speed: 2 },
        radius: { radius: 30, random: true, min: 10 },
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
                return py += (dy * s) / 0.5
            }
        },
        layout: "after",
        color: { color: { r: 255, g: 255, b: 255 }, random: false },
        bound: "back",
        position: { x: (canvasWidth / 2), y: (canvasWidth * 1.5) },
        opacity: {
            opacity: 0.6, // default opacity 1 if opacity.animation or opacity.random it is max opacity
            random: false,// random between opacity.opacity and opacity.min
            min: 0, // minimum opacity default 
            animation: false,
            decay: true  // if true opacity decreases until min opacity
        },
    }
    $("#background").particles(particleConfig);
});