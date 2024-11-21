// import adapter from '@sveltejs/adapter-auto';
import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import path from "path"

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			precompress: true,
		}),
		csrf: {
			checkOrigin: false,
		},
		alias: {
			"@components": path.resolve("./src/lib/components"),
			"@types": path.resolve("./src/lib/types"),
			"@lib": path.resolve("./src/lib"),
			"$lib": path.resolve("./src/lib"),
		},
		version: {
			name: process.env.npm_package_version
		}
	},

	vitePlugin: {
		inspector: true,
	},
}

export default config
