
function BoardModel(rows, cols) {
	this.rows = rows;
	this.cols = cols;
	this.name = "default";
	this.b = ko.observableArray();
	for (var i = 0; i < rows; i++) {
		var ary = ko.observableArray();
		for (var j = 0; j < cols; j++) {
			//ary.push(ko.observable("[" + i + "][" + j + "]"));
			ary.push(ko.observable(""));
		}
		this.b.push(ary);
	}
	
	this.rl = []; for (var i = 0; i < rows; i++) { this.rl.push(i); }
	this.cl = []; for (var i = 0; i < cols; i++) { this.cl.push(i); }
	this.rrl = [];for (var i = rows - 1; i >= 0; i--) { this.rrl.push(i); }
	this.rcl = [];for (var i = cols - 1; i >= 0; i--) { this.rcl.push(i); }

	this.orientation = ko.observable("up");
	this.cellTemplate = "cell-text";
	this.rowTemplate = "row";

	this.eventHandlers = {  mouseover : this.mouseover.bind(this),
				mouseout : this.mouseout.bind(this), 
				click : this.click.bind(this)};
}

BoardModel.prototype.c = function (r, c, d) {
	if (r >= this.rows || r < 0 || c > this.cols || c < 0) return "";
	if (typeof d == "undefined") {
		return this.b()[r]()[c]();
	} else {
		this.b()[r]()[c](d);
	}	
}

BoardModel.prototype.classes = function(r, c) {
	return {none: false};
}

BoardModel.prototype.mouseover = function(data) {
	console.log ('mouseover:' + data.r + ' ' + data.c);
}

BoardModel.prototype.mouseout = function(data) {
	console.log ('mouseout:' + data.r + ' ' + data.c);
}

BoardModel.prototype.click = function(data) {
	console.log ('click:' + data.r + ' ' + data.c);
}

BoardModel.prototype.getCellImage = function(r, c) {
	return 'images/blank.gif';
}

function Cell(row, col) {
	this.r = row;
	this.c = col;
};

