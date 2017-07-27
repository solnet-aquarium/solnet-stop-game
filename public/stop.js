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
    var databaseUserName, database = firebase.database();
    
    document.getElementById('gameBody').style.display = 'none';
    document.getElementById('name').addEventListener('keypress', addDataToFirebase);
    document.getElementById('electronics').addEventListener('keypress', addDataToFirebase);
    document.getElementById('place').addEventListener('keypress', addDataToFirebase);
    document.getElementById('btnStop').addEventListener('click', btnStopClick);
    document.getElementById('btnStart').addEventListener('click', startGameClick);

    database.ref('stop').on('value', function (snapshot) {
        if (snapshot.val().stop) {
            var inputs = document.getElementsByTagName('input');
            for (var index = 0; index < inputs.length; ++index) {
                inputs[index].disabled = true;
            }
        }
    });
    function addDataToFirebase($event) {
        database.ref(databaseUserName + '/' + [$event.srcElement.id]).set($event.srcElement.value);
    }
    function btnStopClick() {
        database.ref('stop').set({stop: true});
    }
    function startGameClick() {
        databaseUserName = document.getElementById('userName').value;
        document.getElementById('gameBody').style.display = 'block';
        document.getElementById('introduction').style.display = 'none';
    }
}());