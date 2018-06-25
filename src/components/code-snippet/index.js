import { h } from 'preact';
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';

const LANGUAGES = { javascript, json, css, xml };
Object.keys(LANGUAGES).forEach(key =>
	hljs.registerLanguage(key, LANGUAGES[key]),
);

export const CodeSnippet = ({ children, ...props }) => {
	let child = children && children[0],
		isHighlight = child && child.nodeName === 'code';
	if (isHighlight) {
		let text = child.children[0].replace(/(^\s+|\s+$)/g, ''),
			lang = child.attributes && child.attributes.class
				? child.attributes.class.match(/lang-([a-z]+)/)[1]
				: 'bash',
			highlighted = hljs.highlightAuto(text, lang ? [lang] : null),
			hLang = highlighted.language;
		return (
			<pre class={`highlight highlight-${hLang}`}>
				<code
					class={`hljs lang-${hLang} br3 f5 pa3 mt4 mb4`}
					dangerouslySetInnerHTML={{ __html: highlighted.value }}
				/>
			</pre>
		);
	}
	return <pre {...props}>{children}</pre>;
};
