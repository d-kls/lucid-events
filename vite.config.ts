import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig, ModuleNode, Plugin } from "vite";
import dts from "vite-plugin-dts";

// storybook uses vite hmr in this case. When f.ex. changing the createEvent file
// the StorySetup.ts file will be HMRed, but not the event bus. This will cause the events to be executed
// twice, causing an error, since duplicated event names are not allowed. This should only happen in dev
// HMR mode and never in prod (unless there are actually several events with the same name).
// To circumvent, the event bus is added to the hmr modules if it is not already, but is imported in any module
// that is HMRed
// ?? changes to logger still cause the HMR issue TBD
const hmrCompatibleEvents: () => Plugin = () => ({
	name: "HmrCompatibleEvents",
	handleHotUpdate(ctx) {
		let isInHmrModules = false;
		let importedBus: ModuleNode | null = null;
		ctx.modules.forEach((module) => {
			if (module.url.endsWith("event-bus/index.ts")) isInHmrModules = true;

			module.importedModules.forEach((imp) => {
				if (imp.url.endsWith("event-bus/index.ts")) importedBus = imp;
			});
		});

		const toUpdateModules = !isInHmrModules
			? !!importedBus
				? [...ctx.modules, importedBus]
				: ctx.modules
			: ctx.modules;

		return toUpdateModules;
	},
});

export default defineConfig((env) => ({
	publicDir: false,
	plugins: [
		hmrCompatibleEvents(),
		react(),
		dts({
			include: ["src/"],
			exclude: ["src/stories"],
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.tsx"),
			name: "event-tracer",
			fileName: "index",
		},
		rollupOptions: {
			external: ["react", "react-dom", "@hpcc-js/wasm/graphviz", /^@radix-ui.*/],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "src/setup-tests.ts",
	},
}));
