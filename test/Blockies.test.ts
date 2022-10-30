import {expect} from './chai-setup';
import {setup} from './setup';

describe('Blockies', function () {
	it('works', async function () {
		const state = await setup();
		expect(state).to.be.not.null;
	});
});
