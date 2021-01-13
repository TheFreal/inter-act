var socket = io();

let myId, chart, history, propchart;

let stats = {
    "laugh": 0,
    "clap": 0,
    "wow": 0,
    "eggplant": 0,
    "think": 0,
    "heart": 0,
    "no": 0,
    "sad": 0,
    "yes": 0,
    "proposals": 0
}

let prop_lengths = [];

socket.on("connect", (data) => {
    socket.emit("identify", { "device": "moderator" }, (id) => {
        myId = id;
        console.log("My id is " + id);
    });
})

let currentCount = 0;
socket.on('viewcount', (data) => {
    $("#view_current").text(data);
    if (currentCount < data) {
        $("#view_peak").text(data);
    }
    currentCount = data;
});

//handle reacts
socket.on('react', (data) => {
    stats[data]++;
    $("#" + data + "_count").text(stats[data]);
    chart.data.datasets[0].data = Object.values(stats)
    chart.update();
    Object.values(stats).forEach((count, index) => {
        console.log(count + ", " + index + ", " + Date.now());
        history.data.datasets[index].data.push({ x: Date.now(), y: count })
    })
    history.update();
});

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

// handle proposals
socket.on('receive_proposal', (data) => {
    let proplength = data.length;
    stats.proposals++;
    $("#proposal_count").text(stats.proposals);
    prop_lengths.push(proplength)
    let average_length = average(prop_lengths);
    $("#proposal_avg").text(Math.round(average_length * 100) / 100);
    // now for the chart...
    let old = propchart.data.datasets[0].data;
    console.log("current dataset has " + old.length + " values, new value is " + proplength);
    if (proplength < old.length) {
        console.log("adding to existing array")
        // length already has a bar, nice and easy
        propchart.data.datasets[0].data[proplength]++;

    } else {
        console.log("making a new array")
        // we need to add more zeroes, up until proplength
        console.log("old: " + old);
        console.log("we need to add " + (proplength - old.length) + " zeroes")
        let fill = new Array(proplength - old.length).fill(0);
        console.log("fill: " + fill);
        let newarr = old.concat(fill);
        // then push that final, highest value
        newarr.push(1);
        console.log("new: " + newarr);
        propchart.data.labels = Array.from(Array(newarr.length).keys())
        propchart.data.datasets[0].data = newarr;
    }
    propchart.update();
})

function reset() {
    $("#view_peak").text(currentCount);
    Object.keys(stats).forEach(k => stats[k] = 0);
    $("[id$=count]").text("0");
    chart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    chart.update()
}

$(() => {

    $("#stats").hide()
    $("#controls").show()
    $("#mod").hide()

    //navigation logic
    $(".tab").on("click", (event) => {
        $(".tab").removeClass("selected");
        $(event.target).addClass("selected");
        switch (event.target.id) {
            case "tab_stats":
                $("#stats").show()
                $("#controls").hide()
                $("#mod").hide()
                break;
            case "tab_controls":
                $("#stats").hide()
                $("#controls").show()
                $("#mod").hide()
                break;
            case "tab_mod":
                $("#stats").hide()
                $("#controls").hide()
                $("#mod").show()
                break;
        }
    })

    //setup bar chart
    const chartCanvas = $("#stats_chart")[0];
    chart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: ['😂', '👏', '😮', '😏', '🤔', '❤', "👍", "😥", "👎"],
            datasets: [{
                label: 'Reactions',
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    '#f44336',
                    '#9c27b0',
                    '#3f51b5',
                    '#2196f3',
                    '#00bcd4',
                    '#4caf50',
                    '#cddc39',
                    '#ffc107',
                    '#795548',
                ],
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    //setup history chart
    const historyCanvas = $("#stats_history")[0];
    history = new Chart(historyCanvas, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Lachen',
                    data: [],
                    showLine: true,
                    pointRadius: 0,
                    fill: false,
                    borderColor: '#f44336'
                },
                {
                    label: 'Klatschen',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: '#9c27b0'
                },
                {
                    label: 'Wow',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: '#3f51b5'
                },
                {
                    label: 'Zwinker',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: '#2196f3'
                },
                {
                    label: 'Denken',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: '#00bcd4'
                },
                {
                    label: 'Herz',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: '#4caf50'
                },
                {
                    label: 'Nein',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: '#cddc39'
                }, {
                    label: 'Traurig',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: '#ffc107'
                }, {
                    label: 'Ja',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: '#795548'
                }
            ]
        },
        options: {
            animation: {
                duration: 0
            },
            legend: {
                display: true
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        let time = new Date(tooltipItem.xLabel).toLocaleTimeString();
                        console.log(data);
                        return time + ": " + tooltipItem.value + " " + data.datasets[tooltipItem.datasetIndex].label;
                    }
                },
                mode: 'nearest',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    display: false
                }]
            },
        }
    });

    //setup bar chart
    const propChartCanvas = $("#stats_proposals")[0];
    propchart = new Chart(propChartCanvas, {
        type: 'bar',
        data: {
            datasets: [{
                backgroundColor: "#795548",
                label: 'Proposal length',
                data: [0],
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    $("#proposal_open").on("click", () => {
        socket.emit("askfor_proposals", { "close": false, "id": myId, "prompt": $("#proposal_text").val() })
    })

    $("#proposal_close").on("click", () => {
        socket.emit("askfor_proposals", { "close": true, "id": myId })
    })

    $("#reset_stats").on("click", () => {
        reset();
    })

})