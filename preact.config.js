const { resolve } = require('path');
import { generateSw } from 'preact-cli-workbox-plugin';

/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config original webpack config.
 * @param {object} env options passed to CLI.
 * @param {WebpackConfigHelpers} helpers object with useful helpers when working with config.
 **/
export default function(config, env, helpers) {
	config.resolve.alias.src = resolve(__dirname, 'src');

	const workboxConfig = {
		include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/]
	};

	return generateSw(config, helpers, workboxConfig);
}
