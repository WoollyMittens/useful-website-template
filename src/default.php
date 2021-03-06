<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8"/>
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<title>Woolly Mittens - JavaScript examples, too useful not to share</title>
		<link rel="stylesheet" href="./css/styles.css"/>
		<link rel="apple-touch-icon" href="./img/favicon.png"/>
		<link rel="icon" href="./img/favicon.png"/>
		<!--[if IE]><link rel="shortcut icon" href="./img/favicon.ico"><![endif]-->
		<meta name="msapplication-TileColor" content="#000000"/>
		<meta name="msapplication-TileImage" content="./img/favicon.png"/>
		<meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=1, width=device-width"/>
		<script src="lib/positions.js"></script>
		<script src="lib/scrolllock.js"></script>
		<script src="lib/toggles.js"></script>
		<script src="lib/transitions.js"></script>
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		  ga('create', 'UA-52552-5', 'woollymittens.nl');
		  ga('send', 'pageview');
		</script>
	</head>
	<body>
		<section id="layout">
			<header id="masthead">
				<div class="hgroup">
					<h1>Woolly Mittens</h1>
					<h2>JavaScript examples, too useful not to share.</h2>
				</div>
				<a href="https://github.com/WoollyMittens"><img style="position: absolute; top: 0; left: 0; height:107px; width:auto; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_left_orange_ff7600.png" alt="Fork me on GitHub"></a>
			</header>
			<?php
				// check for example urls passed to this document
				$root = './';
				$urls = @$_REQUEST['url'];
				// strips incoming HTML of its header and footer (I know it's not efficient)
				function displayHTML($url, $tag)
				{
					global $root;
					$contents = file_get_contents($root . $url . "/dist/index.html");
					$contents = preg_split('/<' . $tag . '>/i', $contents);
					$contents = $contents[1];
					$contents = preg_split('/<\/' . $tag . '>/i', $contents);
					$contents = $contents[0];
					$contents = str_replace('../', "TEMP", $contents);
					$contents = str_replace("./", $root . $url . "/dist/", $contents);
					$contents = str_replace("TEMP", '../', $contents);
					return $contents;
				}
				// if urls were passed to this document
				if ($urls != '') {
					// include the passed html examples
					$files = explode(',', $urls);
					for ($a = 0; $a < count($files); $a++) {
						// include($files[$a]);
						echo displayHTML($files[$a], 'body');
					}
				} else {
					// include all project folders in the root
					$files = scandir($root);
					for ($a = 0; $a < count($files); $a++) {
						if (preg_match("/useful-/i", $files[$a])) {
							//include($root.$files[$a]);
							$demoIcon = '<img class="demoIcon" alt="" src="' . $root . $files[$a] . '/dist/img/favicon.png"/>';
							$demoHTML = displayHTML($files[$a], 'article');
							$demoHTML = '<article>' . $demoIcon . $demoHTML . '</article>';
							$demoHTML = str_replace('http://github.com/WoollyMittens/', './default.php?url=', $demoHTML);
							$demoHTML = str_replace('Download (GitHub)', 'Demo', $demoHTML);
							$demoHTML = str_replace('target="_blank"', '', $demoHTML);
							echo $demoHTML;
						}
					}
				}
			?>
			<nav id="shortcuts" class="nav-closed">
				<menu>
					<li><a href="./default.php"><img alt="" src="./img/all.png"/><span>all</span></a></li>
					<?php
						// make a menu entry for all html examples in the folder
						$files = scandir($root);
						for ($a = 0; $a < count($files); $a++) {
							if(preg_match("/useful-/i", $files[$a])){
								$path = preg_split('/[\/.]+/', $files[$a]);
								$short = preg_replace('/useful-/', '', $path);
								//	print_r($path);
								?><li><a href="./default.php?url=<?php echo $files[$a]?>"><img alt="" src="<?php echo $root?><?php echo $path[0]?>/dist/img/favicon.png"/><span><?php echo $short[0]?></span></a></li><?php
							}
						}
					?>
				</menu>
				<a class="opener nav-passive" href="#shortcuts">^</a>
			</nav>
			<script>
			//<!--
				// navigation bar
				var shortcutsToggles = new Toggles({
					'elements' : [document.getElementById('shortcuts')],
					'buttons' : 'a.opener',
					'classes' : {
						'active' : 'nav-active',
						'passive' : 'nav-passive',
						'open' : 'nav-open',
						'closed' : 'nav-closed'
					},
					'grouped' : false,
					'toggle' : true,
					'index' : -1,
					'auto' : null
				});
				// scroll lock
				var shortcutsScrolllock = new ScrollLock({
					'element' : document.getElementById('shortcuts')
				});
			//-->
			</script>
			<footer id="footnotes">
				<figure>
					<a rel="license" href="http://creativecommons.org/licenses/by/3.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="./img/banner_cc.png" /></a>
					<figcaption>This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/3.0/deed.en_US">Creative Commons Attribution 3.0 Unported License</a>.</figcaption>
				</figure>
			</footer>
		</section>
	</body>
</html>
