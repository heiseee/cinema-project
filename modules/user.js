const mongoose = require('mongoose');
const bscrypt = require('bcryptjs');
const config = require('../config/db');

const userSchema = mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        required: true //обязательный ввод
    },
    login:{
        type: String,
        required: true //обязательный ввод
    },
    password:{
        type: String,
        required: true //обязательный ввод
    }
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserByLogin = function(login, callback){             //функция для поиска пользователя по логину
    const query = {login: login};
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){                //функция для поиска пользователя по id
    User.findById(id, callback);
};

module.exports.addUser = function(newUser, callback){             //функция для добавления пользователя
    bscrypt.genSalt(10, (err, salt) => {
        bscrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
             newUser.save(callback);
        });
    })
   
};

module.exports.comparePass = function(passFromUser, userDBPass, callback){
    bscrypt.compare(passFromUser, userDBPass, (err, isMatch => {
        if (err) throw err;
        callback(null, isMatch);
    }))
}