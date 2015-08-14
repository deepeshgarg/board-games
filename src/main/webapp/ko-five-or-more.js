
KOFiveOrMoreModel.prototype = new BoardModel(9, 9);
KOFiveOrMoreModel.prototype.constructor = KOFiveOrMoreModel;

function KOFiveOrMoreModel() {
	this.eventHandlers.click = this.click.bind(this);
	this.cellTemplate = "cell-img";
	this.nextMove = "x";
	this.imageMap = {};
	this.imageMap["x"] = 'tic-tac-toe/cross.gif';
	this.imageMap["b"] = 'fom/b.gif';
	this.imageMap["c"] = 'fom/c.gif';
	this.imageMap["g"] = 'fom/g.gif';
	this.imageMap["o"] = 'fom/o.gif';
	this.imageMap["p"] = 'fom/p.gif';
	this.imageMap["r"] = 'fom/r.gif';
	this.imageMap["y"] = 'fom/y.gif';

	this.colors = ['b', 'c', 'g', 'o', 'p', 'r', 'y'];
	this.score = ko.observable(0);
	var initColors  = this.getNextColors();
	this.putNextColorsOnBoard (initColors);
	this.nextColors = ko.observableArray();
	replaceArray(this.nextColors, this.getNextColors());
	//this.nextColors = this.getNextColors();
	this.initLists();
}

function replaceArray(observableArray, array) {
	observableArray.removeAll();
	for (var i = 0; i < array.length; i++) {
		observableArray.push(array[i]);
	}
}

KOFiveOrMoreModel.prototype.getNextColors = function () {
	var next = [];
	var len = this.colors.length;
	for (var i = 0; i < 3; i++) {
		var r_idx = Math.floor(Math.random()*len);
		next.push(this.colors[r_idx]);
	}
	return next;
}

KOFiveOrMoreModel.prototype.putNextColorsOnBoard = function(colors) {
	ecl = this.getEmptyCellList();
	console.log(ecl);
	while (colors.length > 0 && ecl.length > 0) {
		r_idx = Math.floor(Math.random()*ecl.length);
		c = colors.pop();
		this.c(ecl[r_idx].r, ecl[r_idx].c, c);
		ecl.splice(r_idx, 1);
	}
}

KOFiveOrMoreModel.prototype.getEmptyCellList = function () {
	ecl = [];
	for (var row = 0; row < this.rows; row++) {
		for (var col = 0; col < this.cols; col++) {
			if (this.c(row, col) == "") {
				ecl.push (new Cell(row, col));
			}
		}
	}
	return ecl;
}

KOFiveOrMoreModel.scoreMap = {5:10, 6:12, 7:18, 8:28, 9:42, 10:82, 11:108, 12:138, 13:172, 14:210};

KOFiveOrMoreModel.prototype.initLists = function() {
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

KOFiveOrMoreModel.prototype.processGroups = function() {
	this.groups = this.getGroups();
	if (this.groups.length > 0) {
		var count = 0;
		for (var i = 0; i < this.groups.length; i++) {
			var grp = this.groups[i];
			for (var j = 0; j < grp.length; j++) {
				var c = grp[j];
				if (this.c(c.r,c.c) != '') {
					count++;
					this.c(c.r, c.c, '');
				}
			}
		}
		this.score(KOFiveOrMoreModel.scoreMap[count] + this.score());
		return true;
	}
	return false;
}

KOFiveOrMoreModel.prototype.getGroups = function() {
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

KOFiveOrMoreModel.prototype.getGroupsForCellLists = function(cellLists) {
	var grps = [];
	for (var idx = 0; idx < cellLists.length; idx++) {
		thisListGrps = this.getGroupsForCellList(cellLists[idx]);
		if (thisListGrps.length > 0) {
			grps = grps.concat(thisListGrps);
		}
	}
	return grps;
}

KOFiveOrMoreModel.prototype.getGroupsForCellList = function(cellList) {
	var grps = [];
	var grp = [];
	var prev = '';
	for (var i = 0; i < cellList.length; i++) {
		var c = cellList[i];
		var b = this.c(c.r,c.c); 
		if (b != '') {
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

KOFiveOrMoreModel.prototype.click = function(data) {
	//this.b()[data.r]()[data.c](this.nextMove);
	//this.c(data.r, data.c, this.nextMove);
	//this.nextMove = this.nextMove == "x"? "o" : "x";
	var row = data.r;
	var col = data.c;

	var val = this.c(row, col);
	var nextColors = false;
	var saveState = false;
	if (val == "") {
		if (this.selected != null) {
			var cellTo = new Cell(row, col);
			if (this.isThereAWay(this.selected, cellTo)) {
				this.c(row,col,this.c(this.selected.r, this.selected.c)) ;    
				this.c(this.selected.r, this.selected.c, "");  
				nextColors = !this.processGroups();
				this.selected = null;
				saveState = true;
			}
		}
	} else {
		this.selected = new Cell(row, col);
	} 
	if (nextColors) {
		this.putNextColorsOnBoard(this.nextColors());
		this.processGroups();
		replaceArray(this.nextColors, this.getNextColors());
	}
	//if (saveState) this.saveState();

}

KOFiveOrMoreModel.prototype.isThereAWay = function (cfrom, cto) {
	var nodeMap = [];
	for (var row = 0; row < this.rows; row++) {
		var mapRow = [];
		for (var col = 0; col < this.cols; col++) {
			if (this.c(row,col) != "") {
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

KOFiveOrMoreModel.prototype.getCellImage = function(r, c) {
	if (this.c(r, c) == "") {
		return 'images/blank.gif';
	} else {
		return this.imageMap[this.c(r, c)];
	}
}

KOFiveOrMoreModel.prototype.classes = function(r, c) {
	if (this.selected != null) {
		if (this.selected.r == r && this.selected.c == c) {
			return {selected: true};
		}
	}
	return {none: false};
}


