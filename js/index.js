$(document).ready(function () {

    $('#loader').modal();
    $('#loader').modal("hide");

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var day = days[(new Date()).getDay()];
    var month = months[(new Date()).getMonth()];

    var $datepicker = $('#datepicker');

    $datepicker.datetimepicker({
        defaultDate: new Date(),
        format: 'DD-MM-YYYY',
        pickTime: false,
        endDate: '+0d'
    });

    var date = {
        val: $datepicker.data('date')
    };

    var today = date.val;

    var dateParts = date.val.split("-");

    // console.log((new Date(dateParts[2], (dateParts[1] - 1), dateParts[0])));

    loadExercises();

    $datepicker.on('change dp.change', function () {
        date.val = $('#datepicker').data('date');
        loadExercises(date);
    });

    $('#resetDate').on("click", function () {

        $datepicker.datetimepicker('update');
        $datepicker.datetimepicker().children('input').val(today);

    });


    // $(".datepicker .day").on("changeDate", function (event) {
    //     console.log(event.format());
    // });

    // $('#squatTimeframe').on("change", function () {
    //     initGraph("squat", $(this).val());
    // });
    // $('#benchPressTimeframe').on("change", function () {
    //     initGraph("bench", $(this).val());
    // });
    // $('#deadliftTimeframe').on("change", function () {
    //     initGraph("deadlift", $(this).val());
    // });

    //TODO
    function loadExercises() {
        $.ajax({
            type: "GET",
            url: './data/exercises.json',
            // contentType: "application/json; charset=utf-8",
            // dataType: "json",
            // data: JSON.stringify(date),

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

            var day = $('#history').find($('#' + item.time.month + item.time.dayOfYear));

            if ((day === undefined) || !day || !day.length) {

                // TODO
                day = $('<div>')
                    .addClass('exercise-day')
                    .attr('id', item.time.month + item.time.dayOfYear)
                    .append(
                        $('<div class="chart-top-block">')
                            .append(
                                $('<p>').text(item.time.dayOfWeek + ", " + item.time.month + " " + item.time.dayOfMonth)
                            )
                    )
                    .appendTo($("#history"));

            }
            //TODO
            var exerciseTitle = $('<div class="col-xs-4 exercise-title border-right">')
                .append(
                    $('<p>').text(item.exerciseName)
                );

            if (item.note) {
                exerciseTitle
                    .append(
                        $('<i class="fa fa-info-circle note" aria-hidden="true"></i>')
                    )
                    .on("click", function () {
                        var note = $(this).parent().parent().find('.note-area');

                        $('.note-area').each(function () {
                            if($(this).is(":visible")) {
                                $(this).slideUp("fast");
                            }
                        });

                        if(note.is(':hidden')) {
                            note.slideDown("fast");
                        } else {
                            note.slideUp("fast");
                        }
                    });
            }

            var exerciseRow = $('<div class="exercise-data-row">')
                .append(
                    $('<div class="inner">')
                        .append(
                            exerciseTitle
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
                            $('<div class="col-xs-2 exercise-data border-right">')
                                .append(
                                    $('<p>').text("RPE")
                                )
                                .append(
                                    $('<span>').text(item.effort)
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
                                                                        date: item.time.dayOfMonth + '-' + (+item.time.monthValue + 1) + '-' + item.time.year,
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
                );


            //TODO
            if (item.note) {
                exerciseRow.append(
                    $('<div class="note-area">')
                        .text(item.note)
                        .hide()
                )
            }
            exerciseRow.appendTo(day);
        })

    }

    function initGraph(param) {
        var dataUrl = "./data/squatWeek.json";
        var chart = "squatGraph";

        if (param === "bench") {

            dataUrl = "./data/benchWeek.json";
            chart = "benchPressGraph";

        } else if (param === "deadlift") {

            dataUrl = "./data/deadliftWeek.json";
            chart = "deadliftGraph";

        } else if (param === "relative") {

            dataUrl = "./data/relativeYear.json";
            chart = "relativeGraph";

        } else if (param === "total") {

            dataUrl = "./data/relativeYear.json";
            chart = "totalGraph";

        }

        $.getJSON(dataUrl, function (data) {

            buildChart(chart, data)

        });
    }

    function buildChart(chart, data) {

        var categories = [];
        var seriesName = chart === "relativeGraph" ? "score" : "weight";

        for (var i = 0; i < data.length; i++) {
            var dateParts = data[i][0].split('-');
            if (dateParts[1] !== undefined) {
                categories.push(dateParts[0] + " " + months[+dateParts[1] - 1]);
            } else {
                categories.push(dateParts[0]);
            }
        }

        Highcharts.chart(chart, {
            chart: {
                backgroundColor: '#F9F9F9'
            },
            xAxis: {
                labels: {
                    formatter: function () {
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
                name: seriesName,
                data: data
            }]
        });

    }

    initGraph("relative");
    initGraph("total");
    initGraph("squat");
    initGraph("bench");
    initGraph("deadlift");
});