<?php 

include "dbauth.php"; 

$name = strip_tags($_POST['name']);
$email = strip_tags($_POST['email']);
$msg = strip_tags($_POST['comment']);

$query = "INSERT INTO comments SET name='$name', mail='$email', msg='$msg'";
$result = mysqli_query($link, $query) or die(mysqli_error($link));

if ($result) {
	echo ('success');
}

?>