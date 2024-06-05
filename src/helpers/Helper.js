const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_TOKEN, {
    expiresIn: "1h",
  });
  return token;
};

const generateRefreshToken = (payload) => {
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "1d",
  });
  return refreshToken;
};

const extractToken = (token) => {
  const secretKey = process.env.JWT_TOKEN;

  let resData = null;

  try {
    const decoded = jwt.verify(token, secretKey);
    resData = decoded;
  } catch (err) {
    resData = null;
  }

  if (resData) {
    const result = {
      username: resData.username,
      email: resData.email,
      role: resData.role,
    };
    return result;
  }
  return null;
};

module.exports = {
  generateToken,
  generateRefreshToken,
  extractToken,
};
