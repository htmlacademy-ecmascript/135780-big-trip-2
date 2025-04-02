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

  // Обновление события: отправляет обновлённые данные на сервер, при успехе обновляет локальные данные
  async updateEvent(updateType, update) {
    const updatedData = await this._api.updatePoint(update);
    const index = this.#events.findIndex((event) => event.id === updatedData.id);
    if (index !== -1) {
      this.#events[index] = updatedData;
      this._notify(updateType, updatedData);
    }
    return updatedData;
  }

  // Добавление нового события: отправляем POST‑запрос
  async addEvent(updateType, newEvent) {
    // Отправляем запрос к серверу и ждём его завершения.
    const addedEvent = await this._api.addPoint(newEvent);
    this.#events = [addedEvent, ...this.#events];
    this._notify(updateType, addedEvent);
    return addedEvent;
  }


  // Удаление события: отправляем DELETE‑запрос
  async deleteEvent(updateType, event) {
    await this._api.deletePoint(event.id);
    const index = this.#events.findIndex((item) => item.id === event.id);
    if (index !== -1) {
      this.#events.splice(index, 1);
    }
    this._notify(updateType, event);
  }
}
