function Editor() {

	var _element; 
	var _self = this;
	
	var _filesData;
	var _selectedIndex = 0;
	var _enabled;
	
	// Events
	Editor.UPDATE = "editor_update";
	
	this.init = function(element) {
    console.log("Content:init");
    _element = element;
    _inlineList = _element.find("#inlinecontent .filelist");
    
    this.setEnabled(true);
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
		
		selectFile(_selectedIndex);
		$(document).trigger(Editor.UPDATE);
	}
	function selectFile(index) {
		console.log("selectFile: ",selectFile);
		if(index < 0) {
			index = 0;
		}	else if(index >= _filesData.length) {
			index = _filesData.length-1;
		}
		//console.log("  _inlineList.children(): ",_inlineList.children());
		
		$(_inlineList.children()[_selectedIndex]).removeClass("selected");
		_selectedIndex = index;
		$(_inlineList.children()[_selectedIndex]).addClass("selected");
		//updateList();
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
		//console.log("onKeyDown: ",event.which);
		var customKey = true; 
		switch(event.which) {
			case 32: // space
				var selectedFile = getFile(_selectedIndex);
				selectedFile.enabled = !selectedFile.enabled
				updateList();
				break;
			case 33: // page up
				if(event.ctrlKey) {
					moveFile(_selectedIndex,_selectedIndex-1);
				}
				selectFile(_selectedIndex-1);
				break;
			case 34: // page down
				if(event.ctrlKey) {
					moveFile(_selectedIndex,_selectedIndex+1);
				}
				selectFile(_selectedIndex+1);
				break;
			case 36: // home
				if(event.ctrlKey) {
					moveFile(_selectedIndex,0);
				}
				selectFile(0);
				break;
			case 35: // end
				if(event.ctrlKey) {
					moveFile(_selectedIndex,_filesData.length-1);
				}
				selectFile(_filesData.length-1);
				break;
			case 72: // h
				_element.toggleClass("hidden");
				break;
			default:
				customKey = false;
				break;
		}
		if(customKey) {
			event.preventDefault();
			event.stopImmediatePropagation();
			return false;
		}
	}
	this.setLoading = function(loading) {
		if(loading) {
			_element.addClass("loading");
		} else {
			_element.removeClass("loading");
		}
	}
	this.getEnabled = function() {
		return _enabled;
	}
	this.setEnabled = function(enable) {
		if(enable == _enabled) return;
		
		if(enable) {
			$(document).keydown(onKeyDown);
			_element.addClass("selected");
		} else {
			$(document).unbind("keydown",onKeyDown);
			_element.removeClass("selected");
		}
		_enabled = enable;
	}
}
