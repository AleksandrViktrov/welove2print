<?php
	$time = date( "Y_m_d_H_i_s");
	$filename = "../../save/svg_" . $time .".svg";
  	echo $filename;
	$sv_str = $_POST["svg"];
	$file = fopen($filename, "w");
	fwrite($file, $sv_str);
	fclose($file);
?>