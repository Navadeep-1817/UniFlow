// Date formatting utilities

module.exports = {
  formatDate(date) {
    if (!date) return null;
    return new Date(date).toISOString();
  }
};
