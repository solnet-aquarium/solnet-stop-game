    angular.module('dashboardApp', []).controller('DashboardController', function ($scope) {
        $scope.getPlayers = getPlayers;
        this.loadResults = loadResults;
        var config = {
            apiKey: "AIzaSyBX-6C-ju_GJEkvmqDd-gBEfIAP8_3fjZQ",
            authDomain: "solnet-stop.firebaseapp.com",
            databaseURL: "https://solnet-stop.firebaseio.com",
            projectId: "solnet-stop",
            storageBucket: "solnet-stop.appspot.com",
            messagingSenderId: "97790153221"
        };
        firebase.initializeApp(config);

        function loadResults() {

            firebase.database().ref('games').orderByKey().limitToLast(1).once('value', function (snapshot) {
                var game = snapshot.val()[Object.keys(snapshot.val())];
                if (game.players) {
                    var arrayPlayers = Object.keys(game.players).map(function (key) {
                        return {
                            'rounds': game.players[key].rounds,
                            'playerName': key,
                            'score': game.players[key].score
                        };
                    });
                    $scope.$apply(function () {
                        $scope.players = arrayPlayers;
                    });
                } else {
                    $scope.players = [];
                }
            });
        }

        function getPlayers() {
            return $scope.players;
        }
    });