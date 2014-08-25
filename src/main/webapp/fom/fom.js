
FOMModel.prototype = new BoardModel(9, 9);
FOMModel.prototype.constructor = FOMModel;

function FOMModel() {
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
	this.initLists();
	this.saveState();
};

FOMModel.scoreMap = {5:10, 6:12, 7:18, 8:28, 9:42, 10:82, 11:108, 12:138, 13:172, 14:210};

FOMModel.prototype.initLists = function() {
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

FOMModel.prototype.processGroups = function() {
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
		this.score += FOMModel.scoreMap[count];
		return true;
	}
	return false;
}

FOMModel.prototype.getGroups = function() {
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

FOMModel.prototype.getGroupsForCellLists = function(cellLists) {
	var grps = [];
	for (var idx = 0; idx < cellLists.length; idx++) {
		thisListGrps = this.getGroupsForCellList(cellLists[idx]);
		if (thisListGrps.length > 0) {
			grps = grps.concat(thisListGrps);
		}
	}
	return grps;
}


FOMModel.prototype.getGroupsForCellList = function(cellList) {
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

FOMModel.prototype.putNextColorsOnBoard = function(colors) {
	ecl = this.getEmptyCellList();
	dbg(colors, {on:false});
	while (colors.length > 0 && ecl.length > 0) {
		r_idx = Math.floor(Math.random()*ecl.length);
		c = colors.pop();
		this.board[ecl[r_idx].r][ecl[r_idx].c] = c;
		ecl.splice(r_idx, 1);
	}
}

FOMModel.prototype.onClickImpl = function (row, col) {
	var val = this.board[row][col];
	var nextColors = false;
	var saveState = false;
	if (this.board[row][col] == "e") {
		if (this.selected != null) {
			dbg("here1" + val, {on:false});
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

FOMModel.prototype.getNextColors = function () {
	var next = [];
	var len = this.colors.length;
	for (var i = 0; i < 3; i++) {
		var r_idx = Math.floor(Math.random()*len)
		dbg (r_idx, {on:false});
		next.push(this.colors[r_idx]);
	}
	dbg (next, {on:false});
	return next;
}

FOMModel.prototype.getEmptyCellList = function () {
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

FOMModel.prototype.isThereAWay = function (cfrom, cto) {
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

FOMModel.prototype.restoreChildState = function (state) {
	this.nextColors = state.nextColors.slice();
	this.score = state.score;
}

FOMModel.prototype.saveChildState = function (state) {
	state.nextColors = this.nextColors.slice();
	state.score = this.score;
}

FOMModel.prototype.setSelected = function (cell) {
	this.selected = cell;
	this.notifyModelChangeListeners();
}

FOMView.prototype = new BoardView();
FOMView.prototype.constructor = FOMView;

function FOMView(ctnr) {
	BoardView.call(this, ctnr);
	this.name = "Five Or More View";
};
	
FOMView.prototype.createTable = function (board) {
	BoardView.prototype.createTable.call(this, board);
	var head = $( "<TABLE class='fom-next-t'>" + 
			"<TR>" +
			"<TD class='fom-next-l'>next:</TD>" + 
			"<TD class='fom-next-c fom-next-c1'>" +
				"<div><img src='images/blank.gif' width='100%' height='100%'></img></div>" +
			"</TD>" +
			"<TD class='fom-next-c fom-next-c2'>" +
				"<div><img src='images/blank.gif' width='100%' height='100%'></img></div>" +
			"</TD>" +
			"<TD class='fom-next-c fom-next-c3'>" +
				"<div><img src='images/blank.gif' width='100%' height='100%'></img></div>" +
			"</TD>" +
			"<TD>" +
				"<button id='back'>&lt;</button>" +
			"</TD>" +
			"<TD>" +
				"<button id='next'>&gt;</button>" +
			"</TD>" +
			"<TD>" +
				"<SPAN class='fom-sl'>score:</SPAN><SPAN class='fom-score'></SPAN>" +
			"</TD>" +
			"</TR>" +
			"</TABLE>") ;
	head.find('#back').bind("click", function(){board.back()});
	head.find('#next').bind("click", function(){board.next()});

	this.container.prepend(head);
}

FOMView.prototype.updateView = function (model) {
	dbg("here", {on:false});
	for (i = 1; i <= model.nextColors.length; i++) {
		cl = this.container.find(".fom-next-c" + i);
		$(cl).find('img').attr('src', this.getImagePath(model.nextColors[i-1]));
	}
	this.container.find('.fom-score').html(model.score);
	BoardUtil.forEachCell(0, 0, BoardUtil.nextCellForward, function(r, c, d) {
				d.view.removeClass(r, c, "fom-selected");
				d.view.setImage(r, c, d.view.getImagePath(d.model.board[r][c]));
			},
			{"model":model, "view":this}, model.rows, model.cols);

	if (model.selected != null) {
		this.addClass(model.selected.r, model.selected.c, "fom-selected");
	}
};

FOMView.prototype.getImagePath = function(c) {
	if (c == "e") {
		return 'fom/blank.gif';
	} else if (c == "b") {
		return 'fom/b.gif';
	} else if (c == "c") {
		return 'fom/c.gif';
	} else if (c == "g") {
		return 'fom/g.gif';
	} else if (c == "o") {
		return 'fom/o.gif';
	} else if (c == "p") {
		return 'fom/p.gif';
	} else if (c == "r") {
		return 'fom/r.gif';
	} else if (c == "y") {
		return 'fom/y.gif';
	}
	return 'fom/blank.gif';
}

FOMView.prototype.onClick = function (boardModel, row, col) {
	var val = boardModel.board[row][col];
	var nextColors = false;
	var saveState = false;
	if (boardModel.board[row][col] == "e") {
		if (boardModel.selected != null) {
			dbg("here1" + val, {on:false});
			var cellTo = new Cell(row, col);
			if (boardModel.isThereAWay(boardModel.selected, cellTo)) {
				boardModel.board[row][col] = boardModel.board[boardModel.selected.r][boardModel.selected.c];   
				boardModel.board[boardModel.selected.r][boardModel.selected.c] = "e";  
				nextColors = !boardModel.processGroups();
				boardModel.selected = null;
				saveState = true;
			}
		}
	} else {
		boardModel.setSelected(new Cell(row, col));
	} 
	if (nextColors) {
		boardModel.putNextColorsOnBoard(boardModel.nextColors);
		boardModel.processGroups();
		boardModel.nextColors = boardModel.getNextColors();
	}
	if (saveState) {
		boardModel.saveState();
		boardModel.notifyModelChangeListeners()
	}
}

FOMView.prototype.handleModelChange = function (model) {
	dbg("here", {on:false});
	for (i = 1; i <= model.nextColors.length; i++) {
		cl = this.container.find(".fom-next-c" + i);
		$(cl).find('img').attr('src', this.getImagePath(model.nextColors[i-1]));
	}
	this.container.find('.fom-score').html(model.score);
	BoardUtil.forEachCell(0, 0, BoardUtil.nextCellForward, function(r, c, d) {
				d.view.removeClass(r, c, "fom-selected");
				d.view.setImage(r, c, d.view.getImagePath(d.model.board[r][c]));
			},
			{"model":model, "view":this}, model.rows, model.cols);

	if (model.selected != null) {
		this.addClass(model.selected.r, model.selected.c, "fom-selected");
	}
};