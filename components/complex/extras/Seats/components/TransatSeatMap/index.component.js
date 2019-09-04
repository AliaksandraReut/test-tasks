import React, { Component } from 'react';
import PropTypes from 'prop-types';

const defaultCockpitImgUrl = require('./../../../../../../images/cockpit.png');

export default ({
	SeatMap,
	replaceSubstring,
	compareOfferByFlight,
	getAirItem,
	Dialog,
	I18nMessage,
	TSFontIcon,
	SEATS_TYPE,
	CHILD_CODE,
}) => class TransatSeatMap extends Component {
	static propTypes = {
		offers: PropTypes.array,
		seatMaps: PropTypes.array,
		onSeatSelect: PropTypes.func,
		dataToProcess: PropTypes.object,
		merchandizing: PropTypes.object,
		marketingContent: PropTypes.object,
		onCloseBtnClick: PropTypes.func,
		flightSegmentUri: PropTypes.string,
		travelerCompositionUri: PropTypes.string,
	};

	static defaultProps = {
		offers: [],
		seatMaps: [],
		onSeatSelect: () => {
		},
		dataToProcess: null,
		merchandizing: null,
		marketingContent: null,
		onCloseBtnClick: () => {
		},
		flightSegmentUri: '',
		travelerCompositionUri: '',
	};

	static contextTypes = {
		dimensionType: PropTypes.string,
		translationContext: PropTypes.string,
	};

	static childContextTypes = {
		namespace: PropTypes.string,
		translationContext: PropTypes.string,
	};

	constructor() {
		super();

		this.state = {
			hasIsolateSeatError: false,
			hasExitChildError: false,
		};
	}

	getChildContext() {
		return {
			namespace: this.__namespace,
			translationContext: this.__namespace,
		};
	}

	onIsolateErrorHide = () => {
		this.setState({ hasIsolateSeatError: false });
	};

	onExitChildErrorHide = () => {
		this.setState({
			hasExitChildError: false,
			hasIsolateSeatError: false,
		});
	};

	onSeatSelect = ({ travelerComposition }) => (seat) => {
		const hasChildError = this.getChildError({ travelerComposition, seat });

		const { hasExitChildError } = this.state;
		const newState = {};

		if (hasChildError !== hasExitChildError) {
			newState.hasExitChildError = hasChildError;
		}

		if (Object.keys(newState).length > 0) {
			this.setState(newState);
		} else {
			this.props.onSeatSelect(seat);
		}
	};

	getChildError({ travelerComposition, seat }) {
		const { travelerCompositionUri } = this.props;
		const traveler = travelerComposition.find(tc => tc.uri === travelerCompositionUri);
		const { type } = traveler;

		if (type.code === CHILD_CODE) {
			const isExitSeat = seat.characteristic.some(ch => ch.code === 17);

			if (isExitSeat) {
				return true;
			}
		}

		return false;
	}

	getErrorDialog({ closeButtonId, tittleId, messageId, onCloseHandler }) {
		const continueButton = (<button
			type="button"
			className="transat-button transat-button--functionality"
			onClick={onCloseHandler}
		>
			<I18nMessage
				id={closeButtonId}
				boundContext={this.namespace}
			/>
		</button>);

		return (<Dialog
			className="isolate-seat-dialog"
			show
			popupTitle={<I18nMessage
				id={tittleId}
				boundContext={this.namespace}
			/>}
			showCloseIcon
			shouldCloseOnOverlayClick
			shouldCloseOnEsc
			onHide={onCloseHandler}
			buttons={[continueButton]}
			closeIcon={<TSFontIcon name="closeXRND"/>}
		>
			<div className="isolate-seat-dialog__content">
				<I18nMessage
					id={messageId}
					boundContext={this.namespace}
					tagName="p"
					className="isolate-seat-dialog__description"
				/>
			</div>
		</Dialog>);
	}

	renderIsolateSeatError() {
		const { hasIsolateSeatError, hasExitChildError } = this.state;

		if (!hasExitChildError && hasIsolateSeatError) {
			return this.getErrorDialog({
				closeButtonId: 'ISOLATE_SEAT_CLOSE_BUTTON',
				tittleId: 'ISOLATE_SEAT_NOTIFICATION_TITLE',
				messageId: 'ISOLATE_SEAT_NOTIFICATION_MESSAGE',
				onCloseHandler: this.onIsolateErrorHide,
			});
		}

		return null;
	}

	renderExitChildError() {
		const { hasExitChildError } = this.state;

		if (hasExitChildError) {
			return this.getErrorDialog({
				closeButtonId: 'EXIT_CHILD_ERROR_CLOSE_BUTTON',
				tittleId: 'EXIT_CHILD_ERROR_TITLE',
				messageId: 'EXIT_CHILD_ERROR_MESSAGE',
				onCloseHandler: this.onExitChildErrorHide,
			});
		}

		return null;
	}

	render() {
		const {
			dataToProcess,
			merchandizing,
			offers,
			seatMaps,
			flightSegmentUri,
			marketingContent,
		} = this.props;

		const seatMap = seatMaps.find(sMap => sMap.flightSegmentURI === flightSegmentUri) || {};

		if (!seatMap.seatLayout || !merchandizing || !dataToProcess) {
			return null;
		}

		const cockpitImgUrl = marketingContent.aircraft && marketingContent.aircraft.cockpit ?
			marketingContent.aircraft.cockpit : defaultCockpitImgUrl;

		const seatMapConfig = {
			showSeatPrice: true,
			cockpitImgUrl,
		};
		const aircraftName = replaceSubstring(seatMap.seatMap.aircraft.name, /\s/, '-');

		const seatOffers = compareOfferByFlight({
			offers: offers.filter(o => o.ancillary.ancillary.type === SEATS_TYPE),
			flightSegmentUri,
		});

		const airOffer = getAirItem(dataToProcess);
		const travelerComposition = airOffer.travelerComposition;

		return (
			<div
				className={`seat-map-container ${this.context.dimensionType}`}
				ref={transatSeatMap => { this.transatSeatMap = transatSeatMap; }}
			>
				<div className={`seat-map-wrapper ${aircraftName}`}>
					<SeatMap
						seatMap={seatMap.seatLayout}
						onSeatSelect={this.onSeatSelect({ travelerComposition })}
						seatOffers={seatOffers}
						seatMapConfig={seatMapConfig}
						travelers={travelerComposition}
					/>
				</div>
				{this.renderExitChildError()}
				{this.renderIsolateSeatError()}
			</div>
		);
	}
};
