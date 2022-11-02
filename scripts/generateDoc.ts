import * as Handlebars from 'handlebars';
import fs from 'fs';
import {deployments} from 'hardhat';

type SingleMerge = {params?: any; returns?: any; notice?: string};
type Merged = {[name: string]: SingleMerge};

type Method = {signature: string; natspec?: SingleMerge};

function mergeMethods(
	a: {[name: string]: {params?: any; returns?: any}},
	b: {[name: string]: {notice?: string}}
): Method[] {
	const merged: Merged = {};
	if (a) {
		for (const ak of Object.keys(a)) {
			let singleA = a[ak];

			if (Array.isArray(singleA)) {
				singleA = singleA[0];
				// console.log(`singleA`, singleA);
			}
			const singleMerge: SingleMerge = merged[ak] || {signature: ak};

			for (const k of Object.keys(singleA)) {
				(singleMerge as any)[k] = (singleA as any)[k];
			}
			merged[ak] = singleMerge;
		}
	}

	if (b) {
		for (const bk of Object.keys(b)) {
			let singleB = b[bk];
			if (Array.isArray(singleB)) {
				singleB = singleB[0];
				// console.log(`singleB`, singleB);
			}
			const singleMerge: SingleMerge = merged[bk] || {signature: bk};
			for (const k of Object.keys(singleB)) {
				(singleMerge as any)[k] = (singleB as any)[k];
			}
			merged[bk] = singleMerge;
		}
	}

	const methodList: Method[] = [];
	for (const key of Object.keys(merged)) {
		const rawNatspec = merged[key];
		let returns;
		if (rawNatspec.returns) {
			returns = Object.keys(rawNatspec.returns).map((v) => {
				if (v.startsWith('_') && !isNaN(parseInt(v.slice(1)))) {
					return {
						description: rawNatspec.returns[v],
					};
				} else {
					return {
						name: v,
						description: rawNatspec.returns[v],
					};
				}
			});
		}
		let params;
		if (rawNatspec.params) {
			console.log(JSON.stringify(rawNatspec.params));
			params = Object.keys(rawNatspec.params).map((v) => {
				return {
					name: v,
					description: rawNatspec.params[v],
				};
			});
		}
		const notice = rawNatspec.notice;
		methodList.push({
			signature: key,
			natspec: {
				returns,
				params,
				notice,
			},
		});
	}
	return methodList;
}

function generateSignature(fragment: any): string {
	const inputs = fragment.inputs.map((v: any) => v.internalType || v.type).join(',');
	return `${fragment.name}(${inputs})`;
}

function computeNatspec(userdoc: any, devdoc: any, fragment: any): any {
	const params: any[] = [];
	for (const input of fragment.inputs) {
		const name = input.name;

		if (devdoc && devdoc.params && devdoc.params[name]) {
			params.push({
				name,
				description: devdoc.params[name],
			});
		}
	}

	const returns: any[] = [];
	if (fragment.outputs) {
		for (const output of fragment.outputs) {
			const name = output.name;

			if (devdoc && devdoc.returns && devdoc.returns[name]) {
				returns.push({
					name,
					description: devdoc.returns[name],
				});
			}
		}
	}

	let notice;
	if (userdoc) {
		notice = userdoc.notice;
	}
	return {notice, params, returns};
}

async function main() {
	Handlebars.registerHelper('eq', (a, b) => a == b);

	const template = Handlebars.compile(fs.readFileSync('docs_template/contracts.hbs', {encoding: 'utf-8'}));
	const namedDeployments = await deployments.all();
	const list = [];
	for (const name of Object.keys(namedDeployments)) {
		const deployment = namedDeployments[name];
		const methods: any[] = [];
		const errors: any[] = [];
		const events: any[] = [];

		for (const fragment of deployment.abi) {
			const signature = generateSignature(fragment);
			if (fragment.type === 'error') {
				let userdoc = deployment.userdoc?.errors && deployment.userdoc?.errors[signature];
				if (Array.isArray(userdoc)) {
					userdoc = userdoc[0];
				}
				let devdoc = deployment.devdoc?.errors && deployment.devdoc?.errors[signature];
				if (Array.isArray(devdoc)) {
					devdoc = devdoc[0];
				}
				if (userdoc) {
					const natspec = computeNatspec(userdoc, devdoc, fragment);
					errors.push({signature, natspec});
				}
			} else if (fragment.type === 'event') {
				const userdoc = deployment.userdoc?.events && deployment.userdoc?.events[signature];
				const devdoc = deployment.devdoc?.events && deployment.devdoc?.events[signature];
				if (userdoc) {
					const natspec = computeNatspec(userdoc, devdoc, fragment);
					events.push({signature, natspec});
				}
			} else if (fragment.type === 'function') {
				const userdoc = deployment.userdoc?.methods && deployment.userdoc?.methods[signature];
				const devdoc = deployment.devdoc?.methods && deployment.devdoc?.methods[signature];
				if (userdoc) {
					const natspec = computeNatspec(userdoc, devdoc, fragment);
					methods.push({signature, natspec});
				}
			}
		}

		list.push({
			name,
			devdoc: deployment.devdoc,
			userdoc: deployment.userdoc,
			methods,
			errors,
			events,
			// methods: mergeMethods(deployment.devdoc?.methods, deployment.userdoc?.methods),
			// errors: mergeMethods(deployment.devdoc?.errors, deployment.userdoc?.errors),
			// events: mergeMethods(deployment.devdoc?.events, deployment.userdoc?.events),
		});
	}

	const result = template({deployed: list});
	fs.writeFileSync('docs/index.md', result);
}
main();
