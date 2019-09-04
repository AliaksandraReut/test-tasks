export default ({
	SEAT_CONFIG,
	marketingContent,
	getAirItem,
}) => class ExtrasAction {
	loadResources({ shoppingCartId, merchandizingId }) {
		return (dispatch, alt) => {
			const { merchandizing } = alt.getStore('Merchandizing').getState();
			let promises = [];

			if (!merchandizing || merchandizing.id !== merchandizingId) {
				alt.getStore('Seats').setSeatConfig(SEAT_CONFIG);
				const merchandizingPromise = alt.getActions('Merchandizing').searchById(merchandizingId);

				const shoppingCartPromise = alt.getActions('CustomShoppingCart').searchById(shoppingCartId).then(() => {
					const { shoppingCart: updatedShoppingCart } = alt.getStore('ShoppingCart').getState();
					const airItem = getAirItem(updatedShoppingCart);
					const { url: urlGenerator } = marketingContent;

					return alt.getActions('CMSCache').loadMarketingContent({ airItem, urlGenerator });
				});

				promises = [shoppingCartPromise, merchandizingPromise];
			}

			return Promise.all(promises);
		};
	}

	goToPreviousPage() {
		return (dispatch, alt) => alt.router.history.goBack();
	}
};
