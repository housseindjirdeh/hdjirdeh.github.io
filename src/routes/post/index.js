import { h, Component } from 'preact';
import { Link } from 'preact-router/match';

import { Footer, PostContent } from 'src/components';
import { HomeIcon } from 'src/icons';
import { posts } from 'src/config';

export default class Post extends Component {
  state = {
  	post: posts[this.props.id]
  };

  render() {
  	const { id } = this.props;
  	// const { title, date } = this.state.post;
  	return (
  		<div>
  			<div class="flex flex-column items-center justify-between">
  				<div class="h4 flex items-center">
  					<Link id="home-icon-container" href="/"><HomeIcon /></Link>
  				</div>

  				<div class="mw7">
  					<h1 class="f1 mv5 ttl near-black">
  						{'test'}
  					</h1>
  					<div class="f4 lh-copy near-black">
  						<PostContent name={id} />
  					</div>
  				</div>
  				<Footer />
  			</div>
  		</div>
  	);
  }
}
