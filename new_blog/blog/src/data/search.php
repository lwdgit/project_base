<?php
require('core/db.php');
require('../library/function.php');
$keyword = safeGet('keyword');
$page = safeGet('page');
$page = is_null($page) ? 1 : $page;
$page_size= 10;

$skipRow = $page_size * ($page - 1);
$sql="SELECT * FROM `articles` WHERE concat(`title`,`content`,`mark`) LIKE '%$keyword%'";
$query=$db->query($sql);
$total_num = mysql_num_rows($query);
if ($total_num > 0) { 

    $skipRow = $skipRow >= $total_num ? $total_num : $skipRow;
    mysql_data_seek($query, $skipRow);

    $searchRes = array();
    $count = 0;
    while(($count++ < $page_size) && $row=mysql_fetch_array($query)){
        $searchRes[] = array(
            'title' => $row['title'],
            'id' => $row['id']
        );
    }
    echo makeData($searchRes);
} else {
    echo makeData('[]');
}
?>