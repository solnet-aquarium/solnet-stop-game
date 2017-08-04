const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function (childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });
    return returnArr;
};
exports.calculateScore = functions.database.ref('/games/{:gameId}/roundNumber')
    .onUpdate(function (event) {
        var eventSnapshot = event.data;
        event.data.ref.parent.child('players').once('value', function (playersDataSnapshot) {
            var playerArray = snapshotToArray(playersDataSnapshot);
            playerArray.forEach(function (player) {
                var score = 0;
                var roundArray = [];
                if (player.rounds.constructor !== Array) {
                    roundArray = Object.keys(player.rounds).map(function (key) {
                        return player.rounds[key];
                    });
                } else {
                    roundArray = player.rounds;
                }
                roundArray.map(function (round) {
                    var keys = Object.keys(round);
                    for (var i = 0; i < keys.length; i++) {

                        if (round[keys[i]].length > 2) {
                            score += 25;
                        }
                    }
                });
                event.data.ref.parent.child('players/' + player.key).update({
                    score: score
                });
            }, this);
        });
    });