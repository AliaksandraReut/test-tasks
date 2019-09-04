import Extras from '../pages/extras/Extras';

import DocumentNotFound from '../pages/DocumentNotFound';

export const routes = [
	{
		path: '/extras',
		component: Extras,
		routes: [],
	},
];

export const documentNotFoundRoute = [{
	path: '/',
	component: DocumentNotFound,
	routes: [],
}];

