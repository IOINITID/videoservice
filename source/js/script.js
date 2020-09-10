// Смена разделов страницы
const navigationElements = document.querySelectorAll(`.navigation__item`);
const filmsSection = document.querySelector(`.navigation__item--films`);
const channelsSection = document.querySelector(`.navigation__item--channels`);
const newsElement = document.querySelector(`.news`);
const genresElement = document.querySelector(`.genres`);
const channelsElement = document.querySelector(`.channels`);

/**
 * @description очищает активный класс для элементов.
 * @param {Element} elements коллекция элементов DOM.
 */
const clearActiveSection = (elements) => {
  elements.forEach((item) => {
    item.classList.remove(`navigation__item--active`);
  });
};

/**
 * @description устанавливает активный класс для элемента.
 * @param {Element} element элемент DOM.
 */
const selectActiveSection = (element) => {
  element.classList.add(`navigation__item--active`);
};

/**
 * @description обработчик события для секции фильмов.
 */
const filmsSectionClickHandler = (evt) => {
  evt.preventDefault();

  clearActiveSection(navigationElements);
  selectActiveSection(filmsSection);

  newsElement.style.display = `block`;
  genresElement.style.display = `block`;
  channelsElement.style.display = `none`;
};

/**
 * @description обработчик события для секции каналов.
 */
const channelsSectionClickHandler = (evt) => {
  evt.preventDefault();

  clearActiveSection(navigationElements);
  selectActiveSection(channelsSection);

  newsElement.style.display = `none`;
  genresElement.style.display = `none`;
  channelsElement.style.display = `block`;
};

filmsSection.addEventListener(`click`, filmsSectionClickHandler);
channelsSection.addEventListener(`click`, channelsSectionClickHandler);

// Работа модальных окон и авторизация через localStorage
const authorizationLogin = document.querySelector(`.authorization__login`);
const modal = document.querySelector(`.modal`);
const modalForm = document.querySelector(`.modal__form`);
const modalTitle = document.querySelector(`.modal__title`);
const overlay = document.querySelector(`.overlay`);
const modalButton = document.querySelector(`.modal__button`);
const loginInput = document.querySelector(`.modal__label--login .modal__input`);
const authorizationList = document.querySelector(`.authorization__list`);
const authorizationName = document.querySelector(`.authorization__name`);
const authorizationLogout = document.querySelector(`.authorization__logout`);
let isLogin = false;

/**
 * @description обработчик открытия модального окна.
 */
const loginClickHandler = (evt) => {
  evt.preventDefault();

  overlay.style.display = `block`;
  modal.style.display = `block`;
  document.body.style.overflow = `hidden`;
};

/**
 * @description обработчик закрытия модального окна.
 */
const closeModalHandler = (evt) => {
  evt.preventDefault();

  overlay.style.display = `none`;
  modal.style.display = `none`;
  modalTitle.textContent = `Вход`;
  document.body.style.overflow = `auto`;
};

/**
 * @description получает значение введенное в поле логин.
 */
const getLoginValue = () => {
  const loginInputValue = loginInput.value;

  return loginInputValue;
};

/**
 * @description показывает экран с авторизацией.
 */
const getLogin = (evt) => {
  evt.preventDefault();

  authorizationLogin.style.display = `none`;
  authorizationList.style.display = `flex`;

  closeModalHandler(evt);
};

/**
 * @description обработчик отправки формы входа.
 */
const modalButtonSubmitHandler = (evt) => {
  evt.preventDefault();

  authorizationName.textContent = getLoginValue();

  localStorage.setItem(`userName`, getLoginValue());
  localStorage.setItem(`isLogin`, `true`);

  getLogin(evt);
};

/**
 * @description обработчик нажатия на кнопку выйти.
 */
const logoutClickHandler = (evt) => {
  evt.preventDefault();

  authorizationLogin.style.display = `block`;
  authorizationList.style.display = `none`;
  isLogin = false;
  localStorage.setItem(`isLogin`, ``);

  closeModalHandler(evt);
};

/**
 * @description обработчик при загрузке страницы.
 */
const onDocumentLoading = (evt) => {
  isLogin = !!localStorage.getItem(`isLogin`);

  if (isLogin) {
    getLogin(evt);
    authorizationName.textContent = localStorage.getItem(`userName`);
  }
};

/**
 * @description обработчик нажатия на имя пользователя.
 */
const nameClickHandler = (evt) => {
  evt.preventDefault();

  loginClickHandler(evt);
  modalTitle.textContent = `Сменить имя`;
  loginInput.value = authorizationName.textContent;
};

authorizationLogin.addEventListener(`click`, loginClickHandler);
overlay.addEventListener(`click`, closeModalHandler);
modalForm.addEventListener(`submit`, modalButtonSubmitHandler);
authorizationLogout.addEventListener(`click`, logoutClickHandler);
document.addEventListener(`DOMContentLoaded`, onDocumentLoading);
authorizationName.addEventListener(`click`, nameClickHandler);
