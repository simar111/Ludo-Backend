<?php
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

$nameCheckQuerry = "SELECT username,salt,hash,TotalBalance,Pnumber,image FROM users WHERE username='" . $username . "';";


$nameCheck = mysqli_query($con, $nameCheckQuerry) or die("2: query failed");

if (mysqli_num_rows($nameCheck) != 1) {
    echo "5: Either no user or morethan one";
    exit();
} else {
    $exitingInfo = mysqli_fetch_assoc($nameCheck);
    $salt = $exitingInfo["salt"];
    $hash = $exitingInfo["hash"];

    // $loginHash = crypt($password, $salt);

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Verify the password
if (!password_verify($password, $hashedPassword)) {
    echo "6: incorrect password";
    exit();
} 

  


    echo "0\t" . $exitingInfo["TotalBalance"]  . "\t" . $exitingInfo["Pnumber"] . "\t" . $exitingInfo["image"];
}
