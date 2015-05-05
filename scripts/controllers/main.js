'use strict';

/**
 * @ngdoc function
 * @name 2k48App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 2k48App
 */


angular.module('2k48App', [])
  .controller('MainCtrl', function ($scope, $http) {

	var board = [
		{'value' : 0, 'index' : 0},
		{'value' : 0, 'index' : 1},
		{'value' : 0, 'index' : 2},
		{'value' : 0, 'index' : 3},
		{'value' : 0, 'index' : 4},
		{'value' : 0, 'index' : 5},
		{'value' : 0, 'index' : 6},
		{'value' : 0, 'index' : 7},
		{'value' : 0, 'index' : 8},
		{'value' : 0, 'index' : 9},
		{'value' : 0, 'index' : 10},
		{'value' : 0, 'index' : 11},
		{'value' : 0, 'index' : 12},
		{'value' : 0, 'index' : 13},
		{'value' : 0, 'index' : 14},
		{'value' : 0, 'index' : 15}
    ];

    $scope.highscores = $http.get('/score').success(function(data){setHighScores(data)});
    function setHighScores(data){

		$scope.highscores = data;
		var highscores = [];

		// eliminating overflow of data
		for (var i = 0; i < data.length; i++)
			highscores[i] = {'score' : data[i].score, 'username' : data[i].username};

		$scope.highscores =  highscores;


		sortResults();
		gameInit();
    }


    // initiating the game

    $scope.user = {'username' : '', 'score' : 0,'tmp' : ''};
    var VALMAX = 2048;
    var dimmensions = 4;
	var gameover = false;
	var hasMoved = false;

	$scope.fixeUsername = function(){
		if($scope.user.tmp != ''){
			$scope.user.username = $scope.user.tmp;
		}

		$('#username').prop('disabled', true);
	};

    $scope.key = function($event){

		if($scope.user.username != ''){
			var oldBoard = board;

			hasMoved = true;

			if ($event.keyCode == 38) // up arrow
				moveUP(0);
			else if ($event.keyCode == 39) // right arrow
				moveRight(0);
			else if ($event.keyCode == 40) // down arrow
				moveDown(0);
			else if ($event.keyCode == 37) // left arrow
				moveLeft(0);
			else
				hasMoved = false;

			// only if the something has changed in the board do we spicy it a bit


			for (var i = 0; i < board.length; i++){
				if(oldBoard[i].value !== board[i].value)
					hasMoved = true;
			}

			if(hasMoved)
				spicyUpTheBoard();

			// update the interface
			$scope.board = board;
		}
	};

	// sort $scope.highscores json by numeric order descending
	function sortResults() {
		$scope.highscores = $scope.highscores.sort(function(a, b){return b[prop]-a[prop]});
	}

	// start a new game
	$scope.newGame = function newGame(){

		// we first have to send the score to the backend
		for(var i = $scope.highscores.length - 1; i >= 0; i--){
			if($scope.highscores[i].score <= $scope.user.score){
				// try next
				if( (i+1) < $scope.highscores.length){
					if($scope.highscores[i+1].score > $scope.user.score){
						$scope.highscores[i].score = $scope.user.score;
						$scope.highscores[i].username =  $scope.user.username;
					}
				}else{
					$scope.highscores[i].score    = $scope.user.score;
					$scope.highscores[i].username = $scope.user.username;
				}
			}
		}

		sortResults();

		var url = '/score';
		$http.post(url,$scope.highscores);


		board = [
			{'value' : 0, 'index' : 0},
			{'value' : 0, 'index' : 1},
			{'value' : 0, 'index' : 2},
			{'value' : 0, 'index' : 3},
			{'value' : 0, 'index' : 4},
			{'value' : 0, 'index' : 5},
			{'value' : 0, 'index' : 6},
			{'value' : 0, 'index' : 7},
			{'value' : 0, 'index' : 8},
			{'value' : 0, 'index' : 9},
			{'value' : 0, 'index' : 10},
			{'value' : 0, 'index' : 11},
			{'value' : 0, 'index' : 12},
			{'value' : 0, 'index' : 13},
			{'value' : 0, 'index' : 14},
			{'value' : 0, 'index' : 15}
		];
		gameover = false;
		hasMoved = false;
		gameInit();

	}

	// game won
	function Gagner(){
		VALMAX *= 2;
		alert("Bravo vous avez gagné ! Libre à vous de continuer. Nous avons élevlé la barre plus haut atteingez maintenant les " + VALMAX + " pour devenir le grand champion");
	}

	// ad a 2 or a 4 in a random free tile
	function spicyUpTheBoard(){

		// let's add a 2 or a 4 in the board
		var rnd = Math.floor(Math.random() * 2) + 1;
		var val = 2;
		if(rnd == 2){
			val = 4;
		}

		var vide = false;


		// first we check if there's any empty tile in the board
		gameover = true;
		for (var i = 0; i < 16; i++){
			if(board[i].value == 0)
				gameover = false;
		}

		// searching for an empty tile
		while(!vide && !gameover){
			rnd = Math.floor(Math.random() * 16) ;
			if(board[rnd].value == 0){
				board[rnd].value = val;
				vide = true;
			}
		}
	}

	// reset a game
	function gameInit(){

		var rnd1 = Math.floor(Math.random() * 16);
		var rnd2 = Math.floor(Math.random() * 2) + 1;

		var val = 2;

		if(rnd2 == 2)
			val = 4;

		board[rnd1].value = val;
		var oldrnd = rnd1;

		// pick another number
		while (rnd1 == oldrnd)
			rnd1 = Math.floor(Math.random() * 16);

		rnd2 = Math.floor(Math.random() * 2) + 1;
		val = 2;

		if(rnd2 == 2)
			val = 4;

		board[rnd1].value = val;
		$scope.user.score = 0;

		$scope.board = board;

	}

	// translate 2D pos to 1D pos
	function From2Dto1D(val1, val2, dim){
		return val1 * dim + val2;
	}

	// take the couple of elements in the oposite sequence (eq: -> right to left checking couple left to right)
	function reverseOrder(position1D,position1DNext,cond1,cond2,increment){
		var complement = 0;

		if (cond1){ // + increment
			complement += increment;

		}else if(cond2){ // - increment
			complement -= increment;
		}

		var boardCurrent = board[position1D + complement];
		var boardNext = board[position1DNext + complement];

		if (boardCurrent.value == boardNext.value){
			boardNext.value *= 2;
			$scope.user.score += boardNext.value;
			boardCurrent.value *= 0;
			if(boardNext.value == VALMAX)
				Gagner();
		}else if(boardNext.value == 0){
			boardNext.value = boardCurrent.value;
			boardCurrent.value *= 0;
		}

	}

	function moveRight(checkup){



		// we go over all the tiles once again to push 0s behind
		for (var i = 0; i <= 3; i++){
			for (var y = 0; y <= 3; y++){
				position1D = From2Dto1D(i,y,dimmensions);
				if(y <= 2){
					var nextY = y + 1;
					var position1DNext = From2Dto1D(i,nextY,dimmensions);
					if(board[position1DNext].value == 0){
						board[position1DNext].value = board[position1D].value;
						board[position1D].value *= 0;
					}
				}
			}
		}

		// check for tiles that might add up and push them 
		for (var i = 0; i <= 3; i++){
			for (var y = 0; y <= 3; y++){
				var position1D = From2Dto1D(i,y,dimmensions);

				if(y <= 2){

					var nextY = y + 1;
					var position1DNext = From2Dto1D(i,nextY,dimmensions);

					var posCalc = board[position1D].index;
					var posCalcNext = board[position1DNext].index;

					var cond1 = posCalc % dimmensions == 0;
					var cond2 = (posCalcNext + 1) % dimmensions  == 0;


					reverseOrder(position1D,position1DNext,cond1,cond2, 2);
				}
			}
		}



	}

	function moveLeft(checkup){

		// we go over all the tiles once again to push 0s behind
		for (var i = 0; i <= 3; i++){
			for (var y = 3; y >= 0; y--){
				position1D = From2Dto1D(i,y,dimmensions);
				if(y >= 1){
					var nextY = y - 1;
					var position1DNext = From2Dto1D(i,nextY,dimmensions);
					if(board[position1DNext].value == 0){
						board[position1DNext].value = board[position1D].value;
						board[position1D].value *= 0;
					}
				}
			}
		}

		// check for tiles that might add up and push them 
		for (var i = 0; i <= 3; i++){
			for (var y = 3; y >= 0; y--){
				var position1D = From2Dto1D(i,y,dimmensions);

				if(y >= 1){
					var nextY = y - 1;
					var position1DNext = From2Dto1D(i,nextY,dimmensions);

					var posCalc = board[position1D].index;
					var posCalcNext = board[position1DNext].index;

					var cond1 = posCalcNext % dimmensions == 0;
					var cond2 = (posCalc + 1) % dimmensions  == 0;

					reverseOrder(position1D,position1DNext,cond1,cond2,2);

				}
			}
		}



	}

	function moveDown(checkup){

		// we go over all the tiles once again to push 0s behind
		for (var i = 0; i <= 3; i++){
			for (var y = 0; y <= 3; y++){
				position1D = From2Dto1D(y,i,dimmensions);
				if(y <= 2){
					var nextY = y + 1;
					var position1DNext = From2Dto1D(nextY,i,dimmensions);
					if(board[position1DNext].value == 0){
						board[position1DNext].value = board[position1D].value;
						board[position1D].value *= 0;
					}
				}
			}
		}
		// check for tiles that might add up and push them
		for (var i = 0; i <= 3; i++){
			for (var y = 0; y <= 3; y++){
				var position1D = From2Dto1D(y,i,dimmensions);
				if(y <= 2){
					var nextY = y + 1;
					var position1DNext = From2Dto1D(nextY,i,dimmensions);

					var posCalc = board[position1D].index;
					var posCalcNext = board[position1DNext].index;

					var cond1 = posCalc <= (dimmensions - 1);
					var cond2 = posCalcNext > (dimmensions * (dimmensions - 1) - 1);

					reverseOrder(position1D,position1DNext,cond1,cond2,8);

				}
			}
		}



	}


	function moveUP(checkup){

		// we go over all the tiles once again to push 0s behind
		for (var i = 0; i <= 3; i++){
			for (var y = 3; y >= 0; y--){
				position1D = From2Dto1D(y,i,dimmensions);
				if(y >= 1){
					var nextY = y - 1;
					var position1DNext = From2Dto1D(nextY,i,dimmensions);
					if(board[position1DNext].value == 0){
						board[position1DNext].value = board[position1D].value;
						board[position1D].value *= 0;
					}
				}
			}
		}

		// check for tiles that might add up and push them 
		for (var i = 0; i <= 3; i++){
			for (var y = 3; y >= 0; y--){
				var position1D = From2Dto1D(y,i,dimmensions);
				if(y >= 1){
					var nextY = y - 1;
					var position1DNext = From2Dto1D(nextY,i,dimmensions);

					var posCalc = board[position1D].index;
					var posCalcNext = board[position1DNext].index;

					var cond1 = posCalcNext <= (dimmensions - 1);
					var cond2 = posCalc > (dimmensions * (dimmensions - 1) - 1);

					reverseOrder(position1D,position1DNext,cond1,cond2,8);

				}
			}
		}




	}

  });
