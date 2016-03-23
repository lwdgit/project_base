<?php
require('data/core/db.php');
require('library/function.php');
require('inc/conf.php');
$page_size=15;
$page=1;
$sql="SELECT * FROM  `articles` where catagory=1";
$query=$db->query($sql);
$num= mysql_num_rows($query);
$page = safeGet('page');
if (is_null($page)) $page = 1;
$page = intval($page);
$start=($page-1)*$page_size;
$total_page=ceil($num/$page_size);

$sql="SELECT * FROM  `articles` where catagory=1 order by articles.id desc limit $start,$page_size";
$query=$db->query($sql);
$htmlStr = '<ol>';
while($row=mysql_fetch_array($query)){
  //$article[]=$row;
  $htmlStr .= '<li><a href="article.php?id=' . $row['id'] . '">' . $row['title'] . '</a></li>';
}
$htmlStr .= '</ol>';
$htmlStr .= createNav($page, $total_page);
render('tpl/index.tmpl', array(
    '/\{\{content\}\}/',
    '/\{\{site_name\}\}/m', 
    '/\{\{title\}\}/m',
    '/\{\{catagory\}\}/',
    '/[\r\n]/'
    ), array(
    $htmlStr,
    $SITE_NAME,
    "文章列表 -- " . $SITE_NAME,
    "文章列表",
    ""
    )
);
?>