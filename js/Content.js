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
	this.filesDir								= "";
	
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
		$.ajax({
			url: this.apiURL + "/content.php",
			dataType: 'json',
			timeout: this.timeoutTime,
			success: function(response){
				console.log("  Content:loadContent: ",response); //," response: ",response);

				handleFilesResponse(response.data);
			}
		}).fail(function() {
				console.log("Content:loadContentList: failed");
		});
	}
	function handleFilesResponse(data) {
		_self.filesDir = data.dir;
		_self.files = new Array();
		_numFileContentsToLoad = 0;
		$.each(data.fileNames,function(index,value) {
			var matches = value.match(_fileRegExp);
			//console.log("matches: ",matches);
			var file = new File();
			file.path = _self.filesDir+"/"+value;
			file.name = matches[1];
			file.extension = matches[2];
			file.type = getFileType(file.extension);
			file.enabled = true;
			_self.files.push(file);
			
			if(file.type == FileTypes.TEXT) {
				_numFileContentsToLoad++;
				loadFileContent(file);
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
				console.log("  Content:loadFileContent: response: ",response); //," response: ",response);

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
