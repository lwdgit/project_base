<?php
require('core/db.php');
require('../library/function.php');
$article_id = safeGet('id');
if (!is_null($article_id)) {                
    //查找上一条与下一条
    $next_article = $prev_article = '';
    $sql = "select * from articles where id < '$article_id' order by id desc limit 1";
    $result = select($sql);

    if (!is_null($result)) {
        $next_article = array($result['title'], $result['id']);
    }


    $sql = "select * from articles where id > '$article_id' order by id desc limit 1";
    $result = select($sql);
    if (!is_null($result)) {
        $prev_article = array($result['title'], $result['id']);
    }

    $sql="update  articles set hot=hot+1 where  id='$article_id' and 1=1";
    $query=$db->query($sql);
    $sql="select * from articles where  id='$article_id'";
    $result = select($sql);

    $article = array(
        'title' => $result['title'],
        'contentType' => $result['contentType'],
        'date' => substr($result['time'], 0, 10),
        'tags' => split('\|', $result['mark']),
        'id' => $result['id'],
        'content' => $result['content']
    );

    echo makeData($article);
} else {
    echo makeData('{}');
}


?>