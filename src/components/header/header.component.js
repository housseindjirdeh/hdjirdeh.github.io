import { h } from 'preact';
import { Link } from 'preact-router/match';

import { HomeIcon } from 'src/icons';

export const Header = () => (
  <div class="ma4 absolute">
    <Link id="home-icon-container" href="/"><HomeIcon /></Link>
  </div>
);

