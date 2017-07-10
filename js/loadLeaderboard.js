$(document).ready(function () {

    (function loadLeaderboard() {
        $.ajax({
            type: "GET",
            url: './data/leaderboard.json',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            // data: JSON.stringify(date),

            success: function (data) {

                data.forEach(function (item) {

                    var profile = $('<div class="profile">')
                        .append(
                            $('<div class="col-xs-6 profile-data border-right">')
                                .append(
                                    $('<div class="img-container">')
                                        .append(
                                            $('<img/>').attr('src', item.profilePic)
                                        )
                                        .append(
                                            $('<div class="rank-wrapper">')
                                                .append(
                                                    $('<div class="rank">').text(item.rank)
                                                )
                                        )
                                )
                                .append(
                                    $('<div class="info-container">')
                                        .append(
                                            $('<p class="sex-info">')
                                                .text(item.firstName + " ")
                                                .append(
                                                    $('<span>').text(item.gender)
                                                )
                                        )
                                        .append(
                                            $('<div class="weight-info">')
                                                .append(
                                                    $('<img/>')
                                                        .attr('src', "img/scales-icon-2.svg")
                                                )
                                                .append(
                                                    $('<span class="weight">').text(item.weight + " lb")
                                                )
                                                .append(
                                                    $('<span class="score">').text("SCORE: " + item.score)
                                                )
                                        )
                                )
                        )
                        .append(
                            $('<div class="col-xs-2 exercise-data squat border-right">')
                                .append(
                                    $('<p>').text('SQUAT')
                                )
                                .append(
                                    $('<span>').text(item.maxSquat)
                                )
                        )
                        .append(
                            $('<div class="col-xs-2 exercise-data bench-press border-right">')
                                .append(
                                    $('<p>').text('BENCH PRESS')
                                )
                                .append(
                                    $('<span>').text(item.maxBench)
                                )
                        )
                        .append(
                            $('<div class="col-xs-2 exercise-data deadlift">')
                                .append(
                                    $('<p>').text('DEADLIFT')
                                )
                                .append(
                                    $('<span>').text(item.maxDeadlift)
                                )
                        )
                        .appendTo($('.leaderboard'));


                    if( item.gender === null ) {
                        profile.find( $('.sex-info span') ).css('display', 'none');
                    }
                });

                // var profile = $($('.profile')[0]),
                //     rank = profile.find( $('.img-container .rank') );
                //
                // if( data.rank !== null ) {
                //     rank.text(data.rank);
                // } else {
                //     rank.css('display', 'none');
                // }
                //
                // profile.find( $('.img-container img') ).attr('src', data.profilePic);
                // profile.find( $('.sex-info span') ).text(data.gender);
                // profile.find( $('.weight-info .weight') ).text(data.weight + "lb");
                // profile.find( $('.weight-info .score') ).text("SCORE: " + data.score);
                //
                // profile.find( $('.exercise-data.squat span') ).text(data.maxSquat);
                // profile.find( $('.exercise-data.bench-press span') ).text(data.maxBench);
                // profile.find( $('.exercise-data.deadlift span') ).text(data.maxDeadlift);

            },
            error: function () {
                console.log("Internal Server Error. Not possible to load leaderboard data.");
            }
        });
    })()

});