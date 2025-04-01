import ApiService from './api-service.js';
import EventsModel from './model/events-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PagePresenter from './presenter/page-presenter.js';
import { getRandomString } from './utils/common.js';

const AUTHORIZATION = `Basic ${getRandomString(10)}`;
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const apiService = new ApiService(END_POINT, AUTHORIZATION);


const tripEventsContainer = document.querySelector('.page-main .trip-events');
tripEventsContainer.innerHTML = '<p class="trip-events__msg">Loading...</p>';

Promise.allSettled([
  apiService.getPoints(),
  apiService.getDestinations(),
  apiService.getOffers(),
])
  .then((results) => {
    const [pointsResult, destinationsResult, offersResult] = results;
    if (
      pointsResult.status === 'fulfilled' &&
      destinationsResult.status === 'fulfilled' &&
      offersResult.status === 'fulfilled'
    ) {

      const eventsModel = new EventsModel(pointsResult.value);
      const destinationsModel = new DestinationsModel(destinationsResult.value);
      const offersModel = new OffersModel(offersResult.value);


      const pagePresenter = new PagePresenter(eventsModel, destinationsModel, offersModel);
      pagePresenter.init();
    } else {
      tripEventsContainer.innerHTML = '<p class="trip-events__msg">Failed to load data</p>';
      // eslint-disable-next-line no-console
      console.error('Error loading data:', results.filter((result) => result.status === 'rejected'));
    }
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Unexpected error:', error);
    tripEventsContainer.innerHTML = '<p class="trip-events__msg">Failed to load data</p>';
  });
