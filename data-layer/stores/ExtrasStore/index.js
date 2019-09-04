export default class ExtrasStore {
	constructor() {
		const action = this.alt.getActions('Extras');

		this.bindActions(action);
	}
}
