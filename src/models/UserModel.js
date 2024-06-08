// src/models/userModel.js
class User {
  constructor(username, email, fullname, phone, password, role, isFillSurvey) {
    this.username = username;
    this.email = email;
    this.fullname = fullname;
    this.phone = phone;
    this.password = password;
    this.role = role;
    this.isFillSurvey = isFillSurvey;
  }
}

module.exports = User;
