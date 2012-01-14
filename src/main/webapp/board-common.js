BoardUtil = {};

BoardUtil.forEachCell = function(startingRow, startingCol, getNextCell, andDoThis, withThisData, untilRow, untilCol) {
	doThis = andDoThis;
	doThis(startingRow, startingCol, withThisData);
	var c = getNextCell(startingRow, startingCol, untilRow, untilCol); 
	while (c != null) {
		doThis(c.r, c.c, withThisData);
		c = getNextCell(c.r, c.c, untilRow, untilCol); 
	}
}

BoardUtil.nextCellForward = function(row, col, lastRow, lastCol) {
	col++;
	if (col == lastCol) {
		col = 0;
		row++;
	}
	if (row == lastRow) {
		return null;
	}
	return new Cell(row, col);
}

//TODO: implement all cell navigation functions, including the one below
BoardUtil.nextCellBackward = function(row, col, lastRow, lastCol) {
	col--;
	if (col == lastCol) {
		col = 0;
		row++;
	}
	if (row == lastRow) {
		return null;
	}
	return new Cell(row, col);
}

BoardUtil.createGrid = function (rows, cols, initVal) {
	grid = new Array(rows);
	for (var row = 0; row < rows; row++) {
		grid[row] = new Array(cols);
		for (var col = 0; col < cols; col++) {
			if (initVal != undefined) {
				grid[row][col] = initVal;
			}
		}
	}
	return grid;
}
