$(document).ready(function () {

    var date = {
        val: $("#datepicker").data('date')
    };

    loadProfile();

    loadExercises(date);

    $('.form-group .input-group-addon').on("click", function () {
        $(".datepicker .day").on("click", function () {
            date.val = $("#datepicker").data('date');
            loadExercises(date);
        });
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
        console.log('cleared!');
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


    function loadProfile() {
        $.ajax({
            type: "GET",
            url: './data/profile.json',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            // data: JSON.stringify(date),

            success: function (data) {

                var profile = $($('.profile')[0]),
                    rank = profile.find( $('.img-container .rank') );

                if( data.rank !== null ) {
                    rank.text(data.rank);
                } else {
                    rank.css('display', 'none');
                }

                profile.find( $('.img-container img') ).attr('src', data.profilePic);
                profile.find( $('.sex-info span') ).text(data.gender);
                profile.find( $('.weight-info .weight') ).text(data.weight + "lb");
                profile.find( $('.weight-info .score') ).text("SCORE: " + data.score);

                profile.find( $('.exercise-data.squat span') ).text(data.maxSquat);
                profile.find( $('.exercise-data.bench-press span') ).text(data.maxBench);
                profile.find( $('.exercise-data.deadlift span') ).text(data.maxDeadlift);

            },
            error: function () {
                console.log("Internal Server Error. Not possible to load profile data.");
            }
        });
    }

    function loadSquatGraph(param) {
        $.ajax({
            type: "GET",
            url: './data/profile.json',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            // data: JSON.stringify(date),

            success: function (data) {

                var profile = $($('.profile')[0]),
                    rank = profile.find( $('.img-container .rank') );

                if( data.rank !== null ) {
                    rank.text(data.rank);
                } else {
                    rank.css('display', 'none');
                }

            },
            error: function () {
                console.log("Internal Server Error. Not possible to load profile data.");
            }
        });
    }
    
    function buildGraph() {
        $.getJSON('./data/squatWeek.json', function (data) {

            Highcharts.chart('squatGraph', {
                // chart: {
                //     zoomType: 'x'
                // },
                // title: {
                //     text: 'USD to EUR exchange rate over time'
                // },
                // subtitle: {
                //     text: document.ontouchstart === undefined ?
                //         'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                // },
                xAxis: {
                    type: 'datetime'
                },
                // yAxis: {
                //     title: {
                //         text: 'Exchange rate'
                //     }
                // },
                // legend: {
                //     enabled: false
                // },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            // stops: [
                            //     [0, Highcharts.getOptions().colors[0]],
                            //     [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            // ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [{
                    type: 'area',
                    name: 'USD to EUR',
                    data: data
                }]
            });
        });
    }

    buildGraph();
});