const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const config = require('./config/db');
const account = require('./routers/accounts');


const app = express();

const port = 3000;

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(config.db);

mongoose.connection.on("connected", () => {
    console.log('Connect comlete');
})

mongoose.connection.on("error", (err)=>{
    console.log('Connect error!!!' + err);
})

app.get('/', function(req, res){
    res.send('<h1>privet</h1>');
})

app.use('/account', account);

app.listen(port, () => {
    console.log('server activated on port:' + port);
})