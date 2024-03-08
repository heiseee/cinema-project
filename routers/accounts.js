const express = require('express');
const router = express.Router();
const User = require('../modules/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

router.post('/reg', function(req,res){
    let newUser = new user({
        name: req.body.name,
        email:req.body.email,
        login:req.body.login,
        password:req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err) res.json({success: false, msg: "Пользователь не добавлен"});
        else res.json({success: true, msg: "Пользователь добавлен"});
    })
})

router.post('/login', function(req,res){
    const login = req.body.login;
    const password = req.body.password;

    User.getUserByLogin(login, (err,user) => {
        if(err) throw err;
        if(!user)
            return res.json({success: false, msg: 'Пользователь не найден'});
        User.comparePass(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 3600*24
                });
                res.json({
                    success: true,
                    token: 'JWT'+token,
                    user:{
                        id: user._id,
                        name: user.name,
                        login: user.login,
                        email: user.email
                    }
                });
            }else
                return res.json({success: false, msg: 'Пароли не совпадают'});
        })
    });
})

router.get('/clientboard', passport.authenticate('jwt', {session: false}), function(req,res){
    res.send('Окно профиля');
})

module.exports = router;