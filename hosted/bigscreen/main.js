var socket = io();

const particleConfig = {
    end: "remove",
    amount: 0,
    duration: {
        duration: 7000,// 1000 == 1s default 10s
        random: true,// random between duration.duration and duration.min
        min: 4000,// minimum duration default 1s
    },
    speed: { speed: 3 },
    radius: { radius: 40, random: true, min: 20 },
    dir: {
        x: 1,
        y: 1,
        xrand: true,
        yrand: true,
        rand: false,
        xfunction: function (dx, px, dy, py, s, w, h, step) {
            return px += dx * s
        },
        yfunction: function (dx, px, dy, py, s, w, h, step) {
            return py += dy * s
        }
    },
    layout: "after",
    color: { color: { r: 255, g: 255, b: 255 }, random: false },
    bound: "back",
    position: { x: 0, y: 0 },
    opacity: {
        opacity: 0.6, // default opacity 1 if opacity.animation or opacity.random it is max opacity
        random: false,// random between opacity.opacity and opacity.min
        min: 0, // minimum opacity default 
        animation: true,
        decay: true  // if true opacity decreases until min opacity
    },

};

socket.on('viewcount', (data) => {
    console.log("there are now " + data + " connected viewers");
});

socket.on('react', (data) => {
    console.log(data);
    switch (data) {
        case "angry":
            for (let i = 0; i < 5; i++) {
                $("#background").particles("add", { amount: 100, color: { color: { r: 255, g: 0, b: 0 }, random: false } });
            }
            break;
        case "laugh":
            for (let i = 0; i < 5; i++) {
                $("#background").particles("add", { amount: 100, color: { color: { r: 255, g: 255, b: 0 }, random: false } });
            }
            break;
        case "eggplant":
            for (let i = 0; i < 5; i++) {
                $("#background").particles("add", { amount: 100, color: { color: { r: 100, g: 0, b: 255 }, random: false } });
            }
            break;
    }
});

$(() => {
    $("#background").particles(particleConfig);
});