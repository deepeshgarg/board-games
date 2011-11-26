
function BoardView (ctnr) {
	this.container = $(ctnr);
}

BoardView.prototype.createTable = function (board) {
	tbl = $("<TABLE></TABLE>").addClass("board");
	for (row = 0; row < board.rows; row++) {
		rw = this.createRow ()
			tbl.append(rw);
		for (col = 0; col < board.cols; col++) {
			cl = this.createColumn(row, col);
			cl.bind("click", board, board.onClickHandler);
			rw.append(cl);
		}
	}
	this.container.append(tbl);
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
