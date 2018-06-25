import { h, Component } from 'preact';
import { Link } from 'preact-router/match';

import { Footer } from 'src/components';
import { HomeIcon } from 'src/icons';
import { posts } from 'src/static.config';

export default class Blog extends Component {
  state = {
  	posts
  };

  render() {
  	return (
  		<div>
  			<div class="flex flex-column items-center justify-between">
  				<div class="h4 flex items-center">
  					<Link id="home-icon-container" href="/blog"><HomeIcon /></Link>
  				</div>
  			</div>

  			{posts.ids.map(id => (
  				<div class="flex flex-column justify-between mw7 pv4 center bb">
  					<h5 class="f3 mb3 grow">
  						<Link
	href={`/blog/${id}`}
	class="near-black link hover-primary-color grow ttl"
  						>
  							{posts[id].title}
  						</Link>
  					</h5>
  					<p class="f4 lh-copy">
  						{posts[id].description}
  					</p>
  				</div>
  			))}

  			<Footer />
  		</div>
  	);
  }
}
