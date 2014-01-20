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
	this.update = function(filesData) {
		_body.empty();
		$.each(filesData,function(index,fileData) {
			if(fileData.enabled) {
				_body.append(fileData.content);
			}
		});
	}
	
	this.formatFiles = function(filesData) {
		$.each(filesData,function(index,fileData) {
			var item = "";
			switch(fileData.type) {
				case FileTypes.IMAGE:
					fileData.content = "<img src='"+fileData.path+"' alt='"+fileData.name+"' />"
					break;
				default:
					var content = fileData.rawContent;
					
					content = content.replace(_articleTitleRegExp,"<h3>$1</h3>\n")
					
					content = content.replace(_articleParagraphRegExp,"\n<p>$1</p>\n")
					
					//content = content.replace(/\n/g,"\n<b>BR</b>\n")
					//content = content.replace(/\n/g,"#")
					
					fileData.content = "<article>"+content+"</article>";
					break;
			}
			_body.append(item);
		});
	}
}
