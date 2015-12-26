<?php
session_start();
unset($_COOKIE['user']);
setcookie("user", "",time()-1, '/');//清理cookie
if(isset($_SESSION))session_unset();
header('Location: /Auth');
?>