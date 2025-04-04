import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import EventEditFormView from '../view/event-edit-form-view/event-edit-form-view.js';
import { EVENT_TYPES } from '../const.js';

export default class NewEventPresenter {
  #destinations = [];
  #offers = [];
  #onDataChange = null;
  #onCloseForm = null;
  #eventEditFormComponent = null;

  constructor({ destinationsModel, offersModel, onDataChange, onCloseForm }) {
    this.#destinations = destinationsModel;
    this.#offers = offersModel;
    this.#onDataChange = onDataChange;
    this.#onCloseForm = onCloseForm;
  }

  init() {
    const defaultType = EVENT_TYPES[5];
    const defaultOffers = this.#offers.find((offer) => offer.type === defaultType)?.offers || [];

    this.#eventEditFormComponent = new EventEditFormView({
      event: {
        type: defaultType,
        destination: null,
        dateFrom: new Date(),
        dateTo: new Date(),
        basePrice: 0,
        offers: defaultOffers,
      },
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#formSubmitHandler,
      onEditClick: this.#handleCloseFormClick,
    });


    render(this.#eventEditFormComponent, document.querySelector('.trip-events__list'), RenderPosition.AFTERBEGIN);
  }

  #formSubmitHandler = async (updatedEvent) => {
    try {
      await this.#onDataChange(UserAction.ADD_EVENT, UpdateType.MINOR, updatedEvent);
      this.#handleCloseFormClick(); // Закрываем форму после успешного сохранения
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding new event:', error);
    }
  };

  #handleCloseFormClick = () => {
    this.#onCloseForm();
    remove(this.#eventEditFormComponent);
    this.#eventEditFormComponent = null; // Очищаем ссылку, чтобы избежать багов
  };

  destroy() {
    if (this.#eventEditFormComponent) {
      remove(this.#eventEditFormComponent);
      this.#eventEditFormComponent = null;
    }
  }
}
