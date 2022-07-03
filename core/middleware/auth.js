const jwt = require('jsonwebtoken');
const secret = require('../env/userauth.json')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader) 
        return res.status(401).send({ message: 'No Token provided'})
    
    const parts = authHeader.split(' ');
    
    if(!parts.lengrh === 2)
        return res.status(401).send({ message: 'invalid Token'})
    
    const [ init, token ] = parts;

    if(!/^Bearer$/i.test(init)) 
        return res.status(401).send({ message: 'invalid Token'})

    jwt.verify(token, secret.hash, (err, decoded) => {
        if(err)
            return res.status(401).send({ message: 'invalid Token'})
        
        req.userId = decoded.id;
        return next();
    })
}