function Paper() {

	var _articleTitleRegExp = /^(.+?)\n/
	//var _articleParagraphRegExp = /\n(.+?)[\n$]/g
	var _articleParagraphRegExp = /\n(.+?)(?=\n|$)/g
	var _element;
	var _body;
	var _self = this;
	// Events
	//Editor.UPDATE = "editor_update";
	
	this.init = function(element) {
    console.log("Paper:init");
    _element = element;
    _body = _element.find("#body");
 	}
	
	this.formatFiles = function(filesData) {
		console.log("Paper:formatFiles");
		$.each(filesData,function(index,fileData) {
			var item = "";
			switch(fileData.type) {
				case FileTypes.IMAGE:
					fileData.content = "<img src='"+fileData.path+"' alt='"+fileData.name+"' />"
					break;
				default:
					//console.log("  fileData.rawContent: ",fileData.rawContent);
					var content = fileData.rawContent;
					content = content.replace(_articleTitleRegExp,"<h3>$1</h3>\n")
					content = content.replace(_articleParagraphRegExp,"\n<p>$1</p>\n")
					fileData.content = "<article>"+content+"</article>";
					console.log("  fileData.content: ",fileData.content);
					break;
			}
		});
	}
	this.update = function(filesData) {
		console.log("Paper:update");
		_body.empty();
		$.each(filesData,function(index,fileData) {
			if(fileData.enabled) {
				_body.append(fileData.content);
				console.log("  appending: ",fileData.name);
			}
		});
	}
		
}
