const express = require('express')
const router = express. Router();
const Bcrypt = require('bcryptjs')
const User = require('../database/models/user')

router.post('/', async (req, res) => {
    try {
        const { username , email, aboutme} = req.body;
        const passwd = Bcrypt.hashSync(req.body.passwd, 10);
        if(!username || !passwd || !email) {
            res.status(400).json({ 'message': 'valid username, password and email required'});
        } else {
            const duplicateduser = await User.findOne({ nickname: username }).exec();
            const duplicatedemail = await User.findOne({ email: email }).exec();
            if(duplicateduser && duplicatedemail) {
                res.status(400).json({ 'message': 'invalid nickname or email'});
            } else {
                await User.create({
                    username: username,
                    roles: 1,
                    password: passwd,
                    email: email,
                    aboutme: aboutme
                }).then(res.json({data: 'user created', }));
            };
       }
    } catch (err) {
        res.status(500).json({ 'message': 'server issues'});
    }
});



router.get('/', async (req, res) => {
    const { username } = req.body
    const getuser = await User.findOne({username: username}).exec();
    try {
        if(getuser) {
            res.status(500).json({ 'message': 'Error trying to delete the user, please try again'});
        } else {
            res.json({ 'message': 'invalid User'})
        }
    } catch(err){
        console.log(err)
        res.status(500).json({ 'message': 'server issues'});
    }


});
    
router.post('/update?edit=username',async (req, res) => {
    try {
        const { email } = req.body
        const getuser = await User.findOne({email: email}).exec();
        if(!getuser) { 
            res.status(400).json({ 'message': 'Error trying delete the user, please try again'});
        } else {
            //edit here
        }
    } catch(err){
        res.status(500).json({ 'message': 'server issues'});
    }
}); 
router.delete('/', async (req, res) => {
    try {
        const { email } = req.body
        const getuser = await User.findOne({email: email}).exec();
        if(!getuser) { 
            res.status(400).json({ 'message': 'Error trying delete the user, please try again'});
        } else {
            
            await User.findOneAndDelete({email: email}).exec().then(res.json({ 'message': 'user deleted' }));
          
        }
    } catch(err){
        res.status(500).json({ 'message': 'server issues'});
    }

   
});


module.exports = router