// Custom validators

module.exports = {
  isEmail(value) {
    return typeof value === 'string' && /@/.test(value);
  }
};
