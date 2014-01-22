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
	
	this.inlineFiles 						= new Array();
	this.specialFiles 					= new Array();
	
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
		
		
		var inlineFileNames = new Array();
		var specialFileNames = new Array();
		$.each(data.fileNames,function(index,fileName) {
			switch(fileName) {
				case "intro":
				case "*intro":
				case "info":
				case "*info":
				case "title":
				case "*title":
				case "header":
				case "*header":
					specialFileNames.push(fileName)
					break;
				default:
					inlineFileNames.push(fileName)
					break;
			}
		});
		var filesDir = data.dir;
		
		self.inlineFiles = new Array();
		updateFileList(_self.inlineFiles,inlineFileNames,filesDir);
		updateFileList(_self.specialFiles,specialFileNames,filesDir);
		
		// ToDo: move disclaimer to end of inlineFiles
	}
	function updateFileList(list,fileNames,filesDir) {
		console.log("updateFileList");
		console.log("  list: ",list);
		console.log("  fileNames: ",fileNames);
		console.log("  filesDir: ",filesDir);
		var numFileContentsToLoad = 0;
		
		
		$.each(fileNames,function(index,fileName) {
			
			var file = getFile(list,fileName);
			//console.log("  file: ",file);
			
			if(!file) {
				file = createFile(fileName,filesDir);
				addFile(list,file);
			}
			
			if(file.type == FileTypes.TEXT) {
				numFileContentsToLoad++;
				loadFileContent(file,function() {
					numFileContentsToLoad--;
					console.log("  numFileContentsToLoad: ",numFileContentsToLoad);
					if(numFileContentsToLoad == 0) {
						$(document).trigger(Content.FILES_UPDATE);
					}
				});
			}
		});
		// remove all files that don't exist anymore
		///console.log("remove all files that don't exist anymore");
		$.each(list,function(index,file) {
			//console.log("  file: ",file);
			if(!file) return; // check if file still exists
			//console.log("  file.fileName: ",file.fileName);
			var found = false;
			$.each(fileNames,function(index,fileName) {
				//console.log("    fileName: ",fileName);
				if(file.fileName == fileName) {
					found = true;
					//console.log("    found!");
					return false;
				}
			});
			if(!found) {
				removeFile(list, file.fileName);
			}
		});
	}
	function getFile(list, fileName) {
		console.log("getFile: ",fileName);
		console.log("  list: ",list);
		var foundFile = false;
		$.each(list,function(index,file) {
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
		//console.log("  matches: ",matches);
		
		var file = new File();
		file.fileName = fileName;
		file.path = filesDir+"/"+fileName;
		if(matches) {
			file.name = matches[1];
			file.extension = matches[2];
		} else {
			file.name = fileName;
			file.extension = "";
		}
		file.type = getFileType(file.extension);
		file.enabled = true;
		return file;
	}
	function addFile(list,file) {
		list.push(file);
	}
	function removeFile(list,fileName) {
		console.log("  removeFile: ",fileName);
		$.each(list,function(index,file) {
			//console.log("  file: ",file);
			if(file.fileName == fileName) {
				list.splice(index,1);
				return false;
			}
		});
	}
	function getFileType(extension) {
		switch(extension) {
			case "png":
			case "jpg":
			case "jpeg":
			case "gif":
				return FileTypes.IMAGE;
				break;
			default:
				return FileTypes.TEXT;
				break;
		}
	}
	function loadFileContent(file,completeHandler) {
		$.ajax({
			url: file.path,
			dataType: 'text',
			timeout: this.timeoutTime,
			success: function(response){
				//console.log("  Content:loadFileContent: response: ",response);

				file.rawContent = response;
				completeHandler();
			}
		}).fail(function() {
				console.log("Content:loadFileContent: failed");
		});
	}
}
