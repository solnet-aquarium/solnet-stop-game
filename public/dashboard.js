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
    firebase.database().ref('games').orderByKey().limitToLast(1).on('child_added', function (snapshot) {
        var game = snapshot.val();

        for (var i = 0; i < 3; i++) {
            console.log(snapshot.val()[i]);
        }
        console.log(Object.keys(snapshot.val()));
    });
}());