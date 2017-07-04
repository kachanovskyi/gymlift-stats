$(document).ready(function () {

    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var day = days[ (new Date()).getDay() ];
    console.log(day);
    var month = months[ (new Date()).getMonth() ];
    console.log(month);

    var date = {
        val: $("#datepicker").data('date')
    };

    var dateParts = date.val.split("-");

    console.log((new Date(dateParts[2], (dateParts[1] - 1), dateParts[0])));

    loadExercises(date);

    $('#datepicker').on('change dp.change', function () {
        date.val = $('#datepicker').data('date');
        loadExercises(date);
    });


    $(".datepicker .day").on("changeDate", function (event) {
        console.log(event.format());
    });

    $('#squatTimeframe').on("change", function () {
        initGraph("squat", $(this).val());
    });
    $('#benchPressTimeframe').on("change", function () {
        initGraph("bench", $(this).val());
    });
    $('#deadliftTimeframe').on("change", function () {
        initGraph("deadlift", $(this).val());
    });


    function loadExercises(date) {
        $.ajax({
            type: "POST",
            url: './data/exercises.json',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(date),

            success: function (data) {
                clearExercises();
                printExercises(data);
            },
            error: function () {
                console.log("Internal Server Error. Not possible to load exercises data.");
            }
        });
    }

    function clearExercises() {
        $('.exercise-data-row').each(function () {
            $(this.remove());
        })
    }

    function printExercises(dataArr) {

        dataArr.forEach(function (item) {
            $('<div class="exercise-data-row">')
                .append(
                    $('<div class="col-xs-6 exercise-title border-right">')
                        .append(
                            $('<p>').text(item.exerciseName)
                        )
                )
                .append(
                    $('<div class="col-xs-2 exercise-data border-right">')
                        .append(
                            $('<p>').text("Weight")
                        )
                        .append(
                            $('<span>').text(item.weight)
                        )
                )
                .append(
                    $('<div class="col-xs-2 exercise-data border-right">')
                        .append(
                            $('<p>').text("Reps")
                        )
                        .append(
                            $('<span>').text(item.repetitions)
                        )
                )
                .append(
                    $('<div class="col-xs-2 exercise-data delete">')
                        .append(
                            $('<i>')
                                .addClass("fa fa-trash-o")
                                .attr("aria-hidden", true)
                        )
                        .on("click", function () {

                            var height = $(this).parent().height();

                            $('.delete-container').animate({
                                "left": "+=100%"
                            }, 200, function () {
                                $(this).remove();
                            });

                            $('<div class="delete-container">')
                                .css('height', height)
                                .css('left', "100%")
                                .append(
                                    $('<p>').text('Are you sure?')
                                )
                                .append(
                                    $('<div class="table-cell">')
                                        .append(
                                            $('<div class="float-right">')
                                                .append(
                                                    $('<a class="btn-white">')
                                                        .text('Delete')
                                                        .on("click", function () {

                                                            var exerciseRow = $(this).parent().parent().parent().parent();

                                                            var data = {
                                                                date: $("#datepicker").data('date'),
                                                                index: exerciseRow.index()
                                                            };

                                                            $.ajax({
                                                                type: "POST",
                                                                url: './data/exercises.json',
                                                                contentType: "application/json; charset=utf-8",
                                                                dataType: "json",
                                                                data: JSON.stringify(data),

                                                                success: function (data) {
                                                                    exerciseRow.remove();
                                                                },
                                                                error: function () {
                                                                    console.log("Internal Server Error. Not possible to delete exercise data.");
                                                                }
                                                            });
                                                        })
                                                )
                                                .append(
                                                    $('<a class="btn-simple">')
                                                        .text('Cancel')
                                                        .on("click", function () {
                                                            $(this).parent().parent().parent()
                                                                .animate({
                                                                    "left": "+=100%"
                                                                }, 200, function () {
                                                                    $(this).remove();
                                                                });
                                                        })
                                                )
                                        )
                                )
                                .appendTo($(this).parent())
                                .animate({
                                    'left': '-=100%'
                                }, 200)
                        })
                )
                .appendTo($("#history"));
        })

    }

    // function loadSquatGraph(param) {
    //     $.ajax({
    //         type: "GET",
    //         url: './data/profile.json',
    //         contentType: "application/json; charset=utf-8",
    //         dataType: "json",
    //         // data: JSON.stringify(date),
    //
    //         success: function (data) {
    //
    //             var profile = $($('.profile')[0]),
    //                 rank = profile.find( $('.img-container .rank') );
    //
    //             if( data.rank !== null ) {
    //                 rank.text(data.rank);
    //             } else {
    //                 rank.css('display', 'none');
    //             }
    //
    //         },
    //         error: function () {
    //             console.log("Internal Server Error. Not possible to load profile data.");
    //         }
    //     });
    // }
    
    function initGraph(param, timeframe) {
        var dataUrl = "./data/squatWeek.json";
        var chart = "squatGraph";

        if(timeframe === "month") {
            dataUrl = "./data/squatMonth.json";
        }

        if(param === "bench") {
            dataUrl = "./data/benchWeek.json";

            if(timeframe === "month") {
                dataUrl = './data/benchMonth.json';
            }

            chart = "benchPressGraph";
        } else if(param === "deadlift") {
            dataUrl = "./data/deadliftWeek.json";

            if(timeframe === "month") {
                dataUrl = './data/deadliftMonth.json';
            }

            chart = "deadliftGraph";
        }

        $.getJSON(dataUrl, function (data) {

            buildChart(chart, data)

        });
    }

    function buildChart(chart, data) {

        var categories = [];

        for(var i = 0; i < data.length; i++) {
            var dateParts = data[i][0].split('-');
            categories.push(dateParts[0] + " " + months[+dateParts[1] - 1]);
        }

        Highcharts.chart(chart, {
            chart: {
                backgroundColor: '#F9F9F9'
            },
            xAxis: {
                labels: {
                    formatter: function() {
                        return categories[this.value];
                    }
                },

                startOnTick: false,
                endOnTick: false,
                minPadding: 0,
                maxPadding: 0,

                gridLineWidth: 1
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 1,
                            y2: 1
                        },
                        stops: [
                            [0, "rgba(0, 0, 0, .08)"],
                            [1, "rgba(0, 0, 0, .08)"]
                        ]

                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1
                }
            },

            series: [{
                type: 'area',
                name:'weight',
                data: data
            }]
        });

    }

    initGraph("squat");
    initGraph("bench");
    initGraph("deadlift");
});