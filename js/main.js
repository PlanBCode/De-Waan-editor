var apiURL = "api";

var content = new Content();
var editor = new Editor();
var paper = new Paper();

$(function() {
  console.log("ready");

  $(document).keyup(onKeyUp);
  
  content.init(apiURL);
  editor.init($("#editor"));
  paper.init($("#paper"));
  $(document).on(Content.FILES_UPDATE,updateFilesList);
  $(document).on(Editor.UPDATE,update);
  
  content.loadFiles();
});

function updateFilesList(){
	console.log("content.files: ",content.files);
	paper.formatFiles(content.files);
	editor.setFiles(content.files);
}

function update(){
	paper.update(content.files);
}

function onKeyUp(event) {
	console.log("main:onKeyUp: ",event.which);
	switch(event.which) {
		case 82: // r
			content.loadFiles();
			break;
	}
	return false;
}