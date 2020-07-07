var express = require('express');
var app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();
const expressjwt = require('express-jwt');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const port = process.env.PORT;
const userPath = require('./User/router');


app.use(bodyParser.json({ limit: '160mb', extended: true }));
app.use(cors());
app.use(expressjwt({ secret: config.secret, algorithms: ['RS256'] }).unless({ path: config.publicRoutes }));
app.use('/user', userPath);

app.use(function (err, req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ message: 'Unauthorized' });
        return
    }
    next();
});

mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to mongo database: Connect+'))
    .catch(err => console.log(err));

// Start running the server
app.listen(port, function () {
    console.log(`Server listening on 'http://localhost:${port}'.`);
});

process.once('SIGUSR2', function () {
    server.close(function () {
        process.kill(process.pid, 'SIGUSR2')
    })
})

module.exports = {
    app
};