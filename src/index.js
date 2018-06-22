import './style';
import './style/tachyons';

import { h, Component } from 'preact';
import { Router } from 'preact-router';

import { Nav } from 'src/components';
import Home from 'src/routes/home';
import Profile from 'src/routes/profile';
import Blog from 'src/routes/blog';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
	
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Nav />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Blog path="/blog/" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
				</Router>
			</div>
		);
	}
}
