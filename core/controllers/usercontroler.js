const express = require('express')
const Bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../modules/mailer')
const User = require('../database/models/user')
const secret = require('../json/userauth.json')


const router = express.Router();



function tokengen(params = {}){
    return jwt.sign(params, secret.hash, {
        expiresIn: 86400
    });

}

router.post('/create', async (req, res) => {
    try {
        const { username , email, aboutme, passwd} = req.body;
        if(!username || !passwd || !email) {
            res.status(400).json({ 'message': 'valid username, password and email required'});
        } else {
            const duplicateduser = await User.findOne({ username: username }).exec();
            const duplicatedemail = await User.findOne({ email: email }).exec();
            if(duplicateduser || duplicatedemail) 
                return res.status(400).json({ 'message': 'invalid nickname or email'});
            const user = await User.create({
                username: username,
                roles: 1,
                password: passwd,
                email: email,
                aboutme: aboutme
            })
                return res.send({user, token: tokengen({id: user.id})});
       }
    } catch (err) {
        res.status(500).json({ 'message': 'server issues'});
        console.log(err)
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email , passwd} = req.body;
        if(!passwd || !email) 
            return res.status(400).json({ 'message': 'valid username, password and email required'});
        
        const user = await User.findOne({email}).select('+password');
        if(!user) 
            return res.status(400).json({ 'message': 'invalid email '});
        if(!await Bcrypt.compare(passwd, user.password))
            return res.status(400).json({ 'message': 'invalid password '});
        
    
    
        res.send({user, token: tokengen({id: user.id})});
    } catch (err) {
        res.status(500).json({ 'message': 'server issues'});
        console.log(err)
    }

});

router.post('/passwordrecovery', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({email}).select('+password');

        if(!user)
            return res.status(400).json({ 'message': 'user not found'}); 

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                PasswordToken: token,
                PasswordTExpires: now,
            }
        });
        mailer.sendMail({
            to: email,
            from: 'recovery@galactical.club',
            template: 'templates/forgot_password',
            context: {token}
        }, (err) => {
            if(err)
                return res.status(500).json({ 'message': 'server issues'});

            res.send();
        })

    } catch (err) {
        res.status(500).json({ 'message': 'server issues'});
        console.log(err)
    }
})

router.post('/changepassword', async (req, res) => {

    try{
        const {email , token, passwd} = req.body;

        const user = await User.findOne({email}).select('+PasswordToken PasswordTExpires');

        if(!user) 
            return res.status(400).json({ 'message': 'invalid email '});
        if(token !== user.PasswordToken)
            return res.status(400).json({ 'message': 'invalid Token '});
        
        const now = new Date();

        if(now > user.PasswordTExpires)
            return res.status(400).json({ 'message': 'Token expired'});
        
        
        user.password = passwd
        user.PasswordToken = null

        await user.save()


        res.status(200).json({ 'message': 'password reseted'});

    } catch(err) {
        res.status(500).json({ 'message': 'server issues'});
        console.log(err)
    }
})


module.exports = app => app.use('/user', router)