<?php
require('data/core/db.php');
require('library/function.php');
require('inc/conf.php');

$httpReferer = '/';
if (isset($_SERVER['HTTP_REFERER'])) {
    $httpReferer =  substr($_SERVER['HTTP_REFERER'], strpos($_SERVER['HTTP_REFERER'], '/', 9));
}


//print_r($_SERVER);
$article_id = safeGet('id');
if(!is_null($article_id)) {
    //查找上一条与下一条
    $next_article = $prev_article = array('#', '没有了');
    $sql = "select * from articles where catagory=1 and id < '$article_id' order by id desc limit 1";
    $result = select($sql);

    if (!is_null($result)) {
        $next_article = array($result['title'], $result['id']);
    }


    $sql = "select * from articles where catagory=1 and id > '$article_id' order by id asc limit 1";
    $result = select($sql);
    if (!is_null($result)) {
        $prev_article = array($result['title'], $result['id']);
    }

    $sql="update  articles set hot=hot+1 where  id='$article_id' and 1=1";
    $query=$db->query($sql);
    $sql="select * from articles where  id='$article_id'";
    $query=$db->query($sql);

    $article = '<article>';
    $title = '';
    $row = mysql_fetch_array($query);

    if (count($row) > 0) {
        $article .= '<title>' . $row['title'] . '</title>';
        $article .= '<p id="article-content">' . $row['content'] . '</p>';
        $article .= '<div class="guide">' . '<div>上一篇: <a href="article.php?id=' . $prev_article['1'] . '">'.$prev_article['0'] . '</a></div><div>下一篇: <a href="article.php?id=' . $next_article[1] . '">' . $next_article[0] . '</a>' . '</div></div>';

        $article .= '<a href="' . ($httpReferer == $_SERVER['REQUEST_URI'] ? '/' : $httpReferer) . '" onclick="history.back();return false;">返回</a>';
        $title = $row['title'];
    } else {
        $article .= '该文章不存在';
    }
    $article .= '</article>';
} else {
    $title = '404 Not Found ' . $SITE_NAME;
    $article = '您查看的文章不存在！！！';
}
render('tpl/index.tmpl', array(
    '/\{\{content\}\}/',
    '/\{\{site_name\}\}/m',
    '/\{\{title\}\}/m',
    '/\{\{catagory\}\}/'
    ), array(
    $article,
    $SITE_NAME,
    $title . ' -- ' . $SITE_NAME,
    '<a href="' . ($httpReferer == $_SERVER['REQUEST_URI'] ? '/' : $httpReferer) . '" onclick="history.back();return false;">返回</a>'
    )
);
?>
