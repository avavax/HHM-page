<?php

include "dbauth.php"; 

$query = "select * from comments";
$result = mysqli_query($link, $query) or die (mysqli_error());
for ($data = []; $row = mysqli_fetch_assoc($result); $data[] = $row);
echo json_encode($data)

?>
