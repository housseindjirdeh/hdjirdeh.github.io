import { h } from 'preact';
import { Link } from 'preact-router/match';

import { HomeIcon } from 'src/icons';

const Home = () => (
	<div>
		<div class="flex flex-column items-center justify-between vh-100">
			<div class="h4 flex items-center">
				<Link id="home-icon-container" href="/"><HomeIcon /></Link>
			</div>
			<h1 class="primary-color f1">houssein.</h1>
			<div class="h4 flex items-center">
				<i class="custom-arrow custom-down" />
			</div>
		</div>
		<div class="flex flex-column items-center mt5">
			<div class="bb bw1 b-near-black w-40 flex justify-center mb4">
				<h3 class="f3 near-black">Recent</h3>
			</div>
			<h5 class="f3 grow">
				<Link class="near-black mv4 link hover-primary-color" href="/blog/thinking-prpl">thinking prpl - a progressive web pattern</Link>
			</h5>

			<h5 class="f3 grow">
				<Link class="near-black mv4 link hover-primary-color" href="/blog/looking-back">looking back at 2017</Link>
			</h5>

			<h5 class="f3 grow">
				<Link class="near-black mv4 link hover-primary-color" href="/blog/progressive-angular-applications">progressive web apps with angular</Link>
			</h5>
		</div>

		<div class="flex flex-column items-center mt5">
			<div class="bb bw1 b-near-black w-40 flex justify-center mb4">
				<h3 class="f3 near-black">Work</h3>
			</div>
			<p class="f3 fw5 near-black mb4">rangle.io</p>
			<p class="f3 fw5 near-black mb4">deloitte digital</p>
			<p class="f3 fw5 near-black mb4">onramp</p>
		</div>

		<div class="flex flex-column items-center mt7 mb5">
			<p class="f4 near-black">© MMXVIII Houssein Djirdeh</p>
		</div>
	</div>
);

export default Home;
