const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        //this user will be sequiliser object and not a javascript object
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});

// db.execute('SELECT * FROM products')
//     .then(result => {
//         console.log(result[0], result[1]);
//     })
//     .catch(err => {
//         console.log(err);
//     });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

//sync models to databases and creates tables if necessary
// force: true in sync will delete all tables before making it again
sequelize
    .sync()
    .then(result => {
        // All this to ensure that atleast 1 user is available in user table
        return User.findByPk(1);
    })
    .then(user => {
        if (!user){
            return User.create({name: 'KD', email: "kd@kd.com"});
        }
        return user;
    })
    .then(user => {
      // console.log(user);
      return user.createCart();
    })
    .then(user => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
