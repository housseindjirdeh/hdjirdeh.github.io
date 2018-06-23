import { h } from 'preact';
import { Link } from 'preact-router/match';

import { GithubIcon, TwitterIcon, PencilIcon } from 'src/icons';

export const Nav = () => (
	<nav class="absolute flex flex-column items-center right-0 mt6">
		<a
			class="bg-animate bg-primary-color hover-bg-near-black no-underline pv3 pl3 pr4 near-white bb b--near-white"
			href="https://github.com/housseindjirdeh"
		>
			<GithubIcon />
		</a>
		<a
			class="bg-animate bg-primary-color hover-bg-twitter-blue no-underline pv3 pl3 pr4 near-white bb b--near-white"
			href="https://twitter.com/hdjirdeh"
		>
			<TwitterIcon />
		</a>
		<Link
			class="bg-animate bg-primary-color hover-bg-purple no-underline pv3 pl3 pr4 near-white"
			href="/blog"
		>
			<PencilIcon />
		</Link>
	</nav>
);
