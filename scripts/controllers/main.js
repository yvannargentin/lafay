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
  	
	for (var i = 1; i <= nbLevel; i++) {
	    list.push({"value" : i});
	}

  	$scope.time = restTime;

  	$scope.nbSeries = 6;
	$scope.listLevels = list;
	$scope.currentLevel = 1;

	/*
	$scope.toggleTimer = function (){
		if(timer == null)
			timer = $interval(inc, 1000);
		else{
			$interval.cancel(timer);
			timer = null;
			$scope.time = restTime;
		}
	};
	*/

	$scope.startTimer = function (){
		timer = $interval(inc, 1000);
	};

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
	}

  	function inc(){
  		if($scope.time > 0)
  			$scope.time--;
  		else{
  			stopTimer();
  		}
  	}

  	$scope.changeLevel = function(level){
    	console.log(level);
  	};

});