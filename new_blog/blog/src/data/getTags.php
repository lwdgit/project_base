<?php
require('core/db.php');
require('../library/function.php');

$sql="SELECT distinct `mark` FROM  `articles`";
$query=$db->query($sql);
$tags=array();
while($row=mysql_fetch_array($query)) {
    $tags[] = $row['mark'];
}
//print_r($tags);
$tags = join("|", $tags);

$tags=split('\|', $tags);
//print_r($tags);
//echo json_encode($tags);
$tags = array_unique($tags);
//print_r($tags);
echo makeData($tags);
?>