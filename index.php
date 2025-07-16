<?php
$serverName = "sql301.infinityfree.com";
$userName = "if0_39138202";
$password = "m4ZXYGYav7M";
$dbName = "if0_39138202_2505917"; 
$conn = mysqli_connect($serverName, $userName, $password);

if ($conn) {
    if($conn){
        echo "Connection Successful <br>";
    }
    else{
        echo "Failed to connect".mysqli_connect_error();
    }
}

$createDatabase = "CREATE DATABASE IF NOT EXISTS $dbName";
if (!mysqli_query($conn, $createDatabase)) {
    die(json_encode(["error" => "Failed to create database: " . mysqli_error($conn)]));
}

if (!mysqli_select_db($conn, $dbName)) {
    die(json_encode(["error" => "Failed to select database: " . mysqli_error($conn)]));
}


$createTable = "CREATE TABLE IF NOT EXISTS weather (
    city VARCHAR(50) NOT NULL PRIMARY KEY,
    humidity FLOAT NOT NULL,
    wind FLOAT NOT NULL,
    pressure FLOAT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";
if (!mysqli_query($conn, $createTable)) {
    die(json_encode(["error" => "Failed to create table: " . mysqli_error($conn)]));
}

 if (isset($_GET['q']) && !empty($_GET['q'])) {
$cityName = mysqli_real_escape_string($conn, $_GET['q']);
 } else {
     $cityName = "Jaleshwar"; 
}

$selectAllData = "SELECT * FROM weather WHERE city = '$cityName'";
$result = mysqli_query($conn, $selectAllData);
$dataExists = mysqli_num_rows($result) > 0;

if ($dataExists) {
    $row = mysqli_fetch_assoc($result);
    $lastUpdated = strtotime($row['last_updated']);
    $currentTime = time();

  
    if (($currentTime - $lastUpdated) < 7200) {
        echo json_encode([$row]);
        exit;
    }
}

$apiKey = "83587ff53f665013ee2b9a0fe239433b";
$url = "http://api.openweathermap.org/data/2.5/weather?q=$cityName&appid=$apiKey&units=metric";


$response = file_get_contents($url);
if ($response === FALSE) {
    die(json_encode(["error" => "Failed to fetch weather data from OpenWeather API."]));
}
$data = json_decode($response, true);

if (isset($data['main']) && isset($data['wind'])) {
    $humidity = $data['main']['humidity'];
    $wind = $data['wind']['speed'];
    $pressure = $data['main']['pressure'];

   
    $insertOrUpdateData = "INSERT INTO weather (city, humidity, wind, pressure, last_updated)
        VALUES ('$cityName', '$humidity', '$wind', '$pressure', NOW())
        ON DUPLICATE KEY UPDATE
        humidity = '$humidity', wind = '$wind', pressure = '$pressure', last_updated = NOW()";

    if (!mysqli_query($conn, $insertOrUpdateData)) {
        die(json_encode(["error" => "Failed to insert or update weather data: " . mysqli_error($conn)]));
    }

   
    $weatherData = [
        "city" => $cityName,
        "humidity" => $humidity,
        "wind" => $wind,
        "pressure" => $pressure,
        "last_updated" => date("Y-m-d H:i:s")
    ];

    echo json_encode([$weatherData]);
} else {
    echo json_encode(["error" => "Invalid weather data received from OpenWeather API."]);
}


mysqli_close($conn);
?>