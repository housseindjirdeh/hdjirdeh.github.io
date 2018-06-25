import { h, Component } from 'preact';
import marked from 'marked';
import Markup from 'preact-markup';

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

  render({}, { content }) {
  	return (
  		<div loading={!content}>
  			{content &&
          <Markup markup={marked(content)} type="html" trim={false} />}
  		</div>
  	);
  }
}
