const express = require('express')
const router = express. Router();
const Bcrypt = require('bcryptjs')
const User = require('../database/models/user')
const jwt = require('jsonwebtoken')
const secret = require('../env/userauth.json')


 function tokengen(params = {}){
    return jwt.sign(params, secret.hash, {
        expiresIn: 86400
    });

}

router.post('/create', async (req, res) => {
    try {
        const { username , email, aboutme} = req.body;
        const passwd = await Bcrypt.hashSync(req.body.passwd, 10);
        if(!username || !passwd || !email) {
            res.status(400).json({ 'message': 'valid username, password and email required'});
        } else {
            const duplicateduser = await User.findOne({ nickname: username }).exec();
            const duplicatedemail = await User.findOne({ email: email }).exec();
            if(duplicateduser && duplicatedemail) {
                res.status(400).json({ 'message': 'invalid nickname or email'});
            } else {
                const user = await User.create({
                    username: username,
                    roles: 1,
                    password: passwd,
                    email: email,
                    aboutme: aboutme
                })
                return res.send({user, token: tokengen({id: user.id})});
            };
       }
    } catch (err) {
        res.status(500).json({ 'message': 'server issues'});
        console.log(err)
    }
});

router.post('/login', async (req, res) => {
    const {email , passwd} = req.body;
    if(!passwd || !email) 
        return res.status(400).json({ 'message': 'valid username, password and email required'});
    
    const user = await User.findOne({email}).select('+password');
    if(!user) 
        return res.status(400).json({ 'message': 'invalid email '});
    if(!await Bcrypt.compare(passwd, user.password))
        return res.status(400).json({ 'message': 'invalid password '});
    


    res.send({user, token: tokengen({id: user.id})});
});

module.exports = router