class ApiService {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  async _load({ url, method = 'GET', body = null, headers = {} }) {
    const response = await fetch(url, {
      method,
      body,
      headers: new Headers({
        'Authorization': this._authorization,
        ...headers,
      }),
    });
    this._checkStatus(response);
    return response.json();
  }

  async _getData(endpoint, adaptFn) {
    const data = await this._load({ url: `${this._endPoint}/${endpoint}` });
    return adaptFn.call(this, data);
  }

  async _sendData(endpoint, method, point) {
    const adaptedPoint = this._adaptToServer(point);
    const url = point.id ? `${this._endPoint}/${endpoint}/${point.id}` : `${this._endPoint}/${endpoint}`;
    const data = await this._load({
      url,
      method,
      body: JSON.stringify(adaptedPoint),
      headers: { 'Content-Type': 'application/json' },
    });
    return this._adaptFromServer(data);
  }

  async getPoints() {
    return this._getData('points', this._adaptPoints);
  }

  async getDestinations() {
    return this._getData('destinations', this._adaptDestinations);
  }

  async getOffers() {
    return this._getData('offers', this._adaptOffers);
  }

  // Метод для обновления точки маршрута на сервере
  async updatePoint(point) {
    return this._sendData('points', 'PUT', point);
  }

  // Метод для создания точки маршрута
  async addPoint(point) {
    return this._sendData('points', 'POST', point);
  }

  // Метод для удаления точки маршрута
  async deletePoint(pointId) {
    await this._load({
      url: `${this._endPoint}/points/${pointId}`,
      method: 'DELETE',
    });
    return true;
  }

  _checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  // Адаптация точек, полученных с сервера, в формат приложения
  _adaptPoints(pointsFromServer) {
    return pointsFromServer.map((point) => this._adaptFromServer(point));
  }

  _adaptDestinations(destinationsFromServer) {
    return destinationsFromServer;
  }

  _adaptOffers(offersFromServer) {
    return offersFromServer;
  }

  // Адаптер для преобразования данных приложения в формат сервера
  _adaptToServer(point) {
    return {
      'id': point.id,
      'base_price': point.basePrice,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : point.dateFrom,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : point.dateTo,
      'destination': point.destination,
      'is_favorite': point.isFavorite,
      'offers': point.offers,
      'type': point.type,
    };
  }

  // Адаптер для преобразования данных сервера в формат приложения
  _adaptFromServer(data) {
    return {
      id: data.id,
      basePrice: data.base_price,
      dateFrom: new Date(data.date_from),
      dateTo: new Date(data.date_to),
      destination: data.destination,
      isFavorite: data.is_favorite,
      offers: data.offers,
      type: data.type,
    };
  }
}

export default ApiService;
