function Editor() {

	var _element; 
	var _inlineList;
	var _self = this;
	
	var _filesData;
	
	var _selectedIndex = 0;
	
	// Events
	Editor.UPDATE = "editor_update";
	
	this.init = function(element) {
    console.log("Content:init");
    _element = element;
    _inlineList = _element.find("#inlinecontent .filelist");
    
    $(document).keyup(onKeyUp);
    $(document).keydown(onKeyDown);
 	}
	this.setFiles = function(filesData) {
		_filesData = filesData;
		//console.log("Editor:setFiles: ",filesData);
		
		updateList();
	}
	function updateList() {
		_inlineList.empty();
		$.each(_filesData,function(index,fileData) {
			var item = "";
			switch(fileData.type) {
				case FileTypes.IMAGE:
					item = "<img src='"+fileData.path+"' alt='"+fileData.name+"' />"
					break;
				default:
					item = fileData.name
					break;
			}
			var classes = "";
			if(index == _selectedIndex) classes += "selected";
			var checkbox = "["+((fileData.enabled)? "X" : " ")+"] ";
			checkbox = "<span class='checkbox'>"+checkbox+"</span>";
			_inlineList.append("<li class='"+classes+"'>"+checkbox+item+"</li>");
		});
		$(document).trigger(Editor.UPDATE);
	}
	function selectFile(index) {
		_selectedIndex = index;
		if(_selectedIndex < 0) {
			_selectedIndex = 0;
		}	else if(_selectedIndex >= _filesData.length) {
			_selectedIndex = _filesData.length-1;
		}
		updateList();
	}
	function getFile(index) {
		return _filesData[index]
	}
	function moveFile(fileIndex,targetIndex) {
		if(targetIndex < 0) {
			targetIndex = 0;
		}	else if(targetIndex >= _filesData.length) {
			targetIndex = _filesData.length-1;
		}
		var file = getFile(fileIndex);
		_filesData.splice(fileIndex,1); // remove file
		_filesData.splice(targetIndex,0,file); // add file
		updateList();
	}
	function onKeyDown(event) {
		switch(event.which) {
			case 38: // up
			case 40: // down
			case 33: // page up
			case 34: // page down
			case 32: // space
				event.preventDefault();
				event.stopImmediatePropagation();
				return false;
				break;
		}
	}
	function onKeyUp(event) {
		console.log("Editor:onKeyUp: ",event.which);
		event.preventDefault();
		event.stopImmediatePropagation();
		switch(event.which) {
			case 38: // up
				selectFile(_selectedIndex-1);
				break;
			case 40: // down
				selectFile(_selectedIndex+1);
				break;
			case 33: // page up
				moveFile(_selectedIndex,_selectedIndex-1);
				selectFile(_selectedIndex-1);
				break;
			case 34: // page down
				moveFile(_selectedIndex,_selectedIndex+1);
				selectFile(_selectedIndex+1);
				break;
			case 32: // space
				var selectedFile = getFile(_selectedIndex);
				selectedFile.enabled = !selectedFile.enabled
				updateList();
				break;
		}
		return false;
	}
}
