import { h, Component } from 'preact';
import marked from 'marked';
import Markup from 'preact-markup';

import { CodeSnippet } from '../code-snippet';
import { Loader } from '../loader';

const COMPONENTS = {
	pre: CodeSnippet,
	a(props) {
		if (!props.target && props.href.match(/:\/\//)) {
			props.target = '_blank';
			props.rel = 'noopener noreferrer';
		}

		return <a class="fw6 link red hover-near-black underline" {...props} />;
	},
	strong(props) {
		return <strong class="fw6" {...props} />;
	}
};

export class PostContent extends Component {
  state = {
  	content: null
  };

  getContent(name) {
  	const url = `/posts/${name}.md`;

  	return fetch(url)
  		.then(response => {
  			if (!response.ok) {
  				response = fetch(`/posts/404.md`);
  			}
  			return response;
  		})
  		.then(response => response.text());
  }

  componentDidMount() {
  	const { name } = this.props;

  	this.getContent(name).then(postContent => {
  		this.setState({ content: postContent });
  	});
  }

  render({ title, date }, { content }) {
  	return (
  		<div class="mw7">
  			<h1 class="f1 mv5 ttl near-black">
  				{title}
  			</h1>
  			<div class="f4 lh-copy near-black">
  				{content &&
            <Markup
	markup={marked(content)}
	type="html"
	trim={false}
	components={COMPONENTS}
            />}
  				{!content &&
            <div class="h5 flex justify-center items-center">
            	<Loader />
            </div>}
  			</div>
  		</div>
  	);
  }
}
