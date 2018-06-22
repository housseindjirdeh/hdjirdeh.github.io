import { h } from 'preact';
import { Link } from 'preact-router/match';

import { HomeIcon } from 'src/icons';

const Blog = () => (
	<div class="flex flex-column items-center justify-between">
    <div class="h4 flex items-center">
      <Link id="home-icon-container" href="/"><HomeIcon /></Link>
    </div>
  </div>
);

export default Blog;
