import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, function (err, salt) {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

export const comparePassword = async (password, hashed) => {
    console.log("password", password)
    console.log("hashed", hashed)
  return await bcrypt.compare(password, hashed);
};
