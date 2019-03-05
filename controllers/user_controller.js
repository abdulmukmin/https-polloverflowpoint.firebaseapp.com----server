const   User = require('../models/user'),
        Helper = require('../helper/index'),
        jwt = require('jsonwebtoken'),
        mailer = require('../helper/mailer'),
        CronJob = require('cron').CronJob;


class UserController {

    static create ( req, res ) {
        let randomPassword = Math.random().toString(36).slice(-8);
        let user = new User ({
            name: req.body.name,
            email: req.body.email,
            password: randomPassword,
            role: req.body.role
        })
        user.save( (err, data) => {
            if (err) {
                console.log(err)
                res.status(500).json( error.message )
            } if ( data ) {
                
                let job = new CronJob(`* * * * * *`, function() {
                    console.log(`job start`)
                    let subject = `password poll get souliton anda`
                    let resultText = `password anda adalah ${randomPassword} , silahkan lakukan perubahan untuk keamanan akun anda`
                    mailer ( data.email, subject, resultText, (err ) => {
                        if ( err) res.send (err )
                    });

                    job.stop()
                    
                  }, function (){
                      console.log(`job done`)
                  }, true, 'Asia/Jakarta');
                  console.log(`sebelum job start`)
                  job.start()

                  res.status(200).json( data )
            }
        })
    }

    static signIn ( req, res ) {
        User.findOne({ name : req.body.name})
            .then( user => {
                if ( user !== null ){
                    let hash = Helper.encryp( req.body.password, user.salt)
                    if ( user.password === hash ){
                        let data = { id : user._id}
                        let jToken = jwt.sign( data, process.env.jSecret)
                        let message = "Success logged in!"
                        res.status(200).json( {jToken, message} )
                    } else {                     
                        res.status(500).json( "your username or password is incorrect" )  
                    }
                    
                } else {
                    res.status(500).json( "your username or password is incorrect" ) 
                }
            })
            .catch( err => {
                console.log(err)
                res.status(500).json( err.message )
            })
    }

    static updatePassword ( req, res ) {
        let pass = req.body.pass
        User.findOne({ _id : req.myId})
        .then( user => {
            let hash = Helper.encryp( pass.last, user.salt)
            if ( user.password === hash ){
                console.log(`lolos tes password`)
                user.password = pass.new
                user.save()
                    .then ( result => {
                        res.status(200).json( result )
                    })
                    .catch ( err => {
                        res.status(500).json( {error : err, message : "Something went wrong, please call developer!"} )
                    })
            }
            else {
                res.status(500).json( {error : err, message : "Something went wrong, please call developer!"} )
            }
        })
        .catch( err => {
            res.status(500).json( {error : err, message : "Something went wrong, please call developer!"} )
        })
    }


    static resetPassword ( req, res ) {
        let pass = req.body.pass
        User.findOne({ _id : req.myId})
        .then( user => {
            let randomPassword = Math.random().toString(36).slice(-8);          
                
            user.password = randomPassword
            user.save()
                .then ( result => {

                    let job = new CronJob(`* * * * * *`, function() {
                    console.log(`job start`)
                    let subject = `Password baru poll Overflowpoint anda`
                    let resultText = `password baru anda adalah ${randomPassword} , silahkan lakukan perubahan untuk keamanan akun anda`
                    mailer ( data.email, subject, resultText, (err ) => {
                        if ( err) res.send (err )
                    });
                        job.stop()
                     }, function (){
                        console.log(`job done`)
                     }, true, 'Asia/Jakarta');
                     console.log(`sebelum job start`)

                     job.start()
                     res.status(200).json( result )      
                })
                .catch ( err => {
                     res.status(500).json( {error : err, message : "Something went wrong, please call developer!"} )
                })            
            
        })
        .catch( err => {
            res.status(500).json( {error : err, message : "Something went wrong, please call developer!"} )
        })
    }
	
    static fSignIn ( req, res ) {
        let randomPassword = Math.random().toString(36).slice(-8);
        User.findOne({ email : req.body.email})
        .then( user => {
            if ( user !== null ){
                let data = { id : user._id}
                let jToken = jwt.sign( data, process.env.jSecret)
                let message = "Success logged in!"
                res.status(200).json( {jToken, message} )

            } 
            else {

                let user = new User ({
                    name: req.body.name,
                    email: req.body.email,
                    password: randomPassword
                })
                user.save( (err, data) => {
                    if (err) {
                        console.log( err )
                        res.status(500).json (err.message )
                    } if ( data ) {
                        let data = { id : user._id}
                        let jToken = jwt.sign( data, process.env.jSecret)
                        let message = "Success logged in!"
                        res.status(200).json( {jToken, message} )
                    }
                })
            }
        })
        .catch( err => {
            console.log(err)
            res.status(500).json( err.message )
        })

    }

    static gSignIn ( req, res ) {
        let randomPassword = Math.random().toString(36).slice(-8);
        User.findOne({ email : req.body.email})
        .then( user => {
            if ( user !== null ){
                let data = { id : user._id}
                let jToken = jwt.sign( data, process.env.jSecret)
                let message = "Success logged in!"
                res.status(200).json( {jToken, message} )

            } 
            else {

                let user = new User ({
                    name: req.body.name,
                    email: req.body.email,
                    password: randomPassword
                })
                user.save( (err, data) => {
                    if (err) {
                        console.log( err )
                        res.status(500).json (err.message )
                    } if ( data ) {
                        let data = { id : user._id}
                        let jToken = jwt.sign( data, process.env.jSecret)
                        let message = "Success logged in!"
                        res.status(200).json( {jToken, message} )
                    }
                })
            }
        })
        .catch( err => {
            console.log(err)
            res.status(500).json( err.message )
        })

    }

    static readOne ( req, res ) {
        User.findById(req.myId)
            .then( user => {
                console.log(user)
                res.status(200).json( user )
            })
            .catch( err => {
                console.log(err)
                res.status(500).json( {error : err, message : "your email address or password is incorrect"} )
            })
    }

    static readBestContributor ( req, res ) {
        User.find()
            .select(['name', 'popularity'])
            .sort({popularity: -1})
            .limit(5)
            .then( user => {
                console.log(user)
                res.status(200).json( user )
            })
            .catch( err => {
                console.log(err)
                res.status(500).json( {error : err, message : "your email address or password is incorrect"} )
            })
    }

}

module.exports = UserController
