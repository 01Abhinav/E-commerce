const path = require("path");
const sequelize = require("./utils/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const express = require("express");
const bodyParser = require("body-parser");

const db = require("./utils/database");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoute = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user; //we can define a new attribute here "user" in req object
      //"user" will be stored in every req
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoute);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); // CASCADE means if any user id deleted, product related to user is also deleted
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User); //this is optional as above is sufficient

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  //.sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
    //console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "abhinav", email: "abhinav.zimmy@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    console.log(user);
    return user.createCart();
    app.listen(3000);
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
