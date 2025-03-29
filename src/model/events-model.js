import Observable from '../framework/observable.js';

export default class EventsModel extends Observable {
  #events = [];

  constructor(initialEvents = [], apiService) {
    super();
    this.#events = initialEvents;
    this._api = apiService;
  }

  get events() {
    return this.#events;
  }

  // Обновления события: отправляет обновлённые данные на сервер, при успехе, обновляет локальные данные
  async updateEvent(updateType, update) {
    const updatedData = await this._api.updatePoint(update);
    const index = this.#events.findIndex((event) => event.id === updatedData.id);
    if (index !== -1) {
      this.#events[index] = updatedData;
      this._notify(updateType, updatedData);
    }
    return updatedData;
  }

  addEvent(updateType, newEvent) {
    this.#events = [newEvent, ...this.#events];
    this._notify(updateType, newEvent);
  }

  deleteEvent(updateType, event) {
    const index = this.#events.findIndex((item) => item.id === event.id);
    if (index !== -1) {
      this.#events.splice(index, 1);
    }
    this._notify(updateType, event);
  }
}
