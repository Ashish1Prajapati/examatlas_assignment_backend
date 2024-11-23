const bcrypt = require('bcrypt')

function hashPassword(plainPassword) {
  const hashedPassword = bcrypt.hash(plainPassword, 10);
  return hashedPassword;
}
function comparePasswords(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  module.exports={
    hashPassword,
    comparePasswords
  }