// Authentication controller stub
// Exports: register, login, refreshToken, logout

module.exports = {
  async register(req, res) {
    // TODO: create user, hash password, issue token
    res.json({ message: 'register stub' });
  },

  async login(req, res) {
    // TODO: authenticate and issue JWT
    res.json({ message: 'login stub' });
  },

  async refreshToken(req, res) {
    // TODO: refresh JWT
    res.json({ message: 'refreshToken stub' });
  },

  async logout(req, res) {
    // TODO: invalidate refresh token or client-side logout
    res.json({ message: 'logout stub' });
  }
};
