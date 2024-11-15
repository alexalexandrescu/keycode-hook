/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
	transform: {
		"^.+.tsx?$": ["ts-jest", {}],
	},
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
