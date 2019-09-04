import React from 'react';
import seatsFactory from './index.component';
import renderer from 'react-test-renderer';

const SeatMock = () => <span />;
const TransatSeatMapMock = () => <span />;

const Seats = seatsFactory({
	Seat: SeatMock,
	TransatSeatMap: TransatSeatMapMock,
});

describe('Seats Component tests', () => {
	it('Seats should match snapshot', () => {
		const component = renderer.create(
			<Seats />
		);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
