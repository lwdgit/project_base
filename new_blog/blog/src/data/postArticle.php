<?php 
include 'core/db.php';
include '../library/function.php';
include '../Auth/loginCheck.php';
if (isLogin()) {
    if (!empty($_POST)) {
        $artitle_title=$_POST['title'];
 
        $article_content = $_POST['content'];

        $article_content = preg_replace('/(<a.+?)_blank/m', '${1}_self', $article_content);
        $article_content = addslashes($article_content);//防止不能存入数据库

        $article_author = $_POST['article_author'] || 'liwen';
        
        $article_mark = $_POST['tags'];
        $article_src = isset($_POST['article_src']) ? $_POST['article_src'] : '';
        $article_type = isset($_POST['article_type']) ? $_POST['article_type'] : 'markdown';

        if(isset($_POST['id']) && is_numeric($_POST['id'])) {
            $sql="UPDATE articles SET title='$artitle_title', content='$article_content', time=now(), cover='$article_cover', mark='$article_mark' WHERE id='$_POST[id]'";
        } else {
            $sql="INSERT INTO articles (catagory, title, content, time, author, cover, mark, src, contentType) VALUES ('1', '$artitle_title', '$article_content', now(), '$article_author', '$article_cover', '$article_mark', '$article_src', '$article_type')";
        }

        $db->connect();
        $res=$db->query($sql);

        
        if($res) {
            //echo '1';//成功
            if (isset($_POST['id']) && is_numeric($_POST['id'])) {
                $sql = "select id, title from `articles` where articles.id='$_POST[id]'";
            } else {
                $sql = "select id, title from `articles` order by articles.id desc limit 1";
            }

            $info = select($sql);

            //print_r($info['title'] == $title);
            if ($info && $info['title'] == $_POST['title']) {
                echo $info['id'];
            } else {
                echo '-11';
            }
        }
        else 
            echo '-1';//失败 
    } else {
        echo '0';//没有内容
    }
} else {
    echo '-2';//没有登录
}

?>