function Paper() {

	var _articleTitleRegExp = /^(.+?)\n/;
	var _articleParagraphRegExp = /\n(.*?)(?=\n|$)/g;
	var _articleIdRegExp1 = /\s/g;
	var _articleIdRegExp2 = /[^a-z-]/g;
	var _element;
	var _body;
	var _paperIntro;
	var _paperInfo;
	var _paperTitle;
	var _paperHeader;
	var _self = this;
	// Events
	//Editor.UPDATE = "editor_update";
	
	this.init = function(element) {
    console.log("Paper:init");
    _element = element;
    _body = _element.find("#body");
    _paperIntro = _element.find("#intro");
    _paperInfo = _element.find("#paperinfo");
    _paperTitle = _element.find("#papertitle");
    _paperHeader = _element.find("#paperheader");
 	}
	
	this.formatFiles = function(filesData) {
		console.log("Paper:formatFiles");
		$.each(filesData,function(index,fileData) {
			var item = "";
			switch(fileData.type) {
				case FileTypes.IMAGE:
					var timestamp = new Date().getTime();
					var filePath = fileData.path+"?t="+timestamp;
					fileData.content = "<img src='"+filePath+"' alt='"+fileData.name+"' />"
					break;
				default:
					//console.log("  fileData.rawContent: ",fileData.rawContent);
					var articleId = fileData.name;
					articleId = articleId.toLowerCase();
					articleId = articleId.replace(_articleIdRegExp1,"-");
					articleId = articleId.replace(_articleIdRegExp2,"");
					
					var content = fileData.rawContent;
					content = content.replace(_articleTitleRegExp,"<h3>$1</h3>\n")
					content = content.replace(_articleParagraphRegExp,"\n<p>$1</p>\n")
					
					fileData.content = "<article id='"+articleId+"'>"+content+"</article>";
					console.log("  fileData.content: ",fileData.content);
					break;
			}
		});
	}
	this.updateHeader = function(filesData) {
		console.log("Paper:updateHeader");
		$.each(filesData,function(index,fileData) {
			//console.log("  fileData.name: ",fileData.name);
			switch(fileData.name) {
				case "intro":
					_paperIntro.html("<p>"+fileData.rawContent+"</p>");
					break;
				case "info":
					_paperInfo.html(fileData.rawContent);
					break;
				case "title":
					_paperTitle.html(fileData.rawContent);
					break;
				case "header":
					var timestamp = new Date().getTime();
					var filePath = fileData.path+"?t="+timestamp;
					_paperHeader.attr("src",filePath);
					break;
			}
		});
	}
	this.update = function(filesData) {
		console.log("Paper:update");
		_body.empty();
		$.each(filesData,function(index,fileData) {
			if(fileData.enabled && fileData.inline) {
				_body.append(fileData.content);
				//console.log("  appending: ",fileData.name);
			}
		});
	}
}
