import extrasActionFactory from './index.action';
import { ReservationService } from 'tdp-dlex-ui-sdk';

import SEAT_CONFIG from '../../config/seats.config';
import config from '../../../../config/metadata';

export default extrasActionFactory({
	SEAT_CONFIG,
	marketingContent: config.marketingContent,
	getAirItem: ReservationService.getAirItem,
});
