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
    var database = firebase.database(),
        roundNumber, gameKey, playerName, gameUrl, roundDataUrl;

    document.getElementById('gameBody').style.display = 'none';
    document.getElementById('name').addEventListener('keyup', addRoundData);
    document.getElementById('electronics').addEventListener('keyup', addRoundData);
    document.getElementById('place').addEventListener('keyup', addRoundData);
    document.getElementById('btnStop').addEventListener('click', btnStopClick);
    document.getElementById('btnStart').addEventListener('click', startGameClick);

    database.ref('games').orderByKey().limitToLast(1).on('child_added', function (snapshot) {
        gameKey = snapshot.key;
        gameUrl = 'games/' + gameKey;
        database.ref(gameUrl + '/roundNumber').on('value', function (snapshot) {
            roundNumber = snapshot.val();
            console.log('roundNumber', roundNumber);
            manageStopDatabase();
        });
    });

    //TODO probably not needed
    function manageStopDatabase() {
        roundDataUrl = gameUrl + '/' + roundNumber + '/' + playerName + '/';
        database.ref(gameUrl + '/' + roundNumber + '/stop').on('value', stopGame);
    }

    function stopGame(snapshot) {
        var inputs = document.getElementsByTagName('input');
        for (var index = 0; index < inputs.length; ++index) {
            inputs[index].disabled = snapshot.val();
            //TODO Show STOP for a few seconds and clear screen to round 2
            inputs[index].value = '';
        }
    }

    function addRoundData($event) {
        database.ref(roundDataUrl + [$event.srcElement.id]).set($event.srcElement.value);
    }

    function btnStopClick() {
        database.ref(gameUrl + '/' + roundNumber + '/stop').set(true);
        roundNumber++;
        database.ref(gameUrl + '/roundNumber').set(roundNumber);
        manageStopDatabase();
    }

    function startGameClick() {
        playerName = document.getElementById('userName').value;
        manageStopDatabase();
        document.getElementById('gameBody').style.display = 'block';
        document.getElementById('introduction').style.display = 'none';
    }
}());