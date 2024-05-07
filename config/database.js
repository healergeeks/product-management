const mongooes = require("mongoose");

module.exports.connect = async () => {
  try {
    await mongooes.connect(process.env.MONGO_URL);
    console.log("connect success");
  } catch (error) {
    console.log("connect error")
  }
}
