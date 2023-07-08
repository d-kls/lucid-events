/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			keyframes: {
				slideIn: {
					"0%": { transform: "translate3d(0, 100%, 0)" },
					"100%": { transform: "translate3d(0, 0, 0)" },
				},
				fade: {
					"0%": { opacity: "1" },
					"50%": { opacity: "0.2" },
					"100%": { opacity: "1" },
				},
			},
			animation: {
				slideIn: "slideIn 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
				fade: "fade 1s cubic-bezier(0.25, 1, 0.5, 1) infinite",
			},
			boxShadow: {
				"lg-up":
					"0 -10px 15px -3px rgb(0 0 0 / 0.1), 0 -4px 6px -4px rgb(0 0 0 / 0.1)",
			},
			colors: {
				"dark-purple": "#242226",
				"acc-purple": "#A64CFF",
				"light-purple": "#dbbbfa",
				"inactive-purple": "#AEAAB3",
				"card-purple": "#2B292E",
				"label-purple": "#F9F2FF",
				"acc-green": "#90C418",
				"acc-blue": "#59ADFF",
				"label-black": "#181719",
			},
		},
	},
	plugins: [],
	prefix: "et-",
};
