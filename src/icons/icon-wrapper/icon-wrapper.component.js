import { h } from 'preact';

export const IconWrapper = ({ size, children, viewBox }) => (
	<svg width={size} height={size} preserveAspectRatio="none" viewBox={viewBox}>
		{children}
	</svg>
);
