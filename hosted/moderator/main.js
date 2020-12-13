var socket = io();

let myId, chart, history;

let stats = {
    "laugh": 0,
    "clap": 0,
    "wow": 0,
    "eggplant": 0,
    "think": 0,
    "heart": 0
}

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

function reset() {
    $("#view_peak").text(currentCount);
    Object.keys(stats).forEach(k => stats[k] = 0);
    $("[id$=count]").text("0");
    chart.data.datasets[0].data = [0, 0, 0, 0, 0, 0]
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
            labels: ['😂', '👏', '😮', '😏', '🤔', '❤'],
            datasets: [{
                label: 'Reactions',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, .6)',
                    'rgba(54, 162, 235, .6)',
                    'rgba(255, 206, 86, .6)',
                    'rgba(75, 192, 192, .6)',
                    'rgba(153, 102, 255, .6)',
                    'rgba(255, 159, 64, .6)'
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
                    borderColor: 'rgba(255, 99, 132, .6)'
                },
                {
                    label: 'Klatschen',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, .6)'
                },
                {
                    label: 'Wow',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: 'rgba(255, 206, 86, .6)'
                },
                {
                    label: 'Zwinker',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, .6)'
                },
                {
                    label: 'Denken',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: 'rgba(153, 102, 255, .6)'
                },
                {
                    label: 'Herz',
                    data: [],
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    borderColor: 'rgba(255, 159, 64, .6)'
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