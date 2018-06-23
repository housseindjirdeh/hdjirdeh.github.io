import { h, Component } from 'preact';
import { Link } from 'preact-router/match';

import { Nav } from 'src/components';
import { HomeIcon } from 'src/icons';
import { posts } from 'src/static.config';

export default class Home extends Component {
  state = {
  	posts
  };

  render() {
  	return (
  		<div>
  			<Nav />
  			<div class="flex flex-column items-center justify-between vh-100">
  				<div class="h4 flex items-center" />
  				<h1 class="primary-color f1">houssein.</h1>
  				<div class="h4 flex items-center">
  					<i class="custom-arrow custom-down" />
  				</div>
  			</div>
  			<div class="flex flex-column items-center mt5">
  				<div class="bb bw1 b-near-black w-40 flex justify-center mb4">
  					<h3 class="f3 near-black">Recent</h3>
  				</div>

  				{posts.ids.slice(0, 3).map(id => (
  					<h5 class="f3 grow">
  						<Link
	class="near-black mv4 link hover-primary-color ttl"
  							href={`/blog/${id}`}
  						>
  							{posts[id].title}
  						</Link>
  					</h5>
  				))}
  			</div>

  			<div class="flex flex-column items-center mt5">
  				<div class="bb bw1 b-near-black w-40 flex justify-center mb4">
  					<h3 class="f3 near-black">Work</h3>
  				</div>
  				<h5 class="f3 grow">
  					<a
	class="near-black mt4 mb5 link hover-primary-color ttl"
  						href="https://rangle.io/"
  					>
              Rangle.io
  					</a>
  				</h5>
  				<h5 class="f3 grow">
  					<a
  						class="near-black mb5 link hover-primary-color ttl"
	href="https://www2.deloitte.com/global/en/pages/technology/solutions/deloitte-digital.html"
  					>
              Deloitte Digital
  					</a>
  				</h5>
  				<h5 class="f3 grow">
  					<a
	class="near-black link hover-primary-color ttl"
	href="https://www.onramp-solutions.com/"
  					>
              OnRamp
  					</a>
  				</h5>
  			</div>

  			<div class="flex flex-column items-center mt7 mb5">
  				<p class="f4 near-black">© MMXVIII Houssein Djirdeh</p>
  			</div>
  		</div>
  	);
  }
}
