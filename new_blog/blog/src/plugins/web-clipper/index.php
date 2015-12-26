<?
if (empty($_POST)) {
    echo file_get_contents("bookmark.html");
} else {
    include '../../data/core/db.php';
    include '../../library/function.php';
    include '../../Auth/loginCheck.php';

    if (isLogin()) {
        if (!empty($_POST)) {
            $artitle_title=$_POST['title'];
     
            $article_content = $_POST['content'];

            $article_content = preg_replace('/(<a.+?)_blank/m', '${1}_self', $article_content);
            $article_content = addslashes($article_content);//防止不能存入数据库

            $article_author = $_POST['article_author'] || 'liwen';
            
            $article_mark = $_POST['tags'];
            $href = isset($_POST['href']) ? $_POST['href'] : '';
            $article_type = isset($_POST['article_type']) ? $_POST['article_type'] : 'html';

            if(isset($_POST['action']) && $_POST['action'] == "update") {
                $sql="UPDATE articles SET title='$artitle_title', content='$article_content', time=now(), cover='$article_cover', mark='$article_mark' WHERE 1 ORDER BY id DESC LIMIT 1";
            } else {
                $sql="INSERT INTO articles (catagory, title, content, time, author, cover, mark, src, contentType) VALUES ('1', '$artitle_title', '$article_content', now(), '$article_author', '$article_cover', '$article_mark', '$href', '$article_type')";
            }

            $db->connect();
            $res=$db->query($sql);

            if($res) {
                echo 'success';//成功
            } else {
                echo 'Save failed!';//失败 
            }
        } else {
            echo 'No Content!';//没有内容
        }
    } else {
        echo 'Not Login!';//没有登录
    }
}
?>