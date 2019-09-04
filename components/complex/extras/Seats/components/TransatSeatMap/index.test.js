import React from 'react';
import transatSeatMapFactory from './index.component';
import renderer from 'react-test-renderer';

const SeatMapMock = () => <span />;
const I18nMessageMock = () => <span />;
const AncillaryHeaderMock = () => <span />;
const replaceSubstringMock = (str) => str;
const compareOfferByFlightMock = () => {}; // TODO
const getFlightInformationMock = () => ({});
const getTravelerInformationMock = () => ({});
const createRandomIdMock = () => 'mock-id';
const ReactModalMock = () => <div />;
const AriaHiddenDialogContainerMock = () => <div />;

const dataToProcess = {
	item: [
		{
			travelerComposition: 'travelerComposition',
		},
	],
};

const getAirItemMock = () => dataToProcess;
const SEATS_TYPE = 'SEATS_TYPE';

const TransatSeatMap = transatSeatMapFactory({
	SeatMap: SeatMapMock,
	I18nMessage: I18nMessageMock,
	AncillaryHeader: AncillaryHeaderMock,
	replaceSubstring: replaceSubstringMock,
	compareOfferByFlight: compareOfferByFlightMock,
	getAirItem: getAirItemMock,
	getFlightInformation: getFlightInformationMock,
	getTravelerInformation: getTravelerInformationMock,
	createRandomId: createRandomIdMock,
	ReactModal: ReactModalMock,
	AriaHiddenDialogContainer: AriaHiddenDialogContainerMock,
	SEATS_TYPE,
});

const merchandizing = {};
const marketingContent = {
	seats: [
		{
			type: '',
		},
	],
};
const flightSegmentUri = 'flightSegmentUri';
const seatNumber = 'N7';
const seatMaps = [
	{
		seatLayout: {},
		seatMap: {
			aircraft: {
				name: 'name',
			},
			seat: [
				{
					number: seatNumber,
					uri: 'uri',
					ancillary: {
						code: 'code',
					},
					characteristic: [],
					ancillaryOption: {
						ancillaryPrice: [
							{
								price: { totalFare: {} },
							},
						],
					},
				},
			],
		},
		flightSegmentURI: flightSegmentUri,
	},
];

describe('TransatSeatMap Component tests', () => {
	it('TransatSeatMap should match snapshot', () => {
		const component = renderer.create(
			<TransatSeatMap
				marketingContent={marketingContent}
				dataToProcess={dataToProcess}
				merchandizing={merchandizing}
				flightSegmentUri={flightSegmentUri}
				seatNumber={seatNumber}
				seatMaps={seatMaps}
			/>
		);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
