<?php
include('../data/core/db.php');
include('../library/function.php');
include('crypt.php');

define("LIFETIME", 24 * 3600);//设置session超时时间为1天
session_set_cookie_params(LIFETIME);//设置超时时间

session_start();

function checkCode($sessionCode) {
    if (isset($_SESSION['verification'])) {
        $sc = $_SESSION['verification'];
        unset($_SESSION['verification']);
        return is_string($sessionCode) && md5($sessionCode) == $sc;
    } else {
        return false;
    } 
}

function cleanInput($value) {
    return mysql_real_escape_string(trim(substr($value, 0, 20)));//最长只允许20位长度
}

function validAccout() {
    $password = $_POST['password'];
    $password = decode($password);
    $name = $_POST['name'];

    $password = md5(cleanInput($password));
    $name = cleanInput($name);

    $sql="select * from admin where name='$name' and pwd='$password' limit 1";
    $result=select($sql);
    if (!is_null($result)) {
        //echo 'login success!';
        $_SESSION["user"] = $name;
        setcookie("user", $name, time() + LIFETIME, "/");
        return true;
    } else {
        return false;
    }
}

//print_r($_SERVER);
//print_r($_COOKIE);
//print_r($_SESSION);

if (!authorize()) {
    echo 'Access Not Authorize';
} else {
    if (isset($_POST['verification']) && checkCode($_POST['verification'])) {
        if (validAccout()) {
            echo "<script>top.location.replace('/');</script>";
        }
    } else {
        echo "<script> alert('check code is wrong!'); history.back();</script>";
    }
}
?>