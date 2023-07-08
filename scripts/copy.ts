import fs from "fs";

function copyPackageJson() {
	if (fs.existsSync("package.json")) {
		fs.copyFileSync("package.json", "dist/package.json");
	}

	if (fs.existsSync("LICENSE")) {
		fs.copyFileSync("LICENSE", "dist/LICENSE");
	}
}

console.log("starting copy of package.json & LICENSE");
copyPackageJson();
console.log("finished copy");
