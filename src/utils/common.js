const makeCapitalized = (type) => type[0].toUpperCase() + type.slice(1, type.length);

function getRandomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export { makeCapitalized, getRandomString };
