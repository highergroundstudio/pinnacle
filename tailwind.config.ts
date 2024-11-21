import { join } from 'path'
import type { Config } from 'tailwindcss'

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin'

//import our custom theme
import { eeTheme } from './ee-theme'

const config = {
	// 1. Apply the dark mode class setting:
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
		extend: {},
	},

	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		skeleton({
			themes: {
				// preset: ["skeleton", "wintry"],
				custom: [
					eeTheme
				]
			}
		}),
	],
} satisfies Config

export default config
