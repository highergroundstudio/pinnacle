import { sveltekit } from "@sveltejs/kit/vite"
import type { UserConfig } from "vite"
import { purgeCss } from 'vite-plugin-tailwind-purgecss'
import path from "path";

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const file = fileURLToPath(new URL('package.json', import.meta.url))
const json = readFileSync(file, 'utf8')
const pkg = JSON.parse(json);

const config: UserConfig = {
	plugins: [sveltekit(), purgeCss()],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
	},
	resolve: {
		alias: {
			"$actions": path.resolve("./src/actions"),
			"$components": path.resolve("./src/components"),
			"$data": path.resolve("./src/data"),
			"$routes": path.resolve("./src/routes"),
			"$stores": path.resolve("./src/stores"),
			"$styles": path.resolve("./src/styles"),
			"$svg": path.resolve("./src/svg"),
			"$utils": path.resolve("./src/utils")
		}
	},
	define: {
		'__APP_VERSION__': JSON.stringify(pkg.version),
	}
}

export default config
