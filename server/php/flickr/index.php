<?php

require 'Instagram.php';
use MetzWeb\Instagram\Instagram;

session_start();

if (isset($_SESSION['access_token'])) {
  // user authentication -> redirect to media
  header('Location: success.php');
}

// initialize class
$instagram = new Instagram(array(
  'apiKey'      => '0eaf749c58c246a997e1b14112e11bd9',
  'apiSecret'   => 'b84cdf03c6874e879d7d2b67f58ae479',
  'apiCallback' => 'http://localhost/greg'
));

// create login URL
$loginUrl = $instagram->getLoginUrl(array(
  'basic',
  'likes',
  'relationships'
));

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instagram - OAuth Login</title>
    <link rel="stylesheet" type="text/css" href="assets/style.css">
    <style>
      .login {
        display: block;
        font-size: 20px;
        font-weight: bold;
        margin-top: 50px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header class="clearfix">
        <h1>Instagram </h1>
      </header>
      <div class="main">
        <ul class="grid">
          
          <li>
            <a class="login" href="<?php echo $loginUrl ?>">» Login with Instagram</a>
            <h4>Use your Instagram account to login.</h4>
          </li>
        </ul>
       
      </div>
    </div>
  </body>
</html>