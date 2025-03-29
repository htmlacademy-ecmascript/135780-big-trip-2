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

  _checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  // Адаптер для точек маршрута – преобразует данные сервера в формат приложения
  _adaptPoints(pointsFromServer) {
    return pointsFromServer.map((point) => ({
      id: point.id,
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      destination: point.destination, // предполагается, что destination – идентификатор
      isFavorite: point['is_favorite'],
      offers: point.offers, // если сервер возвращает массив офферов, можно оставить как есть или адаптировать
      type: point.type,
    }));
  }

  _adaptDestinations(destinationsFromServer) {
    // Если сервер возвращает массив объектов – можно вернуть напрямую,
    // либо адаптировать, если структура отличается.
    return destinationsFromServer;
  }

  _adaptOffers(offersFromServer) {
    // Если сервер возвращает данные в виде объекта с ключами (например, по типам),
    // можно преобразовать его в массив нужной структуры.
    return offersFromServer;
  }
}

export default ApiService;
