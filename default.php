<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8"/>
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<title>useful.js: JavaScript examples, too useful not to share.</title>
		<link rel="stylesheet" href="./css/styles.css"/>
		<link rel="apple-touch-icon" href="./img/favicon.png"/>
		<link rel="icon" href="./img/favicon.png"/>
		<!--[if IE]><link rel="shortcut icon" href="./img/favicon.ico"><![endif]-->
		<meta name="msapplication-TileColor" content="#000000"/>
		<meta name="msapplication-TileImage" content="./img/favicon.png"/>
		<meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=1, width=device-width, user-scalable=yes"/>
		<!--[if lte IE 9]>
			<meta http-equiv="imagetoolbar" content="no"/>
            <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
			<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
			<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
		<![endif]-->
		<script src="../useful-toggles/js/toggles.min.js"></script>
		<script src="../useful-scrolllock/js/scrolllock.min.js"></script>
		<script type="text/javascript">
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-52552-5']);
			_gaq.push(['_trackPageview']);
			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		</script>
	</head>
	<body>
		<section>
			<header>
				<hgroup>
					<h1>useful.js</h1>
					<h2>JavaScript examples, too useful not to share.</h2>
				</hgroup>
				<a href="https://github.com/WoollyMittens"><img style="position: absolute; top: 0; left: 0; height:107px; width:auto; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_left_orange_ff7600.png" alt="Fork me on GitHub"></a>
			</header>
			<?php
				// check for example urls passed to this document
				$dir = '../';
				$urls = @$_REQUEST['url'];
				// strips incoming HTML of its header and footer (I know it's not efficient)
				function displayHTML($url)
				{
					global $dir;
					$contents = file_get_contents($dir . $url . "/index.html");
					$contents = split('<body>', $contents);
					$contents = $contents[1];
					$contents = split('</body>', $contents);
					$contents = $contents[0];
					$contents = str_replace("./", "../" . $url . "/", $contents);
					$contents = str_replace(".../", "../../", $contents);
					echo $contents;
				}
				// if urls were passed to this document
				if ($urls != '') {
					// include the passed html examples
					$files = explode(',', $urls);
					for ($a = 0; $a < count($files); $a++) {
						// include($files[$a]);
						displayHTML($files[$a]);
					}
				} else {
					// include all project folders in the root
					$files = scandir($dir);
					for ($a = 0; $a < count($files); $a++) {
						if (preg_match("/useful-/i", $files[$a])) {
							//include($dir.$files[$a]);
							displayHTML($files[$a]);
						}
					}
				}
			?>
			<nav id="shortcuts" class="nav-closed">
				<menu>
					<li><a href="./default.php"><img alt="" src="./img/icons/all.png"/><span>all</span></a></li>
					<?php
						// make a menu entry for all html examples in the folder
						$files = scandir($dir);
						for ($a = 0; $a < count($files); $a++) {
							if(preg_match("/useful-/i", $files[$a])){
								$path = preg_split('/[\/.]+/', $files[$a]);
								$short = preg_replace('/useful-/', '', $path);
								//	print_r($path);
								?><li><a href="./default.php?url=<?php echo $files[$a]?>"><img alt="" src="<?php echo $dir?><?php echo $path[0]?>/img/favicon.png"/><span><?php echo $short[0]?></span></a></li><?php
							}
						}
					?>
				</menu>
				<a class="opener nav-passive" href="#shortcuts">^</a>
			</nav>
			<script>
			//<!--
				// navigation bar
				var shortcutsToggles = new useful.Toggles( document.getElementById('shortcuts'), {
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
				shortcutsToggles.start();
				// scroll lock
				var shortcutsScrolllock = new useful.Scrolllock( document.getElementById('shortcuts'), {});
				shortcutsScrolllock.start();
			//-->
			</script>
			<footer>
				<ul>
					<li>
						<a rel="license" href="http://creativecommons.org/licenses/by/3.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="./img/banner_cc.png" /></a>
						This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/3.0/deed.en_US">Creative Commons Attribution 3.0 Unported License</a>.
					</li>
				</ul>
			</footer>
		</section>
	</body>
</html>
