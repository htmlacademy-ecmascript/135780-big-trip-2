class ApiService {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  async getPoints() {
    const response = await fetch(`${this._endPoint}/points`, {
      headers: { 'Authorization': this._authorization },
    });
    this._checkStatus(response);
    const data = await response.json();
    return this._adaptPoints(data);
  }

  async getDestinations() {
    const response = await fetch(`${this._endPoint}/destinations`, {
      headers: { 'Authorization': this._authorization },
    });
    this._checkStatus(response);
    const data = await response.json();
    return this._adaptDestinations(data);
  }

  async getOffers() {
    const response = await fetch(`${this._endPoint}/offers`, {
      headers: { 'Authorization': this._authorization },
    });
    this._checkStatus(response);
    const data = await response.json();
    return this._adaptOffers(data);
  }

  // Метод для обновления точки маршрута на сервере
  async updatePoint(point) {
    const adaptedPoint = this._adaptToServer(point);
    const response = await fetch(`${this._endPoint}/points/${point.id}`, {
      method: 'PUT',
      body: JSON.stringify(adaptedPoint),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': this._authorization,
      }),
    });
    this._checkStatus(response);
    const data = await response.json();
    return this._adaptFromServer(data);
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
