const jwt = require("jsonwebtoken");
require('dotenv').config()

async function signUser(user) {
  let res = await jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: "2days"})
  return res;
}

async function verifyUser(token) {
  const user = await jwt.verify(token, process.env.SECRET_KEY);

  return user;
}

module.exports = {
  signUser,
  verifyUser,
};