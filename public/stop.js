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
        dialog = document.querySelector('dialog'),
        letterDiv = document.getElementById('letterDiv'),
        letter, roundNumber, unsubscribeStop, gameKey, playerName, gameUrl, roundDataUrl;
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
    dialogPolyfill.registerDialog(dialog);
    document.getElementById('gameBody').style.display = 'none';
    document.getElementById('name').addEventListener('keyup', addRoundData);
    document.getElementById('electronics').addEventListener('keyup', addRoundData);
    document.getElementById('place').addEventListener('keyup', addRoundData);
    document.getElementById('famousPerson').addEventListener('keyup', addRoundData);
    document.getElementById('btnStop').addEventListener('click', btnStopClick);
    document.getElementById('btnStart').addEventListener('click', startGameClick);
    document.getElementById('btnClear').addEventListener('click', clearFieldsClick);

    //TODO probably not needed
    function createNewRound() {
        database.ref(gameUrl + '/' + getRoundNumber() + '/stop').on('value', stopGame);
    }

    function addRoundData($event) {
        database.ref(getRoundDataUrl() + [$event.srcElement.id]).set($event.srcElement.value);
    }

    function stopGame(snapshot) {
        if (snapshot.val()) {
            dialog.showModal();
        }
    }

    function btnStopClick() {
        database.ref(gameUrl + '/' + getRoundNumber() + '/stop').off('value');
        database.ref(gameUrl + '/' + getRoundNumber() + '/stop').set(true);
        roundNumber++;
        database.ref(gameUrl + '/roundNumber').set(roundNumber);
        createNewRound();
    }

    function startGameClick() {
        playerName = document.getElementById('userName').value;
        database.ref('games').orderByKey().limitToLast(1).on('child_added', function (snapshot) {
            gameUrl = 'games/' + snapshot.key;
            database.ref(gameUrl + '/letter').on('value', function (snapshot) {
                letterDiv.textContent = snapshot.val() !== null ? snapshot.val() : letterDiv.textContent;
            });
            database.ref(gameUrl + '/roundNumber').on('value', function (snapshot) {
                roundNumber = snapshot.val();
                createNewRound();
            });
        });
        document.getElementById('gameBody').style.display = 'block';
        document.getElementById('introduction').style.display = 'none';
    }

    function clearFieldsClick() {
        var inputs = document.getElementsByTagName('input');
        for (var index = 0; index < inputs.length; ++index) {
            inputs[index].value = '';
        }
    }

    function getRoundNumber() {
        return roundNumber;
    }

    function getRoundDataUrl() {
        console.log(gameUrl + '/' + playerName);
        return gameUrl + '/players/' + playerName + '/' + getRoundNumber() + '/';
    }

}());