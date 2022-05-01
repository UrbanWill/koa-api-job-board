const Koa = require("koa");
const bodyParser = require("koa-parser");
const db = require("./models");
const router = require("./routes");
const serve = require("koa-static");

const app = new Koa();
const PORT = 4000;
db.sequelize
  .sync()
  .then(() => console.log("models synced!"))
  .catch((err) => console.log(err));

app.context.db = db;
app.use(bodyParser());
app.use(serve(__dirname + "/public"));

app.use(router.routes());

app.listen(4000);
console.log(`Server is listening on port ${PORT}`);
