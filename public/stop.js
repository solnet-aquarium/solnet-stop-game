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
        dialogLooser = document.getElementById('dialogLooser'),
        dialogWinner = document.getElementById('dialogWinner'),
        letterDiv = document.getElementById('letterDiv'),
        scoreDiv = document.getElementById('score'),
        letter, roundNumber, unsubscribeStop, gameKey, playerName, gameUrl, roundDataUrl;
    dialogPolyfill.registerDialog(dialogLooser);
    dialogPolyfill.registerDialog(dialogWinner);
    document.getElementById('gameBody').style.display = 'none';
    document.getElementById('name').addEventListener('keyup', addRoundData);
    document.getElementById('electronics').addEventListener('keyup', addRoundData);
    document.getElementById('place').addEventListener('keyup', addRoundData);
    document.getElementById('famousPerson').addEventListener('keyup', addRoundData);
    document.getElementById('btnStop').addEventListener('click', btnStopClick);
    document.getElementById('btnStart').addEventListener('click', startGameClick);
    document.getElementById('btnClear').addEventListener('click', clearFieldsClick);

    function createNewRound() {
        database.ref(gameUrl + '/' + roundNumber + '/stop').on('value', function (snapshot) {
            if (snapshot.val()) {
                dialogLooser.showModal();
            }
        });
    }

    function addRoundData($event) {
        database.ref(getRoundDataUrl() + [$event.srcElement.id]).set($event.srcElement.value);
    }

    function restart() {
        var inputs = document.getElementsByTagName('input');
        for (var index = 0; index < inputs.length; index++) {
            inputs[index].value = '';
        }
        if (dialogLooser.open) {
            dialogLooser.close();
        }
        if (dialogWinner.open) {
            dialogWinner.close();
        }
    }

    function btnStopClick() {
        database.ref(gameUrl + '/' + roundNumber + '/stop').off('value');
        database.ref(gameUrl + '/' + roundNumber + '/stop').set(true);
        database.ref(gameUrl + '/restart').set(false);
        roundNumber++;
        database.ref(gameUrl + '/roundNumber').set(roundNumber);
        createNewRound();
        dialogWinner.showModal();
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
            database.ref(gameUrl + '/restart').on('value', function (snapshot) {
                if (snapshot.val()) {
                    restart();
                }
            });
            database.ref(gameUrl + '/players/' + playerName + '/score').on('value', function (snapshot) {
                if (snapshot.val()) {
                    scoreDiv.innerText = 'Score: ' + snapshot.val();
                }
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

    function getRoundDataUrl() {
        return gameUrl + '/players/' + playerName + '/rounds/' + roundNumber + '/';
    }
}());