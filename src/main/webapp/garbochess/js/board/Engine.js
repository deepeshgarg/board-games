
function ChessEngine() {
};


ChessEngine.prototype.setStrength = function (strength) {
};

ChessEngine.prototype.initGame = function (fen) {
};

ChessEngine.prototype.getValidMoves = function (fen) {
	return [];
};

ChessEngine.prototype.checkValidMove = function (move, fen) {
	return null;
};

ChessEngine.prototype.isMoveValid = function (move, fen) {
	return false;
};

ChessEngine.prototype.getMoveText = function (move, fen) {
	return "";
};

ChessEngine.prototype.whiteToMove = function () {
	return true;
};

ChessEngine.prototype.makeMove = function (move, fen) {
	return fen;
};

ChessEngine.prototype.analyzePosition = function (coId, fen, callback) {

};

ChessEngine.prototype.getFen = function () {
	return "";
};

function PositionAnalysis() {
	this.score = 0;
	this.comment = "";
	this.suggestedMove = null; //Move object
};

function Move() {
	this.from = null; //cell
	this.to = null; //cell
	this.castle = ""; //possible values q k
	this.promotion = ""; //possible values nbrq
	this.epc = false; //en passent capture
};

Move.prototype.equals = function(move) {
	return (this.from.equals(move.from) && this.to.equals(move.to)); 
};

Move.prototype.toString = function() {
	return this.from + "," + this.to + "," + this.castle + "," + this.promotion + "," + this.epc;
};

Move.fromString = function(str) {
	var elmnts = str.split(",");
	var m = new Move();
	m.from = Cell.fromString(elmnts[0]);
	m.to = Cell.fromString(elmnts[1]);
	m.castle = elmnts[2];
	m.promotion = elmnts[3];
	m.epc = (elmnts[4] == "true"? true : false);
	return m;
};
