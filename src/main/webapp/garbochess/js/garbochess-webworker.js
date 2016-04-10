

importScripts('libgarbochess.js');

self.onmessage = function (event) {
	var request = JSON.parse(event.data);
	switch (request.command) {
		case 'analyze' : handleAnalyze(request.coId, request.fen, request.timeout); break;
	}
}

function handleAnalyze(coId, fen, timeout) {
	var garboChess = new GarboChess();
	garboChess.ResetGame();
	garboChess.InitializeFromFen(fen);
	garboChess.g_timeout = timeout;
	var wtm = !(garboChess.g_toMove == 0);
	garboChess.Search(function(bestMove, value, timeTaken, ply) { 
			var response = {}; 
			response.type = "analyze";
			response.bestMove = bestMove;
			response.value = value * (wtm? 1 : -1);
			response.timeTaken = timeTaken;
			response.ply = ply;
			response.hint = garboChess.PVFromHash(bestMove, 15);
			response.coId = coId;
			var evtStr = JSON.stringify(response);
			self.postMessage(evtStr);
		}, 20, null);
}
