const   Answer = require('../models/answer'),
        User = require('../models/user'),
        Question = require('../models/question');

class AnswerController {
    static create (req, res){
        let answer = new Answer({
            QuestionId: req.body.questionId,
            UserId: req.myId,
            description: req.body.description
        })
        answer.save( (err, data) => {
            if (err) {
                console.log(err)
                res.status(500).json( {error : err, message : "Something went wrong, please call developer!"} )
            } else {
                Question.findByIdAndUpdate({ _id : req.body.questionId}, {
                    $push: { QuestionId: data._id }     
                },{new: true})
                .then( questions => {
                    res.status(200).json( data )
                })
                .catch( error => {
                    console.log(error)
                    res.status(500).json( error.message )
                })
            }
        })
    }

    static readOne (req, res){
        Answer.findById(req.params.id)
        .then( answer => {
            res.status(200).json( answer )
        })
        .catch( error => {
            console.log(error)
            res.status(500).json( {error : error, message : "Something went wrong, please call developer!"} )
        })
    }


    static readOwn (req, res){
        Answer.find({ UserId : req.myId})
        .populate('QuestionId', 'title slug')
        .then( answers => {
            console.log(`masuk read all answer`)
            console.log(answers)
            res.status(200).json( answers )
        })
        .catch( error => {
            console.log(`error di read all question`)
            console.log(error)
            res.status(500).json( {error : error, message : "Something went wrong, please call developer!"} )
        })
    }

    static readAll (req, res){
        Answer.find()
            .populate('QuestionId')
            .then( answer => {
                console.log(`masuk read all answer`)
                console.log(answer)
                res.status(200).json( answer )
            })
            .catch( error => {
                console.log(`error di read all answer`)
                console.log(error)
                res.status(500).json( {error : error, message : "Something went wrong, please call developer!"} )
            })
    }

    static readRelated (req, res){
        Question.findOne({slug : req.params.slug})
            .then( question => {
                Answer.find({QuestionId: question._id})
                .populate({
                    path : 'UserId',
                    select : ['name'] 
                })
                .then(answerArr => {
                    res.status(200).json( answerArr )
                })
            })
            .catch( error => {
                console.log(`error di read all answer`)
                console.log(error)
                res.status(500).json( {error : error, message : "Something went wrong, please call developer!"} )
            })
    }

    static update (req, res){
        Answer.updateOne({ _id : req.params.id}, {
            description: req.body.description          
        })
        .then( answer => {
            Answer.find({ UserId : req.myId})
            .then( answers => {
                res.status(200).json( answers )
            })
            .catch( error => {
                console.log(`error di read all question`)
                console.log(error)
                res.status(500).json( {error : error, message : "Something went wrong, please call developer!"} )
            })
        })
        .catch( error => {
            console.log(`error di read all update`)
            console.log(error)
            res.status(500).json( {error : err, message : "Something went wrong, please call developer!"} )
        })
    }

    static upvote (req, res){
        //cari answernya
        Answer.findById(req.body.answerId)
            .then( resultAnswer => {
                //cek apakah answernya tesebut dibuat oleh user yang akan vote, jika iya, maka jangan berikan akses
                if (resultAnswer.UserId == req.myId){
                    res.status(500).json({"error":"can't vote for your own article or comment! "})
                } else {
                    //bila bukan, maka cek apakah sudah ada upvote dari user tersebut, kalo belum ada maka push ke upvote user tersebut
                    let upvoteArr = resultAnswer.upvote
                    if (upvoteArr.indexOf(req.myId) === -1 ){
                        resultAnswer.update({$push: {upvote: req.myId}, $pull: {downvote: req.myId}})
                            .then( result => {
                                Answer.find({QuestionId: resultAnswer.QuestionId})
                                .populate('UserId', 'name')
                                .then(answerArr => {
                                    res.status(200).json( answerArr )
                                })
                                .catch( error => {
                                    res.status(500).json({"error":"can't vote for your own article or comment! "})
                                })    
                            })
                            .catch( error => {
                                res.status(500).json({"error":"can't vote for your own article or comment! "})
                            })
                    }
                    //kalo sudah ada, maka hilangkan status upvote dari user tersebut
                    else{
                        resultAnswer.update({$pull: {upvote: req.myId}})
                            .then( result => {
                                Answer.find({QuestionId: resultAnswer.QuestionId})
                                .populate('UserId', 'name')
                                .then(answerArr => {
                                    res.status(200).json( answerArr )
                                })
                                .catch( error => {
                                    res.status(500).json({"error":"can't vote for your own article or comment! "})
                                })    
                            })
                            .catch( error => {
                                res.status(500).json({"error":"can't vote for your own article or comment! "})
                            })    
                    }
                }
            })
            .catch( error => {
                console.log(error)
                res.status(500).json({"error":"can't vote for your own article or comment! "})
            })
    }

    static downvote (req, res){
        //cari answernya
        Answer.findById(req.body.answerId)
            .then( result => {
                //cek apakah answernya tesebut dibuat oleh user yang akan vote, jika iya, maka jangan berikan akses
                if (result.UserId == req.myId){
                    res.status(500).json({"error":"can't vote for your own article or comment! "})
                } else {
                    //bila bukan, maka cek apakah sudah ada upvote dari user tersebut, kalo belum ada maka push ke upvote user tersebut
                    let downvote = result.downvote
                    if (downvote.indexOf(req.myId) === -1 ){
                        result.update({$push: {downvote: req.myId}, $pull: {upvote: req.myId}})
                            .then( resultUpdate => {
                                Answer.find({QuestionId: result.QuestionId})
                                .populate('UserId', 'name')
                                .then(answerArr => {
                                    res.status(200).json( answerArr )
                                })
                                .catch( error => {
                                    console.log(error)
                                    res.status(500).json({"error":"can't vote for your own article or comment! "})
                                })    
                            })
                            .catch( error => {
                                console.log(error)
                                res.status(500).json({"error":"can't vote for your own article or comment! "})
                            })
                    }
                    //kalo sudah ada, maka hilangkan status upvote dari user tersebut
                    else{
                        result.update({$pull: {downvote: req.myId}})
                            .then( resultUpdate => {
                                Answer.find({QuestionId: result.QuestionId})
                                .populate('UserId', 'name')
                                .then(answerArr => {                                   
                                    res.status(200).json( answerArr )
                                })
                                .catch( error => {
                                    console.log(error)
                                    res.status(500).json({"error":"can't vote for your own article or comment! "})
                                })
                            })
                            .catch( error => {
                                console.log(error)
                                res.status(500).json({"error":"can't vote for your own article or comment! "})
                            })    
                    }
                }
            })
            .catch( error => {
                console.log(error)
                res.status(500).json({"error":"can't vote for your own article or comment! "})
            })
    }
}

module.exports = AnswerController