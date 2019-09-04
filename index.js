mport React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './AppContainer';
import {
	Flux,
	DynamicContentService,
} from 'tdp-dlex-ui-sdk';
import config from '../config/metadata';
import App from './components/complex/App';
import { routes, documentNotFoundRoute } from './router';

import './scss/styles.scss';

import { getSearchValue } from './data-layer/services/LocationService';

const flux = new Flux({}, config);
const language = getSearchValue(window.location.search, DEEP_LINK_LANG);
const pointOfSale = getSearchValue(window.location.search, DEEP_LINK_POS);
const extraData = getSearchValue(window.location.search, DEEP_LINK_EXTRA_DATA);

import {
	addActions,
	addStores,
} from './data-layer';

addActions(flux);
addStores(flux);

const {
	dynamicContent: {
		host,
		generateUrl,
	},
	cmsCountryLanguage,
} = config;

const SessionActions = flux.getActions('Session');

// clear session for deep links
if (window.location.pathname.indexOf('external') > -1) {
	SessionActions.clearUserSessionId();
}

let lang = '';
let pos = '';
let userSessionId = '';
if (extraData) {
	try {
		const params = JSON.parse(atob(extraData));
		pos = params[DEEP_LINK_POS];
		lang = params[DEEP_LINK_LANG];
		userSessionId = params[DEEP_LINK_USER_SESSION_ID];
	} catch (ex) {
		lang = language;
		pos = pointOfSale;
	}
} else {
	lang = language;
	pos = pointOfSale;
}

// set defaults query params for requests
flux.getActions('App').setLanguage(lang || config.defaultLocale);

let createSession = Promise.resolve({ pos: pos || config.pos });

if (!flux.getStore('Session').getUserSession()) {
	createSession = SessionActions.createSession({ pos, languageCode: lang });
}

// load point of sale
createSession
	.then(({ pos: pointOfSaleCode }) => flux.getActions('App').fetchPointOfSale(pointOfSaleCode))
	.then(() => {
		const { loadContent } = DynamicContentService;
		const systemLocale = flux.getStore('App').getSystemLocale();
		const locale = cmsCountryLanguage[systemLocale] || systemLocale;

		ReactDOM.render((
			<AppContainer
				App={App}
				flux={flux}
				config={config}
				routes={routes}
			/>
		), document.getElementById('app'));

		loadContent({
			url: generateUrl({
				host,
				locale,
				section: 'header',
			}),
			placeholder: document.getElementById('header'),
			attr: 'header',
		});

		loadContent({
			url: generateUrl({
				host,
				locale,
				section: 'footer',
			}),
			placeholder: document.getElementById('footer'),
			attr: 'footer',
		});
	})
	.catch(() => {
		if (process.env.NODE_ENV === 'development') {
		// eslint-disable-next-line no-debugger
			debugger;
		}
		// case when session has been expired, wrong connection or pos not found
		// TODO: render only expiration popup to redirect user
		ReactDOM.render((
			<AppContainer
				App={App}
				flux={flux}
				config={config}
				routes={documentNotFoundRoute}
			/>
		), document.getElementById('app'));
	});

