class UserInfo {
  constructor(user) {
    this.fill(user);
  }

  fill(user) {
    Object.entries(user).forEach(item => this[item[0]] = item[1]);
    delete this.token;
    delete this.password;
  }
}

class UserSafe {
  constructor(user) {
    this.fill(user);
  }

  fill(user) {
    Object.entries(user).forEach(item => this[item[0]] = item[1]);
    delete this.id;
    delete this.token;
    delete this.password;
    delete this.createdAt;
    delete this.updatedAt;
    delete this.notified;
  }
}

module.exports = {
  UserInfo,
  UserSafe
};