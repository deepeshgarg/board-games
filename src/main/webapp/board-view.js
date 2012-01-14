
function BoardView (ctnr) {
	this.container = $(ctnr);
}

BoardView.prototype.createTable = function (boardModel, data) {
	this.cache = {};
	this.cache.u = {};
	this.cache.d = {};
	tbl = $("<TABLE></TABLE>").addClass("board");
	this.cache.u.table = tbl;
	this.cache.u.grid = new Array(boardModel.rows);
	for (row = 0; row < boardModel.rows; row++) {
		this.cache.u.grid[row] = new Array(boardModel.cols);
		rw = this.createRow ();
		tbl.append(rw);
		for (col = 0; col < boardModel.cols; col++) {
			cl = this.createColumn(row, col);
			cl.bind("click", {"bm":boardModel, "bv":this}, this.onClickHandler);
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
	row = $(this).attr('r'); 
	col = $(this).attr('c'); 
	bv.onClick(bm, row, col);
}

BoardView.prototype.onClick = function (boardModel, row, col) {
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
