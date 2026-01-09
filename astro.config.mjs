// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Set your GitHub Pages URL
	// Format: https://yourusername.github.io
	site: 'https://bjarteb.github.io',

	// Set the base path for your repository
	// If deploying to https://yourusername.github.io/violet-visual/
	// then set base to '/violet-visual'
	// If deploying to https://yourusername.github.io (root domain)
	// then remove or comment out the base property
	base: '/violet-visual',
});
