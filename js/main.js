var apiURL = "api";

var content = new Content();
var editor = new Editor();
var paper = new Paper();

$(function() {
  console.log("ready");

  $(document).keyup(onKeyUp);
  $(document).keydown(onKeyDown);
  
  content.init(apiURL);
  editor.init($("#editor"));
  paper.init($("#paper"));
  $(document).on(Content.FILES_UPDATE,onFilesUpdated);
  $(document).on(Editor.UPDATE,update);
  
  content.loadFiles();
});

function onFilesUpdated(){
	console.log("onFilesUpdated");
	paper.formatInlineFiles(content.inlineFiles);
	paper.updateHeader(content.specialFiles);
	editor.setFiles(content.inlineFiles);
}

function update(){
	paper.update(content.inlineFiles);
}

function onKeyDown(event) {
	//console.log("main:onKeyDown: ",event.which);
	switch(event.which) {
		case 82: // r (prevent page reload (ctrl+r))
		case 116: // F5 (prevent page reload)
			event.preventDefault();
			event.stopImmediatePropagation();
			return false;
			break;
	}
}
function onKeyUp(event) {
	//console.log("main:onKeyUp: ",event.which);
	switch(event.which) {
		case 82: // r
			content.loadFiles();
			break;
	}
	return false;
}