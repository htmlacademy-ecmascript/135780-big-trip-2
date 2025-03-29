import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offers = [];

  constructor(initialOffers = []) {
    super();
    this.#offers = initialOffers;
  }

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type)?.offers || [];
  }
}
