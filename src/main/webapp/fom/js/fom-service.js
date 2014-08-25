
function FOMService() {};

FOMService.prototype.initialize = function () {
	this.name = 'Five Or More';
	this.colors = ['b', 'c', 'g', 'o', 'p', 'r', 'y'];
	this.score = 0;
	for (var row = 0; row < this.rows; row++) {
		for (var col = 0; col < this.cols; col++) {
			this.board[row][col] = "e";
		}
	}
	var initColors = this.getNextColors();
	this.putNextColorsOnBoard(initColors);
	this.nextColors = this.getNextColors();
	this.selected = null;
	this.savedStates = [];
	this.currentStateIdx = -1;
	this.initLists();
	this.saveState();
};


FOMService.prototype.saveState = function () {
	var state = {};
	state.board = new Array(this.rows);
	for (row = 0; row < this.rows; row++) {
		state.board[row] = new Array(this.cols);
		for (col = 0; col < this.cols; col++) {
			state.board[row][col] = this.board[row][col];
		}
	}
	this.saveChildState(state);
	this.currentStateIdx += 1;
	var removeNumElements = this.savedStates.length - this.currentStateIdx;
	this.savedStates.splice(this.currentStateIdx, removeNumElements, state);
	var i = 0;
}

FOMService.prototype.back = function () {
	if (this.currentStateIdx > 0) {
		this.currentStateIdx--;
		this.restoreState();
	}
}

FOMService.prototype.next = function () {
	if (this.savedStates.length > this.currentStateIdx + 1 ) {
		this.currentStateIdx++;
		this.restoreState();
	}
}

FOMService.prototype.restoreState = function () {
	var b = this.savedStates[this.currentStateIdx].board;
	for (row = 0; row < this.rows; row++) {
		for (col = 0; col < this.cols; col++) {
			this.board[row][col] = b[row][col];
		}
	}

	this.restoreChildState (this.savedStates[this.currentStateIdx]);
}

FOMService.prototype.clearSavedStates = function() {
	this.savedStates = [];
	this.currentStateIdx = -1;
}

FOMService.scoreMap = {5:10, 6:12, 7:18, 8:28, 9:42, 10:82, 11:108, 12:138, 13:172, 14:210};

FOMService.prototype.initLists = function() {
	this.rowLists = [];
	for (row = 0; row < this.rows; row++) {
		lst = [];
		for (col = 0; col < this.cols; col++) {
			lst.push (new Cell(row, col));
		}
		this.rowLists.push(lst);
	}
	this.colLists = [];
	for (col = 0; col < this.cols; col++) {
		lst = [];
		for (row = 0; row < this.rows; row++) {
			lst.push (new Cell(row, col));
		}
		this.colLists.push(lst);
	}
	this.diagList1 = [];
	for (i = 0; i < this.rows + this.cols - 1 ; i++) {
		lst = [];
		for (row = i < this.rows? i : this.rows - 1, col = i < this.rows? 0 : i - this.rows + 1; row >=0 && col < this.cols; row--, col++) {
			lst.push(new Cell(row, col));
		}
		this.diagList1.push(lst);
	}
	this.diagList2 = [];
	for (i = 0; i < this.rows + this.cols - 1 ; i++) {
		lst = [];
		for (row = this.rows - i - 1 > 0? this.rows - i - 1 : 0, col = i < this.rows? 0 : i - this.rows + 1; row < this.rows && col < this.cols; row++, col++) {
			lst.push(new Cell(row, col));
		}
		this.diagList2.push(lst);
	}
}

FOMService.prototype.processGroups = function() {
	this.groups = this.getGroups();
	if (this.groups.length > 0) {
		var count = 0;
		for (var i = 0; i < this.groups.length; i++) {
			var grp = this.groups[i];
			for (var j = 0; j < grp.length; j++) {
				var c = grp[j];
				if (this.board[c.r][c.c] != 'e') {
					count++;
					this.board[c.r][c.c] = 'e';
				}
			}
		}
		this.score += FOMService.scoreMap[count];
		return true;
	}
	return false;
}

