function getRandomBoolean() {
  return Math.random() < 0.5;
}

function getRandomNumber(maxNumber) {
  return Math.floor(Math.random() * maxNumber);
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomDate(start = new Date(), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function isEscape(evt) {
  return evt.key === 'Escape';
}

function getRandomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}


export { getRandomArrayElement, getRandomNumber, getRandomBoolean, getRandomDate, isEscape, getRandomString};
