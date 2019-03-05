const   Question = require('../models/question');

class tagController {
    static searchTag (req, res) {
        console.log(`-------------masuk search-------------`)
        console.log(req.params.tag)
        let tagTarget = req.params.tag
        Question
            .find({'tags.text' : tagTarget})
            .then( questions => {
                console.log(`----ini hasil search question`)
                console.log(questions)
                res.status(200).json(questions)
            })
            .catch( error => {
                console.log(error)
                res.status(500).json({
                    message : error.message
                })
            })
    }

    static readTag (req, res) {
        Question
            .find({}).distinct('tags.text')
            .then( tags => {
                console.log('ini adalah hasil :', tags)
                res.status(200).json( tags)
            })
            .catch( error => {
                res.status(500).json({
                    message : error.message
                })
            })
    }
}

module.exports = tagController;