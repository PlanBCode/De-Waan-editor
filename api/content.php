<?php

	$debug;
	
	$fileDir = "content";
	$dirPath = "../".$fileDir;
	$dir = opendir($dirPath);
	while($fileName = readdir($dir)) { 
		$filePath = $dirPath."/".$fileName;
		if (substr($fileName, 0, 1) != "." && !is_dir($filePath)) { // don't list hidden files
	    	$fileNames[] = $fileName;
		}

		// debug:
		$item = array();
		$item[] = $fileName;
		$item[] = is_dir($fileName);
		$item[] = $filePath;
		$item[] = is_dir($filePath);
		$item[] = is_file($fileName);
		$debug[] = $item;
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
					"dir"		=> $fileDir,
					"debug"		=> $debug);
	header('Content-type: application/json');	
	$response = array( 	"status" => "success",
						"data" => $data);
	exit(json_encode($response)."\r\n");
?>