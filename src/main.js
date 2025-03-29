import ApiService from './api-service.js';
import EventsModel from './model/events-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PagePresenter from './presenter/page-presenter.js';

// Установите свои значения
const AUTHORIZATION = 'Basic your_random_string';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

// Отобразите сообщение о загрузке (разметка может быть взята из markup)
const tripEventsContainer = document.querySelector('.page-main .trip-events');
tripEventsContainer.innerHTML = '<p class="trip-events__msg">Loading...</p>';

Promise.all([
  apiService.getPoints(),
  apiService.getDestinations(),
  apiService.getOffers(),
])
  .then(([points, destinations, offers]) => {
    // Создаём модели с данными с сервера
    const eventsModel = new EventsModel(points);
    const destinationsModel = new DestinationsModel(destinations);
    const offersModel = new OffersModel(offers);

    // Инициализируем презентер страницы
    const pagePresenter = new PagePresenter(eventsModel, destinationsModel, offersModel);
    pagePresenter.init();
  })
  .catch((error) => {
    console.error('Error loading data:', error);
    // При ошибке очистите контейнер и отобразите заглушку
    tripEventsContainer.innerHTML = '<p class="trip-events__msg">Failed to load data</p>';
  });
