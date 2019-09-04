import React, { Component } from 'react';
import PropTypes from 'prop-types';

const TRANSAT_SEAT_MAP = 'TRANSAT_SEAT_MAP';
const SEAT = 'SEAT';

export default ({
	Seat,
	TransatSeatMap,
}) => class Seats extends Component {
	static propTypes = {
		dataToProcess: PropTypes.object,
		merchandizing: PropTypes.object,
		marketingContent: PropTypes.object,
		offers: PropTypes.array,
		seatMaps: PropTypes.array,
		flightSegmentUri: PropTypes.string,
		travelerCompositionUri: PropTypes.string,
		selectedSubSection: PropTypes.string,
		seatNumber: PropTypes.string,
		onSeatSelect: PropTypes.func,
		onChangeSelectedSubSection: PropTypes.func,
		onConfirmSelection: PropTypes.func,
	};

	static childContextTypes = {
		namespace: PropTypes.string,
		translationContext: PropTypes.string,
	};

	constructor(props) {
		super(props);

		let { selectedSubSection } = props;
		if (selectedSubSection !== SEAT && selectedSubSection !== TRANSAT_SEAT_MAP) {
			selectedSubSection = TRANSAT_SEAT_MAP;
		}

		this.state = {
			selectedSubSection,
		};
		this.__namespace = 'ts-next-gen-ux.components.complex.extras.Seats';
	}

	getChildContext() {
		return {
			namespace: this.__namespace,
			translationContext: this.__namespace,
		};
	}

	componentWillReceiveProps(newProps) {
		this.setState(() => ({
			selectedSubSection: newProps.selectedSubSection,
		}));
	}

	onSeatSelect = (seat) => {
		this.changeSelectedSubSection(SEAT);
		this.props.onSeatSelect(seat);
	};

	onModifySelection = () => {
		this.changeSelectedSubSection(TRANSAT_SEAT_MAP);
	};

	changeSelectedSubSection = (selectedSubSection) => {
		this.setState(() => ({
			selectedSubSection,
		}), () => {
			this.props.onChangeSelectedSubSection(selectedSubSection);
		});
	};

	renderSubSection(selectedSubSection) {
		const {
			dataToProcess,
			merchandizing,
			marketingContent,
			offers,
			seatMaps,
			flightSegmentUri,
			travelerCompositionUri,
			seatNumber,
			onConfirmSelection,
		} = this.props;

		switch (selectedSubSection) {
		case SEAT:
			return (
				<SomeOtherComponent/>
			);
		case TRANSAT_SEAT_MAP:
		default:
			return (
				<TransatSeatMap
					dataToProcess={dataToProcess}
					merchandizing={merchandizing}
					marketingContent={marketingContent}
					offers={offers}
					seatMaps={seatMaps}
					flightSegmentUri={flightSegmentUri}
					travelerCompositionUri={travelerCompositionUri}
					onSeatSelect={this.onSeatSelect}
				/>
			);
		}
	}

	render() {
		const { selectedSubSection } = this.state;

		return (
			<div className="seats-container">
				{this.renderSubSection(selectedSubSection)}
			</div>
		);
	}
};
