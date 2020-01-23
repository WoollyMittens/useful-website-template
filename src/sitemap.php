<?php

		header('Content-Type: application/xml; charset=utf-8');

		// constants
		$title = 'Woolly Mittens - JavaScript examples, too useful not to share';
		$domain = 'www.woollymittens.nl';

		echo '<?xml version="1.0" encoding="UTF-8"?>';

?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <?php
    // check for example urls passed to this document
    $root = './';
    // make a menu entry for all html examples in the folder
    $files = scandir($root);
    for ($a = 0; $a < count($files); $a++) {
      $updated = date("Y-m-d", filemtime($files[$a]));
      if(preg_match("/useful-/i", $files[$a])){
        echo '<url><loc>https://' . $domain . '/default.php?url='. $files[$a] . '</loc><lastmod>' . $updated . '</lastmod></url>';
      }
    }
  ?>
</urlset>
