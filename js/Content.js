FileTypes = {};
FileTypes.IMAGE = "image";
FileTypes.TEXT 	= "text";

function File() {
	this.name;
	this.type;
	this.extension;
	this.enabled;
}

function Content() {

	this.apiURL	 								= "api";
	
	this.files 									= new Array();
	
	this.timeoutTime 						= 3000;
	this.loadIntervalTime				= 3000;
	
	var _fileRegExp 						= /^(.+)\.([a-z]+)$/;
	var _numFileContentsToLoad	= 0;
	var _loadInterval;
	var _self 									= this;

	// Events
	Content.FILES_UPDATE 				= "content_filesupdate";
	
	this.init = function(apiURL) {
    console.log("Content:init");
		this.apiURL = apiURL;
 	}
	this.loadFiles = function() {
		console.log("Content:loadFiles");
		$.ajax({
			url: this.apiURL + "/content.php",
			dataType: 'json',
			timeout: this.timeoutTime,
			success: function(response){
				console.log("  Content:loadFiles response: ",response); //," response: ",response);

				handleFilesResponse(response.data);
			}
		}).fail(function() {
				console.log("Content:loadContentList: failed");
		});
	}
	function handleFilesResponse(data) {
		console.log("handleFilesResponse");
		var filesDir = data.dir;
		_numFileContentsToLoad = 0;
		var disclaimerFile;
		$.each(data.fileNames,function(index,fileName) {
			var file = getFile(fileName);
			console.log("  file: ",file);
			if(!file) {
				file = createFile(fileName,filesDir);
				switch(file.name) {
					case "disclaimer":
						disclaimerFile = file;
						break;
					case "header":
						return; //ignore
						break;
					default:
						addFile(file);
						break;
				}
			}
			
			if(file.type == FileTypes.TEXT) {
				_numFileContentsToLoad++;
				loadFileContent(file);
			}
		});
		if(disclaimerFile) addFile(disclaimerFile);
		
		// remove all files that don't exist anymore
		console.log("remove all files that don't exist anymore");
		$.each(_self.files,function(index,file) {
			//console.log("  file: ",file);
			if(file) { // check if file still exists
				console.log("  file.fileName: ",file.fileName);
				var found = false;
				$.each(data.fileNames,function(index,fileName) {
					//console.log("    fileName: ",fileName);
					if(file.fileName == fileName) {
						found = true;
						console.log("    found!");
						return false;
					}
				});
				if(!found) {
					removeFile(file.fileName);
				}
			}
		});
	}
	function getFile(fileName) {
		console.log("getFile: ",fileName);
		//console.log("  _self.files: ",_self.files);
		var foundFile = false;
		$.each(_self.files,function(index,file) {
			//console.log("  file: ",file);
			//console.log("  file.fileName: ",file.fileName);
			if(file.fileName == fileName) {
				foundFile = file;
				return false;
			}
		});
		return foundFile;
	}
	function createFile(fileName,filesDir) {
		console.log("  addFile: ",fileName);
		var matches = fileName.match(_fileRegExp);
		var file = new File();
		file.fileName = fileName;
		file.path = filesDir+"/"+fileName;
		file.name = matches[1];
		file.extension = matches[2];
		file.type = getFileType(file.extension);
		file.enabled = true;
		return file;
	}
	function addFile(file) {
		_self.files.push(file);
	}
	function removeFile(fileName) {
		console.log("  removeFile: ",fileName);
		$.each(_self.files,function(index,file) {
			//console.log("  file: ",file);
			if(file.fileName == fileName) {
				_self.files.splice(index,1);
				return false;
			}
		});
	}
	function getFileType(extension) {
		switch(extension) {
			case "png":
			case "jpg":
				return FileTypes.IMAGE;
				break;
			default:
				return FileTypes.TEXT;
				break;
		}
	}
	function loadFileContent(file) {
		$.ajax({
			url: file.path,
			dataType: 'text',
			timeout: this.timeoutTime,
			success: function(response){
				//console.log("  Content:loadFileContent: response: ",response);

				file.rawContent = response;
				_numFileContentsToLoad--;
				console.log("  _numFileContentsToLoad: ",_numFileContentsToLoad);
				if(_numFileContentsToLoad == 0) {
					$(document).trigger(Content.FILES_UPDATE);
				}
			}
		}).fail(function() {
				console.log("Content:loadFileContent: failed");
		});
	}
}
