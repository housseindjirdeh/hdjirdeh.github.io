import { h } from 'preact';
import { Link } from 'preact-router/match';

const Header = () => (
	<header class="absolute flex flex-row items-center justify-between w-100 py2 px3">
		<h1 class="h1">HD</h1>
		<nav>
			<Link href="/">Home</Link>
			<Link href="/profile">Me</Link>
			<Link href="/profile/john">John</Link>
		</nav>
	</header>
);

export default Header;
