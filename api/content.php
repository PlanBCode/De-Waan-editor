<?php
	
	$fileDir = "content";
	$dir = opendir("../".$fileDir);
	while($fileName = readdir($dir)) { 
		if (substr($fileName, 0, 1) != ".") { // don't list hidden files
	    	$fileNames[] = $fileName;
		}
	}
	closedir($dir);
	$numFiles = count($fileNames);
	sort($fileNames);
	
	//print ("$numFiles files<br>\n");
	/*print("<ol>");
	for($i=0; $i < $numFiles; $i++) {
	       print("<li><a href=\"$fileNames[$i]\">$fileNames[$i]</a></li>");
	}
	print("</ol>");*/
	
	$data = array( 	"fileNames" => $fileNames,
					"dir"		=> $fileDir);
	header('Content-type: application/json');	
	$response = array( 	"status" => "success",
						"data" => $data);
	exit(json_encode($response)."\r\n");
?>