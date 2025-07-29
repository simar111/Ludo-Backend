<?php

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow the following methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Allow the following headers
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");




$con = mysqli_connect("localhost", "agkkubavvn", "w3n6GzuDMS&12340", "agkkubavvn");


if (mysqli_connect_errno()) {
    echo "1: connection failed";
    exit();
}


$username = $_POST["name"];
$password = $_POST["password"];
$number = $_POST["number"];
$image = $_POST["image"];
$nameCheckQuerry = "SELECT username FROM users WHERE username='" . $username . "';";


$nameCheck = mysqli_query($con, $nameCheckQuerry) or die("2: query failed");

if (mysqli_num_rows($nameCheck) > 0) {
    echo "3: Name exists in database";
    exit();
} else {
    // Continue with the insertion code
    $salt = "\$5\$rounds=5000" . "steamedhams" . $username . "\$";


    $hash = password_hash($password, PASSWORD_DEFAULT);
    $insertQuerry = "INSERT INTO users (username, hash, salt,Pnumber,image) VALUES ('" . $username . "','" . $hash . "','" . $salt . "','" . $number . "','" . $image . "');";
    mysqli_query($con, $insertQuerry) or die("4: Insert Failed");
    echo "0";
}
