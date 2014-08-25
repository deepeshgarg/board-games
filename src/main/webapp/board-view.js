
function BoardView (ctnr) {
	this.container = $(ctnr);
}

BoardView.prototype.createTable = function (boardModel, data) {
	this.cache = {};
	this.cache.u = {};
	this.cache.d = {};
	var tbl = $("<TABLE></TABLE>").addClass("board");
	this.cache.u.table = tbl;
	this.cache.u.grid = new Array(boardModel.rows);
	for (var row = 0; row < boardModel.rows; row++) {
		this.cache.u.grid[row] = new Array(boardModel.cols);
		var rw = this.createRow ();
		tbl.append(rw);
		for (var col = 0; col < boardModel.cols; col++) {
			cl = this.createColumn(row, col);
			cl.bind("click", {"bm":boardModel, "bv":this}, this.onClickHandler);
			cl.bind("mousedown", {"bm":boardModel, "bv":this}, this.onMouseDownHandler);
			cl.bind("mouseup", {"bm":boardModel, "bv":this}, this.onMouseUpHandler);
			rw.append(cl);
			this.cache.u.grid[row][col] = cl;
		}
	}
	this.container.append(tbl);
	boardModel.registerModelChangeListener(this);
}

BoardView.prototype.onClickHandler = function (event) {
	bm = event.data.bm;
	bv = event.data.bv;
	row = parseInt($(this).attr('r')); 
	col = parseInt($(this).attr('c')); 
	bv.onClick(bm, row, col);
}

BoardView.prototype.onMouseDownHandler = function (event) {
	bm = event.data.bm;
	bv = event.data.bv;
	row = parseInt($(this).attr('r')); 
	col = parseInt($(this).attr('c')); 
	bv.onMouseDown(bm, row, col);
	return false;
}

BoardView.prototype.onMouseUpHandler = function (event) {
	bm = event.data.bm;
	bv = event.data.bv;
	row = parseInt($(this).attr('r')); 
	col = parseInt($(this).attr('c')); 
	bv.onMouseUp(bm, row, col);
	return false;
}

BoardView.prototype.onClick = function (boardModel, row, col) {
}

BoardView.prototype.onMouseDown = function (boardModel, row, col) {
}

BoardView.prototype.onMouseUp = function (boardModel, row, col) {
}

BoardView.prototype.handleModelChange = function (boardModel) {
}

BoardView.prototype.createRow = function () {
	return $("<TR></TR>");
}

BoardView.prototype.createColumn = function(row, col) {
	cl = $("<TD><div><img src='images/blank.gif' width='100%' height='100%'></img></div></TD>").addClass("cell");
	cl.attr("r", row);
	cl.attr("c", col);
	return cl;
}

BoardView.prototype.setImage = function (row, col, image) {
	elem = this.cache.u.grid[row][col];
	elem.find('img').attr('src', image);
}

BoardView.prototype.addClass = function (row, col, className) {
	elem = this.cache.u.grid[row][col]; 
	elem.addClass(className);
}

BoardView.prototype.removeClass = function (row, col, className) {
	elem = this.cache.u.grid[row][col]; 
	elem.removeClass(className);
}
