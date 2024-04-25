const mongoose = require("mongoose");
async function connectMongoDb(url) {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("Mongo-DB Connected");
    })
    .catch((err) => {
      console.log("Mongo Connection error : ", err);
    });
}

module.exports = {
  connectMongoDb,
};
