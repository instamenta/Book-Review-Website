const express = require('express');
const app = express();
const routes = require('./routes');
const { authenticate } = require('./middlewares/authMid');
const { connectDb } = require('./config/db');

const cookieParser = require('cookie-parser');

require('./config/hbs')(app);

app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('public'));
app.use(cookieParser());
app.use(authenticate);
app.use(routes);

try {
    connectDb();

    app.listen(3000, () => console.log('Server running on port 3000...'));
} catch (error) {
    console.log(error);
}