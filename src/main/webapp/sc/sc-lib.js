function Node (key) {
    this.children = [];
    this.parents = [];
    this.key = key == undefined? "" : key;
}

Node.prototype.addChild = function (node) {
    this.children.push(node);
    node.addParent(this);
}

Node.prototype.addParent = function (node) {
    this.parents.push(node);
}

Node.prototype.countChildBranch = function () {
	var count = 0;
	var currentNodeSet = new NodeSet();
	currentNodeSet.addNode(this);
	while (currentNodeSet.size() > 0) {
		var childNodeSet = new NodeSet();
		for (var nodeKey in currentNodeSet.nodes) {
	 		if (currentNodeSet.nodes.hasOwnProperty(nodeKey)) {
	 			var node = currentNodeSet.nodes[nodeKey];
	 			count += node.children.length;
	 			for (var i = 0; i < node.children.length; i++) {
	 				childNodeSet.addNode(node.children[i]);
				}
			}
		}
		currentNodeSet = childNodeSet;
	}
	return count;
}

Node.prototype.countParentBranch = function () {
	var count = 0;
	var currentNodeSet = new NodeSet();
	currentNodeSet.addNode(this);
	while (currentNodeSet.size() > 0) {
		var parentNodeSet = new NodeSet();
		for (var nodeKey in currentNodeSet.nodes) {
	 		if (currentNodeSet.nodes.hasOwnProperty(nodeKey)) {
	 			var node = currentNodeSet.nodes[nodeKey];
	 			count += node.parents.length;
	 			for (var i = 0; i < node.parents.length; i++) {
	 				parentNodeSet.addNode(node.parents[i]);
				}
			}
		}
		currentNodeSet = parentNodeSet;
	}
	return count;
}

function NodeSet() {
    this.nodes = {};
}

NodeSet.prototype.getNode = function (key) {
    if (this.nodes[key] == undefined) {
    	return null;
    }
    return this.nodes[key];
}

NodeSet.prototype.addNode = function (node) {
    if (this.getNode(node.key) == null) {
        this.nodes[node.key] = node;
    }
}

NodeSet.prototype.size = function() {
    var size = 0;
    for (var key in this.nodes) {
        if (this.nodes.hasOwnProperty(key)) size++;
    }
    return size;
};

function SCChessAnalysis() {
	this.depth = 0;
	this.childBranchCount = 0;
	this.parentBranchCount = 0;
	this.solved = false;
	this.numberOfSolutionLeaf = 0;
	this.solution = null;
}

SCChess = {};
SCChess.analyze = function (boardModel) {
	var data = {"bm": boardModel.board, "count" : 0};
	var bmCopy = new SCModel();
	bmCopy.listenerUpdateAuto = false;
	BoardUtil.forEachCell(0, 0, BoardUtil.nextCellForward, function(r, c, d) {
					if (d.bm[r][c] != "") {
						d.count++;
					}
				},	data, boardModel.rows, boardModel.cols);
	var nodeSetList = [];
	var rootNodeSet = new NodeSet();
	var fen = Chess.FEN.get(boardModel);
	var rootNode = new Node(fen);
	rootNodeSet.addNode(rootNode);
	var currentNodeSet = rootNodeSet;
	var childNodeSet;
	
	while ((childNodeSet = SCChess.processNodeSet(currentNodeSet)).size() > 0) {
		nodeSetList.push(childNodeSet);
		currentNodeSet = childNodeSet;
	}

	var childBranchCount = rootNode.countChildBranch();
	var parentBranchCount = 0
	var solutionExists = (data.count - nodeSetList.length == 1)? true : false;
	var numberOfSolutions = 0;
	var solution = [];
	if (solutionExists) {
		numberOfSolutions = nodeSetList[data.count - 2].size();
		var tempNode = new Node();
		for (var nodeKey in nodeSetList[data.count - 2].nodes) {
	 		if (nodeSetList[data.count - 2].nodes.hasOwnProperty(nodeKey)) {
	 			var node = nodeSetList[data.count - 2].nodes[nodeKey];
	 			tempNode.addParent(node);
	 		}
 		}
 		parentBranchCount = tempNode.countParentBranch() - numberOfSolutions;
 		var sol = "";
 		while (tempNode.parents.length > 0) {
 			sol += tempNode.parents[0].key + "\n";
 			solution.push(tempNode.parents[0].key);
 			tempNode = tempNode.parents[0];
 		}
	}
	//alert ('done:' + nodeSetList.length + ' child branches:' + childBranchCount + ' parent branches:' + parentBranchCount + ' solution found:' + solutionExists + ' number of solutions:' + numberOfSolutions + ' difficulty:' + (childBranchCount/parentBranchCount) + '\nsol:\nld ' + sol);
	var analysis = new SCChessAnalysis();
	analysis.depth = nodeSetList.length;
	analysis.childBranchCount = childBranchCount;
	analysis.parentBranchCount = parentBranchCount;
	analysis.solved = solutionExists;
	analysis.numberOfSolutionLeaf = numberOfSolutions;
	analysis.solution = solution;
	
	return analysis;
}

SCChess.processNode = function(fen) {
	var bm = new SCModel();
	bm.listenerUpdateAuto = false;
	Chess.FEN.load(bm, fen);
	var retFen = [];
	for (var r = 0; r < bm.rows; r++) {
		for (var c = 0; c < bm.cols; c++) {
			if (bm.getCell(r, c) != "") {
				var validMoves = bm.getValidMoves(r, c);
				var fromCell = new Cell(r, c);
				for (var i = 0; i < validMoves.length; i++) {
					retFen.push(SCChess.move(fen, fromCell, validMoves[i]));  
				}
			}
		}
	}
	return retFen;
}

