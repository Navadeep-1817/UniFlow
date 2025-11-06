// Notification controller stub

module.exports = {
  async sendNotification(req, res) {
    res.json({ message: 'sendNotification stub' });
  },

  async scheduleNotification(req, res) {
    res.json({ message: 'scheduleNotification stub' });
  }
};
