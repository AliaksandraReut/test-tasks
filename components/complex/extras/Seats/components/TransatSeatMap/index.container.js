import transatSeatMapFactory from './index.component';
import { SeatMap, I18nMessage, ReservationService } from 'tdp-dlex-ui-sdk';
import { replaceSubstring,
	compareOfferByFlight
} from '../data-layer/services/SomeService';
import {
	SEATS_TYPE,
	CHILD_CODE,
} from '../../../../../../data-layer/constants';
import Dialog from '../atomic/SomeComp';
import TSFontIcon from '../atomic/SomeComponent';

const { getAirItem } = ReservationService;

export default transatSeatMapFactory({
	SeatMap,
	replaceSubstring,
	compareOfferByFlight,
	getAirItem,
	Dialog,
	TSFontIcon,
	I18nMessage,
	SEATS_TYPE,
	CHILD_CODE,
});
