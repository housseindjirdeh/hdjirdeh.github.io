import { h } from 'preact';
import { Link } from 'preact-router/match';

import { HomeIcon } from 'src/icons';

const Blog = () => (
  <div>
	<div class="flex flex-column items-center justify-between">
    <div class="h4 flex items-center">
      <Link id="home-icon-container" href="/"><HomeIcon /></Link>
    </div>
  </div>

  <div class="flex flex-column justify-between mw7 pv4 center bb">
    <h5 class="f3 mb3 grow">
      <Link href="/blog/thinking-prpl" class="near-black link hover-primary-color grow">thinking prpl - a progressive web pattern</Link>
    </h5>
    <p class="f4">The PRPL pattern is not a specific technology or tool, but rather a methodology for building web applications that load fast and reliably...</p>
  </div>

    <div class="flex flex-column justify-between mw7 pv4 center bb">
      <h2>looking back at 2017</h2>
      <p class="f4">I'm late, I know.</p>
    </div>

    <div class="flex flex-column justify-between mw7 pv4 center">
      <h2>progressive web apps with angular</h2>
      <p class="f4">Progressive Web Applications have been the talk of the town in the past few months. In short, they use modern web capabilities to provide a user experience similar to that of mobile apps. Still a relatively new concept, these applications work for every user in every browser but are enhanced in modern browsers...</p>
    </div>
  </div>
);

export default Blog;
