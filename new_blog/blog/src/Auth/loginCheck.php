<?php
error_reporting(E_ALL ^ E_NOTICE); 
session_start();
function jumpTo($code, $direct = TRUE) {
    if (isset($_GET['noredirect']) || $direct == FALSE) {
        return $code;
    } else {
        if ($code == 0) {
            unset($_COOKIE['user']);
            unset($_SESSION['user']);
            header('Location: /Auth/index.html');
        } else {
            setcookie("user", $_SESSION['user'], time() + 3600 * 24, '/');
            header('Location: /');//如果已经登录，则直接返回到首页
        }
    }
}

function isLogin($redirect = FALSE) {
    return jumpTo(isset($_SESSION['user']) ? 1 : 0, $redirect);
}

?>