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

  // Общий метод для выполнения запроса
  async _executeRequest(apiFunc, updateType, payload, updateLocal) {
    // eslint-disable-next-line no-console
    console.log(`Sending request using ${apiFunc.name} for event:`, payload);
    const result = await apiFunc.call(this._api, payload);
    // eslint-disable-next-line no-console
    console.log(`Server responded with ${apiFunc.name} result:`, result);
    updateLocal(result);
    this._notify(updateType, result);
    return result;
  }

  // Обновление события
  async updateEvent(updateType, update) {
    return await this._executeRequest(this._api.updatePoint,updateType,update,(updatedData) => {
      const index = this.#events.findIndex((event) => event.id === updatedData.id);
      if (index !== -1) {
        this.#events[index] = updatedData;
      }
    }
    );
  }

  // Добавление нового события
  async addEvent(updateType, newEvent) {
    return await this._executeRequest(this._api.addPoint,updateType,newEvent,(addedEvent) => {
      this.#events = [addedEvent, ...this.#events];
    }
    );
  }

  // Удаление события
  async deleteEvent(updateType, event) {
    return await this._executeRequest(async (payload) => {
      await this._api.deletePoint(payload.id);
      return payload; // возвращаем исходное событие
    },
    updateType,
    event,
    (deletedEvent) => {
      const index = this.#events.findIndex((item) => item.id === deletedEvent.id);
      if (index !== -1) {
        this.#events.splice(index, 1);
      }
    }
    );
  }
}
