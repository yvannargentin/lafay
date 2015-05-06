'use strict';

/**
 * @ngdoc function
 * @name lafay.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 2k48App
 */


angular.module('lafay', [])
  .controller('MainCtrl', function ($scope, $http, $interval) {

  	var nbLevel = 13;
  	var list = [];
  	var restTime = 25;
  	var timer;
  	var nbSeries = 6;
  	var timerset = false;
	var myArg = [];

	for (var i = 1; i <= nbLevel; i++) {
	    list.push({"value" : i});
	}

  	$scope.time = restTime;
  	$scope.lvl = [];
  	$scope.lvl.selected = false;
  	$scope.customStyle = [];
  	$scope.customStyle.timer = "";
  	$scope.nbSeries = nbSeries;
	$scope.listLevels = list;
	$scope.myLvl = 1;

	$scope.startTimer = function (){
		if(!timerset)
			timer = $interval(inc, 1000);
		timerset  = true;
	};

	$scope.lvlSelected = function(){
		$scope.lvl.selected = true;
		myArg.level =  $scope.myLvl;

		var tmp = $http.get('./exos.php',myArg)
		.then(function (data) {console.log(data)});

		
	}

	function seriesUpdate(){
		if($scope.nbSeries > 0)
			$scope.nbSeries--;
		else
			$scope.nbSeries = 6;
	}

	function stopTimer(){
		$interval.cancel(timer);
		timer = null;
		$scope.time = restTime;

		seriesUpdate();
		timerset = false;
	}

  	function inc(){
  		if($scope.time > 0)
  			$scope.time--;
  		else{
  			stopTimer();
  		}
  		if($scope.time <= 5)
  			$scope.customStyle.timer = "watchout";
  		else
  			$scope.customStyle.timer = "";
  	}

  	$scope.test = function(){
  		console.log($scope.myLvl);
  	}

});