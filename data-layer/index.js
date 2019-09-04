import * as stores from './stores';
import * as actions from './actions';

function isFunction(f) {
	return typeof f === 'function';
}

export function addActions(flux) {
	Object.keys(actions).forEach(key =>
		isFunction(actions[key]) && flux.addActions(key, actions[key]));
}

export function addStores(flux) {
	Object.keys(stores).forEach(key =>
		isFunction(stores[key]) && flux.addStore(key, stores[key]));
}
