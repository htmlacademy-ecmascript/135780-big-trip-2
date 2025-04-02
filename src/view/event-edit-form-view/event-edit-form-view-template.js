import { humanizeDate } from '../../utils/event';

const EDIT_FORM_DATE_FORMAT = 'DD/MM/YY';

function createEventDestinationsList(destinations) {
  return destinations.map((destination) =>
    `<option value="${destination.name}"></option>`
  ).join('');
}

function createOffersTemplate(offers) {
  return offers.map((offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden"
        id="${offer.id}"
        type="checkbox"
        name="${offer.title}"
        ${offer.isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  ).join('');
}

function createOffersContainerTemplate(offersByType) {
  return offersByType.length ? (
    `<section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createOffersTemplate(offersByType)}
      </div>
    </section>`
  ) : '';
}

function createDestinationPhotoTemplate(destinationById) {
  return destinationById.pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
  ).join('');
}

function createEventEditFormTemplate(event, destinations, offersList) {
  const { basePrice, dateFrom, dateTo, destination, type, isSaving, isDeleting } = event;
  const startTime = `${humanizeDate(dateFrom, EDIT_FORM_DATE_FORMAT).date} ${humanizeDate(dateFrom).time}`;
  const endTime = humanizeDate(dateTo, EDIT_FORM_DATE_FORMAT).date + humanizeDate(dateTo).time;
  const destinationById = typeof destination === 'object'
    ? destination
    : destinations.find((dest) => dest.id === destination);
  const offersByType = offersList.find((offer) => offer.type.toLowerCase() === type.toLowerCase())?.offers ?? [];

  let resetButtonText;
  if (isDeleting) {
    resetButtonText = 'Deleting...';
  } else if (destination) {
    resetButtonText = 'Delete';
  } else {
    resetButtonText = 'Cancel';
  }

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                <!-- Здесь можно динамически генерировать элементы выбора типа -->
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destinationById.name : ''}" list="destination-list-1" required>
            <datalist id="destination-list-1">
              ${createEventDestinationsList(destinations)}
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" min="1">
          </div>

          <button class="event__save-btn btn btn--blue" type="submit" ${isSaving ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset" ${isDeleting ? 'disabled' : ''}>
            ${resetButtonText}
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOffersContainerTemplate(offersByType)}
          ${destination ? `
          <section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination ? destinationById.description : ''}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${destination ? createDestinationPhotoTemplate(destinationById) : ''}
              </div>
            </div>
          </section>
          ` : ''}
        </section>
      </form>
    </li>`
  );
}

export { createEventEditFormTemplate };
