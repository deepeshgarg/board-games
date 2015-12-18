function OnlineGameDataService(intervalService, httpService) {
	this.intervalService = intervalService;
	this.httpService = httpService;
	console.log(httpService);
	this.gameIdsToWatch = {};
}

OnlineGameDataService.prototype.watch = function(gameid, callback) {
	var promise = this.intervalService (this.onTimer.bind(this), 1000 * 5);
	this.gameIdsToWatch[gameid] = {"callBack": callback, "promise": promise, "hash": "null", "noUpdateCount": 0};
}

OnlineGameDataService.prototype.unwatch = function(gameid) {
	if (typeof(this.gameIdsToWatch[gameid]) != 'undefined') {
		this.intervalService.cancel(this.gameIdsToWatch[gameid].promise);
		delete this.gameIdsToWatch[gameid];
	}
}

OnlineGameDataService.prototype.onTimer = function() {
	for (var gameId in this.gameIdsToWatch) {
		if (this.gameIdsToWatch[gameId].noUpdateCount < 120) {
			this.httpService({method: 'GET', url: '/spring/gamedata/' + gameId + '/hash'}).then(
					this.onHashSuccess.bind(this), 
					this.onFailure.bind(this)
					);
		}
	}
}

OnlineGameDataService.prototype.onHashSuccess = function success(response) {
	var gameId = response.config.url.match(/\/gamedata\/(.*)\/hash/)[1];
	if (response.data != this.gameIdsToWatch[gameId].hash) {
		this.gameIdsToWatch[gameId].tempHash = response.data;
		this.httpService({method: 'GET', url: '/spring/gamedata/' + gameId}).then(
			this.onDataSuccess.bind(this), 
			this.onFailure.bind(this)
		);
	} else {
		this.gameIdsToWatch[gameId].noUpdateCount += 1;
	}
} 

OnlineGameDataService.prototype.onDataSuccess = function success(response) {
	var gameId = response.config.url.match(/\/gamedata\/(.*)/)[1];
	console.log("Data Success URL " + response.config.url + " data:" + response.data + " gameid:" + gameId);
	this.gameIdsToWatch[gameId].callBack(response.data);
	this.gameIdsToWatch[gameId].hash = this.gameIdsToWatch[gameId].tempHash;
	this.gameIdsToWatch[gameId].noUpdateCount = 0;
}

OnlineGameDataService.prototype.onFailure = function (response) {
	console.log('failure:' + response.data);
}

OnlineGameDataService.prototype.publish = function(gameId, data) {
	this.httpService.post('/spring/gamedata/' + gameId, data).then(
		null,
		null
	);
}

OnlineGameDataService.prototype.refreshMonitor = function(gameid) {
	this.gameIdsToWatch[gameid].noUpdateCount = 0;
}

OnlineGameDataService.prototype.guid = function () {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	s4() + '-' + s4() + s4() + s4();
}
