const bcrypt = require("bcrypt");

module.exports.checkPassword = async (hash, password) => {
  const match = await bcrypt.compare(password, hash);
  if (match) {
    return true;
  }
  return false;
};
