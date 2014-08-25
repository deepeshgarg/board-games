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

function Cell(row, col) {
	this.r = row;
	this.c = col;
};

Cell.prototype.toString = function () {
	return '[' + this.r + ',' + this.c + ']';
}

Cell.prototype.equals = function (c) {
	return this.r == c.r && this.c == c.c;
}

Cell.inCellList = function (cell, list) {
	for (var i = 0; i < list.length; i++) {
		if (list[i].equals(cell)) {
			return true;
		}
	}
	return false;
}

function Ray(list) {
    if (list == undefined || list == null) {        
        this.cellList = [];
    } else {
        this.cellList = list;
    }
}

Ray.prototype.addCell = function (cell) {
    this.cellList.push(cell);
}

BoardUtil.getValidMoves = function (cell, boardModel, rayList, isEmpty, isCapture) {
    if (typeof isCapture == "undefined") {
        isCapture = function (val) {
            if (val != "") {
                return true;
            }
            return false;
        } ;
    }
    if (typeof isEmpty == "undefined") {
        isEmpty = function (val) {
            if (val == "") {
                return true;
            }
            return false;
        } ;
    }
    validMoves = [];
    validMoves = validMoves.concat(getValidNonCaptureMoves(cell, boardModel, rayList, isEmpty));
    validMoves = validMoves.concat(getValidCaptureMoves(cell, boardModel, rayList, isCapture, isEmpty));
    return validMoves;
}

BoardUtil.getValidCaptureMoves = function (cell, boardModel, rayList, isCapture, isEmpty) {
    validMoves = [];
    for (var rayIdx = 0; rayIdx < rayList.length; rayIdx++) {
        for (var cellIdx = 0; cellIdx < rayList[rayIdx].cellList.length; cellIdx++) {
            var cellIncrement = rayList[rayIdx].cellList[cellIdx];
            var nextCell = new Cell(cell.r + cellIncrement.r, cell.c + cellIncrement.c);
            if (boardModel.inBoard(nextCell.r, nextCell.c)) {
                var val = boardModel.getCell(nextCell.r, nextCell.c);
                if (isEmpty(val)) {
                    continue;
                } else if (isCapture(val)) {
                    validMoves.push(nextCell);
                    break;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }
    return validMoves;
}

BoardUtil.getValidNonCaptureMoves = function (cell, boardModel, rayList, isEmpty) {
    validMoves = [];
    for (var rayIdx = 0; rayIdx < rayList.length; rayIdx++) {
        for (var cellIdx = 0; cellIdx < rayList[rayIdx].cellList.length; cellIdx++) {
            var cellIncrement = rayList[rayIdx].cellList[cellIdx];
            var nextCell = new Cell(cell.r + cellIncrement.r, cell.c + cellIncrement.c);
            if (boardModel.inBoard(nextCell.r, nextCell.c)) {
                var val = boardModel.getCell(nextCell.r, nextCell.c);
                if (isEmpty(val)) {
                    validMoves.push(nextCell);
                } else  {
                    break;
                }
            }  else {
                break;
            }
        }
    }
    return validMoves;
}