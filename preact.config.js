import { resolve } from 'path';
import { statSync } from 'fs';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import { generateSw } from 'preact-cli-workbox-plugin';

/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config original webpack config.
 * @param {object} env options passed to CLI.
 * @param {WebpackConfigHelpers} helpers object with useful helpers when working with config.
 **/

function exists(file) {
	try {
		if (statSync(file)) return true;
	}
	catch (e) {}
	return false;
}

export default function(config, env, helpers) {
	let src = dir => resolve(env.cwd, env.src || 'src', dir);

	config.resolve.alias.src = resolve(__dirname, 'src');

	const workboxConfig = {
		include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/, /\.md$/]
	};

	config.plugins.push(
		new CopyWebpackPlugin(
			[
				exists(src('posts')) && {
					from: 'posts',
					to: 'posts'
				},
				exists(src('config')) && {
					from: 'config',
					to: 'config'
				}
			].filter(Boolean),
		),
	);

	return generateSw(config, helpers, workboxConfig);
}
