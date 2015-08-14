var loadedTemplates = [];

function ensureTemplates(list, model) {
	for (var i = 0; i < list.length; i++) {
		var name = list[i];
		loadTemplate(name, model, list.length);
	}
};

function loadTemplate(name, model, totalTemplates) {
	console.log('loading ' + name);
	$jq.get(name + ".html", 
		function(template) {
			var idname = name.split('/').pop();
			console.log('handling ' + idname);
			$jq("head").append("<script id=\"" + idname + "\" type=\"text/html\">" + template + "<\/script>");
			loadedTemplates.push(name);
			if (loadedTemplates.length == totalTemplates) {
				ko.applyBindings(model);
			}
		});
};
