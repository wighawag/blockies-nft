import fs from 'fs-extra';

fs.emptyDirSync('coverage-src');
fs.copySync('src/', './coverage-src');
const files = fs.readdirSync('coverage-src');
for (const file of files) {
	let content = fs.readFileSync(`coverage-src/${file}`, {encoding: 'utf-8'});
	while (content.indexOf('"solidity-kit/') != -1) {
		content = content.replace('"solidity-kit/', '"./solidity-kit/');
	}
	fs.writeFileSync(`coverage-src/${file}`, content);
}
fs.copySync('node_modules/solidity-kit/solc_0.8', 'coverage-src/solidity-kit/solc_0.8');
