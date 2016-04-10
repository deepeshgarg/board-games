
function Node() {
	this.init();
};

Node.prototype.init = function() {
	this.links = [];
};

Node.prototype.addLink = function(link) {
	this.links.push(link);
	return link;
};

function Link(linkdata, node) {
	this.linkdata = linkdata;
	this.node = node;
};
