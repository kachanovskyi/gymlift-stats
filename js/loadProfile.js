function loadProfile(param) {
    console.log('loading profile');
    $.ajax({
        type: "GET",
        url: './data/profile.json',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        // data: JSON.stringify(date),

        success: function (data) {

            var profile = $($('#profile')),
                rank = profile.find( $('.img-container .rank') ),
                gender = profile.find( $('.sex-info span') );

            if(!data.displayPublicRank && (param === "leaderboard") ) {
                $('#profile').css('display', 'none');
            }

            if( data.rank !== null ) {
                rank.text(data.rank);
            } else {
                rank.css('display', 'none');
            }

            if( data.gender !== null ) {
                gender.text(data.gender);
            } else {
                gender.css('display', 'none');
            }

            profile.find( $('.img-container img') ).attr('src', data.profilePic);
            profile.find( $('.weight-info .weight') ).text(data.weight + " lb");
            profile.find( $('.weight-info .score') ).text("SCORE: " + data.score);

            profile.find( $('.exercise-data.squat span') ).text(data.maxSquat);
            profile.find( $('.exercise-data.bench-press span') ).text(data.maxBench);
            profile.find( $('.exercise-data.deadlift span') ).text(data.maxDeadlift);

        },
        error: function () {
            console.log("Internal Server Error. Not possible to load profile data.");
        }
    });
};