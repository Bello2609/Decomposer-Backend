const config = require("./src/config");
const app = require("./index");
const connectDb = require("./src/api/db");

connectDb().then(() => {
  app.listen(config.PORT, () => {
    console.log(`Server started at ${config.PORT}`);
  });
});
// send me a mail to this address if you are the developer working on this project. 