FOMService.prototype.getGroups = function() {
	var grps = [];
	grps1 = this.getGroupsForCellLists(this.rowLists)
	if ( grps1.length > 0 ) {
		grps = grps.concat(grps1);
	}
	grps1 = this.getGroupsForCellLists(this.colLists)
	if ( grps1.length > 0 ) {
		grps = grps.concat(grps1);
	}
	grps1 = this.getGroupsForCellLists(this.diagList1)
	if ( grps1.length > 0 ) {
		grps = grps.concat(grps1);
	}
	grps1 = this.getGroupsForCellLists(this.diagList2)
	if ( grps1.length > 0 ) {
		grps = grps.concat(grps1);
	}
	return grps;
}

FOMService.prototype.getGroupsForCellLists = function(cellLists) {
	var grps = [];
	for (var idx = 0; idx < cellLists.length; idx++) {
		thisListGrps = this.getGroupsForCellList(cellLists[idx]);
		if (thisListGrps.length > 0) {
			grps = grps.concat(thisListGrps);
		}
	}
	return grps;
}


FOMService.prototype.getGroupsForCellList = function(cellList) {
	var grps = [];
	var grp = [];
	var prev = '';
	for (var i = 0; i < cellList.length; i++) {
		var c = cellList[i];
		var b = this.board[c.r][c.c]; 
		if (b != 'e') {
			if (b == prev) {
				grp.push(new Cell(c.r, c.c));
			} else {
				if (grp.length >= 5) {
					grps.push(grp);
					grp = [];
				} else {
					grp = [];
					prev = b;
					grp.push(new Cell(c.r, c.c));
				}
			}
		} else {
			if (grp.length >= 5) {
				grps.push(grp);
			} 
			grp = [];
		}
	}
	if (grp.length >= 5) {
		grps.push(grp);
	}
	return grps;
}

FOMService.prototype.putNextColorsOnBoard = function(colors) {
	ecl = this.getEmptyCellList();
	while (colors.length > 0 && ecl.length > 0) {
		r_idx = Math.floor(Math.random()*ecl.length);
		c = colors.pop();
		this.board[ecl[r_idx].r][ecl[r_idx].c] = c;
		ecl.splice(r_idx, 1);
	}
}

FOMService.prototype.onClickImpl = function (row, col) {
	var val = this.board[row][col];
	var nextColors = false;
	var saveState = false;
	if (this.board[row][col] == "e") {
		if (this.selected != null) {
			var cellTo = new Cell(row, col);
			if (this.isThereAWay(this.selected, cellTo)) {
				this.board[row][col] = this.board[this.selected.r][this.selected.c];   
				this.board[this.selected.r][this.selected.c] = "e";  
				nextColors = !this.processGroups();
				this.selected = null;
				saveState = true;
			}
		}
	} else {
		this.selected = new Cell(row, col);
	} 
	if (nextColors) {
		this.putNextColorsOnBoard(this.nextColors);
		this.processGroups();
		this.nextColors = this.getNextColors();
	}
	if (saveState) this.saveState();
};

FOMService.prototype.getNextColors = function () {
	var next = [];
	var len = this.colors.length;
	for (var i = 0; i < 3; i++) {
		var r_idx = Math.floor(Math.random()*len)
		next.push(this.colors[r_idx]);
	}
	return next;
}

FOMService.prototype.getEmptyCellList = function () {
	ecl = [];
	for (row = 0; row < this.rows; row++) {
		for (col = 0; col < this.cols; col++) {
			if (this.board[row][col] == "e") {
				ecl.push (new Cell(row, col));
			}
		}
	}
	return ecl;
}

FOMService.prototype.isThereAWay = function (cfrom, cto) {
	var nodeMap = [];
	for (var row = 0; row < this.rows; row++) {
		var mapRow = [];
		for (var col = 0; col < this.cols; col++) {
			if (this.board[row][col] != "e") {
				mapRow.push("u");
			} else {
				mapRow.push("w");
			}
		}
		nodeMap.push(mapRow);
	}
	nodeMap[cfrom.r][cfrom.c] = "s";
	nodeMap[cto.r][cto.c] = "g";
	this.path = astar(nodeMap, "manhattan", false);
	return (this.path != null);
}

FOMService.prototype.restoreChildState = function (state) {
	for (var i = 0; i < state.nextColors.length; i++) {
		this.nextColors[i] = state.nextColors[i];
	}
	this.score = state.score;
}

FOMService.prototype.saveChildState = function (state) {
	state.nextColors = this.nextColors.slice();
	state.score = this.score;
}

FOMService.prototype.setSelected = function (cell) {
	this.selected = cell;
	this.notifyModelChangeListeners();
}
