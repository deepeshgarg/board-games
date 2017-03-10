var hindiData = {};
hindiData.vowels = [
	{"w":"अ", "i":"anar.jpg"},
	{"w":"अ", "i":"amrud.jpg"},
	{"w":"आ", "i":"aam.jpg"},
	{"w":"आ", "i":"aadmi.png"},
	{"w":"इ","i":"imli.jpg"},
	{"w":"ई","i":"eesa-masih.jpg"},
	{"w":"उ","i":"ullu.jpg"},
	{"w":"ऊ", "i":"oon.jpg"},
		];

var pictureGamesApp = angular.module('pictureGamesApp',[]);

pictureGamesApp.controller('PictureGamesController', ['$scope', '$log', '$interval', function($scope, $log, $interval) {

	$scope.displaySettings = false;
	$scope.dataset = hindiData.vowels;
	$scope.score = {};
	$scope.currentQuestion = "";
	$scope.settings = {};
	$scope.settings.datasetSelection = ["Vowels", "Consonents", "Words"];
	$scope.settings.gameTypeSelection = ["Picture To Word", "Word To Picture"];
	$scope.settings.selectedDataset = "Vowels";
	$scope.settings.selectedGameType = "Word To Picture";
	$scope.settings.gametime = 30;
	$scope.settings.customtext = "";
	$scope.settings.gamemode = "p";
	$scope.settings.gamemodes = ["p", "w"];

	var stop;
	var ingame = false;

	$scope.onCorrect = function() {
		if (!ingame) return;
		$scope.score.correct++;
		$scope.changeQuestion();
 	}

	$scope.getGameTemplate = function() {
		if ($scope.settings.selectedGameType == "Word To Picture") {
			return "word-to-picture";
		} else {
			return "picture-to-word";
		}
	}

	$scope.onSkip = function() {
		if (!ingame) return;
		$scope.score.skipped++;
		$scope.score.skippedData.push($scope.currentQuestion);
		$scope.changeQuestion();
 	}

	$scope.newGame = function () {
		$scope.stopGame();
		$scope.resetScore();
		$scope.timeRemaining = $scope.settings.gametime;
		$scope.dataset = $scope.getSelectedDataset();
		$scope.changeQuestion();
		ingame = true;
		stop = $interval(function() {
			if ($scope.timeRemaining > 0) {
				$scope.timeRemaining--;
			} else {
				$scope.stopGame();
			}
		}, 1000);
	}

	$scope.getSelectedDataset = function() {
		if ($scope.settings.selectedDataset == "Vowels") {
			return hindiData.vowels;
		}
		if ($scope.settings.selectedDataset == "Consonents") {
			return hindiData.consonents;
		}
		if ($scope.settings.selectedDataset == "All Consonents") {
			return hindiData.allconsonents;
		}
		if ($scope.settings.selectedDataset == "Common Words") {
			return hindiData.commonwords;
		}
		if ($scope.settings.selectedDataset == "Custom Words...") {
			return customWords;
		}
		if ($scope.settings.selectedDataset == "Custom Text...") {
			return customSentences;
		}

		return hindiData.allconsonents;
	}

	$scope.stopGame = function() {
		ingame = false;
		if (angular.isDefined(stop)) {
			$interval.cancel(stop);
			stop = undefined;
		}
	};

	$scope.resetScore = function() {
		$scope.score.correct = 0;
		$scope.score.incorrect = 0;
		$scope.score.skippedData = [];
		$scope.currentQuestion = "";
	}

	$scope.getRandom = function() {
		var len = $scope.dataset.length;
		return $scope.dataset[Math.floor(Math.random()*len)];
	}

	$scope.getQuestion = function() {
		var len = $scope.dataset.length;
		var question = {};
		question.choice = []
		if (len > 4) {
			var counter = 0;
			while(counter < 4) {
				var duplicate = false;
				var thischoice = $scope.dataset[Math.floor(Math.random()*len)];
				for (var i = 0; i < question.choice.length; i++) {
					if (thischoice.w == question.choice[i].w || thischoice.i == question.choice[i].i) {
						duplicate = true;
						break;
					}
				}
				if (!duplicate) {
					question.choice.push(thischoice);
					counter++;
				}
			}
			question.correct = question.choice[Math.floor(Math.random()*question.choice.length)]
		}
		return question;
	}

	$scope.checkAnswer = function(choice) {
		if (!ingame) {return;}
		if ($scope.currentQuestion.correct.w == choice.w && $scope.currentQuestion.correct.i == choice.i) {
			$scope.score.correct++;
			$scope.changeQuestion();
		} else {
			$scope.score.incorrect++;
		}
	}

	$scope.changeQuestion = function() {
		$scope.currentQuestion = $scope.getQuestion();
	}

	$scope.toggleSettings = function() {
		$scope.displaySettings = !$scope.displaySettings;
	}

	$scope.setCustom = function() {
		var text = $scope.settings.customtext;
		customWords = text.split(" ");
		var customSentences1 = text.split("।");
		var customSentences2 = text.split(".");
		customSentences = customSentences1.length > customSentences2.length? customSentences1 : customSentences2;
	}

	$scope.contentStyle = function() {
		if ($scope.settings.selectedDataset == "Custom Text...") {
			return {"font-size": "12pt"};
		} else {
			return {"font-size": "24pt"};
		}
	}
}]);
