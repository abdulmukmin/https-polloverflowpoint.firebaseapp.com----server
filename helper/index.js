const crypto = require('crypto')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class Helper {
    static encryp ( pass, salt ) {
        let hash = crypto.createHmac('sha256', salt)
                .update( pass )
                .digest( 'hex' )
        return hash
    }

    static decodeJws ( jToken ) {
        let check = jwt.verify( jToken, process.env.jSecret )
        return check
    }
}


module.exports = Helper
