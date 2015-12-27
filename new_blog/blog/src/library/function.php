<?php
$db->connect();

function cutstr($str,$cutleng) {
    $str = $str; //要截取的字符串
    $cutleng = $cutleng; //要截取的长度
    $strleng = strlen($str); //字符串长度
    if($cutleng>$strleng)return $str;//字符串长度小于规定字数时,返回字符串本身
    $notchinanum = 0; //初始不是汉字的字符数
    for($i=0;$i<$cutleng;$i++) {
        if(ord(substr($str,$i,1))<=128) {
            $notchinanum++;
        }
    }
    
    if(($cutleng%3==1)&&($notchinanum%3==0)) {
    //如果要截取奇数个字符，所要截取长度范围内的字符必须含奇数个非汉字，否则截取的长度加一
        $cutleng++;
    }

    if(($cutleng%3==0)&&($notchinanum%3!=0)) {//如果要截取偶数个字符，所要截取长度范围内的字符必须含偶数个非汉字，否则截取的长度加一
        $cutleng+=2;
    }
    $str = substr($str,0,$cutleng);
    return $str."...";
}

function safeGet($key) {
    $value = isset($_GET[$key]) ? strip_tags($_GET[$key]) : NULL;
    return $value;
}

function safePost($key) {
    $value = isset($_POST[$key]) ? strip_tags($_POST[$key]) : NULL;
    return $value;
}

function createNav($page, $maxPage) {
    $ret = '<div class="navgation">';
    if ($page <= 1) {
        $ret .= ("首页|上一页|<a href=\"?page=" . ($page + 1) . "\">下一页</a>|<a href=\"?page=" . $maxPage . "\">尾页</a>");
    } else if ($page >= $maxPage) {
        $ret .= ("<a href=\"?page=1\">首页</a>|<a href=\"?page=" . ($page - 1) . "\">上一页</a>|下一页|尾页");
    } else {
        $ret .= ("<a href=\"?page=1\">首页</a>|<a href=\"?page=" . ($page - 1) . "\">上一页</a>|<a href=\"?page=" . ($page + 1) . "\">下一页</a>|<a href=\"?page=" . $maxPage . "\">尾页</a>");
    }
    return $ret . '</div>';
}

function render($file, $pattern, $replacement) {
    $indexTpl = file_get_contents($file);
    if ($indexTpl) {
        $indexTpl = preg_replace($pattern, $replacement, $indexTpl);
        echo $indexTpl;
    } else {
        echo 'file not found!';
    }
}

function authorize() {
    return isset($_SERVER['HTTP_REFERER']) && strpos($_SERVER['HTTP_REFERER'], $_SERVER['SERVER_NAME']);
}

function makeData($obj) {
    /*if (!authorize()) {
        return 'Access Not Authorize!!!';
    }*/

    $callback = safeGet('callback');
    
    if (is_array($obj)) {
        $json = json_encode($obj);
    } else {
        $json = $obj;
    }
    if (!is_null($callback)) {
        $json = $callback . '(' . $json . ')';
    }
    return $json;
}

function select($sql) {
    $db = $GLOBALS['db'];
    $result = mysql_fetch_array($db->query($sql));
    return count($result) > 0 ? $result : NULL;
}

?>