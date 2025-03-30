import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinations = [];

  constructor(initialDestinations = []) {
    super();
    this.#destinations = initialDestinations;
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id) || null;
  }
}
