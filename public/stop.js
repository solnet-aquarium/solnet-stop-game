(function () {
    'use strict';
    var config = {
        apiKey: "AIzaSyBX-6C-ju_GJEkvmqDd-gBEfIAP8_3fjZQ",
        authDomain: "solnet-stop.firebaseapp.com",
        databaseURL: "https://solnet-stop.firebaseio.com",
        projectId: "solnet-stop",
        storageBucket: "solnet-stop.appspot.com",
        messagingSenderId: "97790153221"
    };
    firebase.initializeApp(config);
    var  database = firebase.database(), roundNumber = 0, gameKey, databaseUserName, roundDatabaseUrl, roundDataUrl;
    //DOM
    document.getElementById('gameBody').style.display = 'none';
    document.getElementById('name').addEventListener('keyup', addRoundData);
    document.getElementById('electronics').addEventListener('keyup', addRoundData);
    document.getElementById('place').addEventListener('keyup', addRoundData);
    document.getElementById('btnStop').addEventListener('click', btnStopClick);
    document.getElementById('btnStart').addEventListener('click', startGameClick);

    database.ref('games').orderByKey().limitToLast(1).on('child_added', function (snapshot) {
        gameKey = snapshot.key;
        roundDatabaseUrl = 'games/' + gameKey + '/' + roundNumber + '/';
        database.ref(roundDatabaseUrl + 'stop').on('value', function (snapshot) {
            if (snapshot.val()) {
                var inputs = document.getElementsByTagName('input');
                for (var index = 0; index < inputs.length; ++index) {
                    inputs[index].disabled = snapshot.val().stop;
                }
                if (snapshot.val().stop) {
                    roundNumber++;
                }
            }
        });
    });

    function addRoundData($event) {
        database.ref(roundDataUrl + [$event.srcElement.id]).set($event.srcElement.value);
    }

    function btnStopClick() {
        database.ref(roundDatabaseUrl + '/stop').set({
            stop: true
        });
        //Show STOP, clear screen to round 2
    }

    function startGameClick() {
        databaseUserName = document.getElementById('userName').value;
        roundDataUrl = roundDatabaseUrl + databaseUserName + '/';
        document.getElementById('gameBody').style.display = 'block';
        document.getElementById('introduction').style.display = 'none';
    }
}());