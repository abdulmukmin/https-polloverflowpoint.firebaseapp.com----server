const Helper = require('../helper/index')
const User = require('../models/user')

function checkAuthentication ( req, res, next ) {
    let decode = Helper.decodeJws( req.headers.jtoken )
    User.findById(decode.id)
    .then( user => {
        if ( user ) {
            req.myId = decode.id
            next()
        } else {
            res.status(500).json("error, please contact developer!")
        }  
    })
    .catch( err => {
        console.log(err)
        res.status(500).json( err.message )
    })  
}

module.exports = checkAuthentication