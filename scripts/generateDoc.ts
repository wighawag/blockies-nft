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
	for (const ak of Object.keys(a)) {
		const singleA = a[ak];
		const singleMerge: SingleMerge = merged[ak] || {signature: ak};
		for (const k of Object.keys(a[ak])) {
			(singleMerge as any)[k] = (singleA as any)[k];
		}
		merged[ak] = singleMerge;
	}
	for (const bk of Object.keys(b)) {
		const singleB = b[bk];
		const singleMerge: SingleMerge = merged[bk] || {signature: bk};
		for (const k of Object.keys(b[bk])) {
			(singleMerge as any)[k] = (singleB as any)[k];
		}
		merged[bk] = singleMerge;
	}
	const methodList: Method[] = [];
	for (const key of Object.keys(merged)) {
		const rawNatspec = merged[key];
		let returns;
		if (rawNatspec.returns) {
			returns = Object.keys(rawNatspec.returns).map((v) => {
				if (v.startsWith('_') && !isNaN(parseInt(v.slice(1)))) {
					return {
						description: rawNatspec.returns[v]
					};
				} else {
					return {
						name: v,
						description: rawNatspec.returns[v]
					};
				}
			});
		}
		let params;
		if (rawNatspec.params) {
			params = Object.keys(rawNatspec.params).map((v) => {
				return {
					name: v,
					description: rawNatspec.params[v]
				};
			});
		}
		const notice = rawNatspec.notice;
		methodList.push({
			signature: key,
			natspec: {
				returns,
				params,
				notice
			}
		});
	}
	return methodList;
}

async function main() {
	Handlebars.registerHelper('eq', (a, b) => a == b);

	const template = Handlebars.compile(fs.readFileSync('docs_template/contracts.hbs', {encoding: 'utf-8'}));
	const namedDeployments = await deployments.all();
	const list = [];
	for (const name of Object.keys(namedDeployments)) {
		const deployment = namedDeployments[name];
		list.push({
			name,
			devdoc: deployment.devdoc,
			userdoc: deployment.userdoc,
			methods: mergeMethods(deployment.devdoc?.methods, deployment.userdoc?.methods)
		});
	}

	const result = template({deployed: list});
	fs.writeFileSync('docs/index.md', result);
}
main();