SCChess.move = function(fen, fromCell, toCell) {
	var returnFen = "";
	var bm2 = new SCModel();
	bm2.listenerUpdateAuto = false;
	Chess.FEN.load(bm2, fen);
	if (bm2.getCell(fromCell.r, fromCell.c) == "" || bm2.getCell(toCell.r, toCell.c) == "") {
		return "";
	}
	bm2.setCell(toCell.r, toCell.c, bm2.getCell(fromCell.r, fromCell.c));
	bm2.setCell(fromCell.r, fromCell.c, "");
	return Chess.FEN.get(bm2);	
}

SCChess.processNodeSet = function (nodeSet) {
	var childNodeSet = new NodeSet();
	for (var nodeKey in nodeSet.nodes) {
 		if (nodeSet.nodes.hasOwnProperty(nodeKey)) {
 			var node = nodeSet.nodes[nodeKey];
 			var children = SCChess.processNode(node.key);
 			for (var i = 0; i < children.length; i++) {
 				var childNode = childNodeSet.getNode(children[i]);
 				if (childNode == null) {
 					childNode = new Node(children[i]);
 					childNodeSet.addNode(childNode);
 				}
 				node.addChild(childNode);
 			}
 		}
	}
	return childNodeSet;
}

SCChess.generatePuzzleSlow = function (numPiece) {
	var pieces = ['p', 'n', 'b', 'r', 'q', 'k'];
	var availableCell = [];
	var bm = new SCModel();
	for (var row = 0; row < 4; row++) {
		for (var col = 0; col < 4; col++) {
			availableCell.push (new Cell(row, col));
		}
	}
	var len = pieces.length;
	var retryCount = 0;
	var occupiedCell = 0;
	while (numPiece > occupiedCell && retryCount < 500) {
		var p_idx = Math.floor(Math.random()*len)
		var c_idx = Math.floor(Math.random()*availableCell.length);
		var cell = availableCell.splice(c_idx, 1)[0];
		bm.setCell(cell.r, cell.c, pieces[p_idx]);
		occupiedCell++;
		if (occupiedCell > 1) {
			var analysis = SCChess.analyze(bm);
			if (analysis.solved && analysis.parentBranchCount == occupiedCell - 1) {
				retryCount = 0;
			} else {
				bm.setCell(cell.r, cell.c, "");
				availableCell.push(cell);
				occupiedCell--;
			}
		}
		retryCount++;
	}
	if (occupiedCell == numPiece) {
		return Chess.FEN.get (bm);
	} else {
		return "";
	}
}

SCChess.generatePuzzle = function (numPiece) {
	var pieces = ['p', 'n', 'b', 'r', 'q', 'k'];
	var availableCell = [];
	var occupiedCell = [];
	var pieceFactory = new SCPieceFactory();
	var bm = new SCModel();
	for (var row = 0; row < bm.rows; row++) {
		for (var col = 0; col < bm.cols; col++) {
			availableCell.push (new Cell(row, col));
		}
	}
	var retryCount = 0;
	var p_idx;
	var c_idx;
	
	var firstPieceSet = false;
	while (!firstPieceSet && retryCount < 500) {
		p_idx = Math.floor(Math.random()*pieces.length);
		c_idx = Math.floor(Math.random()*availableCell.length);
		var piece = pieceFactory.getPiece(pieces[p_idx]);
		var validFrom = piece.canMoveFrom(availableCell[c_idx].r, availableCell[c_idx].c, bm);
		if (validFrom.length > 1) {
			var cell = availableCell.splice(c_idx, 1)[0];
			bm.setCell(cell.r, cell.c, pieces[p_idx]);
			occupiedCell.push(cell);
			firstPieceSet = true;
		}
		retryCount++;
	}
	
	retryCount = 0;
	while (numPiece > occupiedCell.length && retryCount < 250) {
		c_idx = Math.floor(Math.random()*occupiedCell.length);
		var piece = pieceFactory.getPiece(bm.getCell(occupiedCell[c_idx].r, occupiedCell[c_idx].c));
		var validFrom = piece.canMoveFrom(occupiedCell[c_idx].r, occupiedCell[c_idx].c, bm);
		if (validFrom.length > 0) {
			var v_idx = Math.floor(Math.random()*validFrom.length);
			p_idx = Math.floor(Math.random()*pieces.length);
			bm.setCell(validFrom[v_idx].r, validFrom[v_idx].c, bm.getCell(occupiedCell[c_idx].r, occupiedCell[c_idx].c));
			bm.setCell(occupiedCell[c_idx].r, occupiedCell[c_idx].c, pieces[p_idx]);
			var analysis = SCChess.analyze(bm);
			if (analysis.solved && analysis.parentBranchCount < occupiedCell.length * 2) {
				retryCount = 0;
				occupiedCell.push(new Cell(validFrom[v_idx].r, validFrom[v_idx].c));
			} else {
				bm.setCell(occupiedCell[c_idx].r, occupiedCell[c_idx].c, bm.getCell(validFrom[v_idx].r, validFrom[v_idx].c));
				bm.setCell(validFrom[v_idx].r, validFrom[v_idx].c, "");
			}
		}
		retryCount++;
	}
	if (occupiedCell.length == numPiece) {
		return Chess.FEN.get (bm);
	} else {
		return "";
	}
}

