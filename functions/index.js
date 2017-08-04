const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.calculateScore = functions.database.ref('/games/{:gameId}/roundNumber')
    .onUpdate(function (event) {
        var eventSnapshot = event.data;
        event.data.ref.parent.child('players').on('value', function (playersDataSnapshot) {
            var players = playersDataSnapshot.val();
            var playerArray = Object.keys(players).map(function (key) {
                return {
                    'rounds': players[key],
                    'playerName': key
                };
            });
            playerArray.forEach(function (player) {
                var score = 0;
                player.rounds.map(function (round) {
                    score += Object.keys(round).length * 20;
                });
                event.data.ref.parent.child('players/' + player.playerName).update({ score: score });
            }, this);
        });
    });