<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow the following methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Allow the following headers
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");




$con = mysqli_connect("localhost", "agkkubavvn", "w3n6GzuDMS&12340", "agkkubavvn");


if (mysqli_connect_errno()) {
  echo "1: connection failed"; // Error code 1: Connection failed
  exit();
}

// Get POST parameters
$username = $_POST["username"];
$amount = $_POST["amount"];

// Check if the user exists
$userCheckQuery = "SELECT TotalBalance FROM users WHERE username='" . $username . "';";
$userCheck = mysqli_query($con, $userCheckQuery) or die("2: User query failed"); // Error code 2: User check failed

if (mysqli_num_rows($userCheck) == 0) {
  echo "3: User does not exist"; // Error code 3: User not found
  exit();
}

// Fetch the current balance
$userData = mysqli_fetch_assoc($userCheck);
$currentBalance = $userData['TotalBalance'];

// Calculate new balance based on the provided amount
$newBalance = $currentBalance + $amount;

// Update the TotalBalance for the user
$updateBalanceQuery = "UPDATE users SET TotalBalance='" . $newBalance . "' WHERE username='" . $username . "';";
mysqli_query($con, $updateBalanceQuery) or die("4: Balance update failed"); // Error code 4: Update failed

echo "0"; // Success code
?>
