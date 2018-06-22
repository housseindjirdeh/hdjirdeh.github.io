import { h } from 'preact';
import { Link } from 'preact-router/match';

import { GithubIcon, TwitterIcon, PencilIcon } from 'src/icons';

export const Nav = () => (
	<nav class="absolute flex flex-column items-center right-0 mt6">
    <Link class="bg-animate bg-primary-color hover-bg-near-black no-underline pa3 near-white bb b--near-white" href="/"><GithubIcon /></Link>
    <Link class="bg-animate bg-primary-color hover-bg-twitter-blue no-underline pa3 near-white bb b--near-white" href="/profile"><TwitterIcon /></Link>
    <Link class="bg-animate bg-primary-color hover-bg-purple no-underline pa3 near-white" href="/blog"><PencilIcon /></Link>
	</nav>
);

