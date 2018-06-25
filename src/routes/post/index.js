import { h } from 'preact';

import { Header, Footer, PostContent } from 'src/components';
import { posts } from 'src/config';

const Post = ({ id }) => (
	<div>
		<div class="flex flex-column items-center justify-between">
			<Header />
			<PostContent
				name={id}
				title={posts[id] ? posts[id].title : ''}
				date={posts[id] ? posts[id].date : ''}
			/>
			<Footer />
		</div>
	</div>
);

export default Post;
