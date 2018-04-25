<meta charset="utf-8">
<?php
 echo date('Y-m-d H:i:s',time());//输出当前时间，time()可以获取当前的时间戳。
 echo '<br />';
 require_once('testController.class.php');
 require_once('testModel.class.php');
 require_once('testView.class.php');
 $testController = new testController();
 $testController->show();
 ?>
