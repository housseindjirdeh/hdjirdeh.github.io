import { h } from 'preact';
import Markdown from 'preact-markdown';

import post from './post.md';

const Profile = () => (
	<div>
		<h1>Home</h1>
		<p>This is the Home component.</p>
		{<Markdown markdown={post} />}
	</div>
);

export default Profile;
