const   Question = require('../models/question'),
        User = require('../models/user');

class QuestionController {
    static create ( req, res ){
        let question = new Question({
            UserId: req.myId,
            title: req.body.title,
            description: req.body.description,
            slug: req.body.slug,
            dateCreate: new Date(),
            tags: req.body.tags
        })
        question.save( (err, data) => {
            if (err) {
                console.log(err)
                res.status(500).json( err.message )
            } else {
                Question.find({ UserId : req.myId})
                .then( questions => {
                    res.status(200).json( questions )
                })
                .catch( error => {
                    console.log(`error di read all question`)
                    console.log(error)
                    res.status(500).json( error.message )
                })
            }
        })
    }

    static readAll (req, res){
        Question.find()
            .populate('UserId', 'name')
            .sort({dateCreate: -1})
            .then( questions => {
                res.status(200).json( questions )
            })
            .catch( error => {
                console.log(error)
                res.status(500).json( error.message )
            })
    }

    static readOwnQuestions (req, res){
        Question.find({ UserId : req.myId})
        .populate('UserId')
        .then( questions => {
            res.status(200).json( questions )
        })
        .catch( error => {
            console.log(error)
            res.status(500).json( error.message )
        })
    }

    static readDetailQuestions (req, res){
        Question.findOne({ slug : req.params.slug})
        .populate({
            path: 'UserId',
            select: 'name'
        })
        .then( questions => {
            res.status(200).json( questions )
        })
        .catch( error => {
            console.log(error)
            res.status(500).json( error.message )
        })
    }

    static update (req, res){
        Question.findByIdAndUpdate({ _id : req.params.id}, {
            title: req.body.title,
            description: req.body.description,
            slug: req.body.slug,
            tags: req.body.tags        
        },{new: true})
        .then( questions => {
            Question.find({ UserId : req.myId})
            .then( questions => {
                res.status(200).json( questions )
            })
            .catch( error => {
                console.log(error)
                res.status(500).json( error.message )
            })
        })
        .catch( error => {
            console.log(error)
            res.status(500).json( error.message )
        })
    }

    static delete (req, res){
        Question.findByIdAndDelete(req.params.id)
        .then( questions => {
            Question.find({ UserId : req.myId})
            .then( questions => {
                res.status(200).json( questions )
            })
            .catch( error => {
                console.log(`error di read all question`)
                console.log(error)
                res.status(500).json( error.message )
            })
        })
        .catch( error => {
            console.log(`error delete question`)
            console.log(error)
            res.status(500).json( error.message )
        })
    }

    static upvote (req, res){
        //cari questionnya
        Question.findById(req.body.questionId)
            .then( result => {
                //cek apakah question tesebut dibuat oleh user yang akan vote, jika iya, maka jangan berikan akses
                if (result.UserId == req.myId){
                    res.status(500).json("can't vote for your own article or comment! ")
                } else {
                    //bila bukan, maka cek apakah sudah ada upvote dari user tersebut, kalo belum ada maka push ke upvote user tersebut
                    let upvoteArr = result.upvote
		    let downvoteArr = result.downvote
                    if (upvoteArr.indexOf(req.myId) === -1 && downvoteArr.indexOf(req.myId) === -1){
                        result.update({$push: {upvote: req.myId}, $pull: {downvote: req.myId}})
                            .then( resultUpdate => {

                                //cari user yang punya artikel
                                User.findById(result.UserId)
                                .then( user => {
                                    user.popularity +=1
                                    user.save(function (error) {

                                        if(error) {
                                            console.log(error)
                                            res.status(500).json(error.message)
                                        } else {
                                            Question.find()
                                            .populate('UserId', 'name')
                                            .sort({dateCreate: -1})
                                            .then( questions => {
                                                res.status(200).json( questions )
                                            })
                                            .catch( error => {
                                                console.log(error)
                                                res.status(500).json(error.message)
                                            })
                                        }
                                    });
                                })
                                .catch( error => {
                                    console.log(error)
                                    res.status(500).json(error.message)
                                })
                            })
                            .catch( error => {
                                res.status(500).json( error.message )
                            })
                    }
                    else if (downvoteArr.indexOf(req.myId) !== -1 && upvoteArr.indexOf(req.myId) === -1){
                        result.update({$push: {upvote: req.myId}, $pull: {downvote: req.myId}})
                            .then( resultUpdate => {

                                //cari user yang punya artikel
                                User.findById(result.UserId)
                                .then( user => {
				    let lastPopularity = user.popularity
				    lastPopularity += 2
                                    user.popularity = lastPopularity
                                    user.save(function (error) {

                                        if(error) {
                                            console.log(error)
                                            res.status(500).json(error.message)
                                        } else {
                                            Question.find()
                                            .populate('UserId', 'name')
                                            .sort({dateCreate: -1})
                                            .then( questions => {
                                                res.status(200).json( questions )
                                            })
                                            .catch( error => {
                                                console.log(error)
                                                res.status(500).json(error.message)
                                            })
                                        }
                                    });
                                })
                                .catch( error => {
                                    console.log(error)
                                    res.status(500).json(error.message)
                                })
                            })
                            .catch( error => {
                                res.status(500).json( error.message )
                            })
                    }
                    //kalo sudah ada, maka hilangkan status upvote dari user tersebut
                    else{
                        result.update({$pull: {upvote: req.myId}})
                            .then( resultUpdate => {

                                //cari user yang punya artikel
                                User.findById(result.UserId)
                                .then( user => {
                                    user.popularity -=1
                                    user.save(function (error) {

                                        if(error) {
                                            console.log(error)
                                            res.status(500).json(error.message)
                                        } else {
                                            Question.find()
                                            .populate('UserId', 'name')
                                            .sort({dateCreate: -1})
                                            .then( questions => {
                                                res.status(200).json( questions )
                                            })
                                            .catch( error => {
                                                console.log(error)
                                                res.status(500).json(error.message)
                                            })
                                        }
                                    });
                                })
                                .catch( error => {
                                    console.log(error)
                                    res.status(500).json(error.message)
                                })
                            })
                            .catch( error => {
                                res.status(500).json( error.message )
                            })    
                    }
                }
            })
            .catch( error => {
                console.log(error)
                res.status(500).json( error.message )
            })
    }

    static downvote (req, res){
        //cari questionnya
        Question.findById(req.body.questionId)
            .then( result => {
                //cek apakah question tesebut dibuat oleh user yang akan vote, jika iya, maka jangan berikan akses
                if (result.UserId == req.myId){
                    res.status(500).json( "You can't vote your own question!" )
                } else {
                    //bila bukan, maka cek apakah sudah ada upvote dari user tersebut, kalo belum ada maka push ke upvote user tersebut
                    let downvoteArr = result.downvote
		    let upvoteArr = result.upvote
                    if (downvoteArr.indexOf(req.myId) === -1 && upvoteArr.indexOf(req.myId ) === -1) {
                        result.update({$push: {downvote: req.myId}, $pull: {upvote: req.myId}})
                            .then( resultUpdate => {

                                //cari user yang punya artikel
                                User.findById(result.UserId)
                                .then( user => {
                                    user.popularity -=1
                                    user.save(function (error) {

                                        if(error) {
                                            console.log(error)
                                            res.status(500).json(error.message)
                                        } else {
                                            Question.find()
                                            .populate('UserId', 'name')
                                            .sort({dateCreate: -1})
                                            .then( questions => {
                                                res.status(200).json( questions )
                                            })
                                            .catch( error => {
                                                console.log(error)
                                                res.status(500).json(error.message)
                                            })
                                        }
                                    });
                                })
                                .catch( error => {
                                    console.log(error)
                                    res.status(500).json(error.message)
                                })
                            })
                            .catch( error => {
                                res.status(500).json( error.message )
                            })
                    }
                    else if (upvoteArr.indexOf(req.myId) !== -1 && downvoteArr.indexOf(req.myId) === -1){
                        result.update({$push: {downvote: req.myId}, $pull: {upvote: req.myId}})
                            .then( resultUpdate => {

                                //cari user yang punya artikel
                                User.findById(result.UserId)
                                .then( user => {
				    let lastPopularity = user.popularity
				    lastPopularity -= 2                          
                                    user.save(function (error) {

                                        if(error) {
                                            console.log(error)
                                            res.status(500).json(error.message)
                                        } else {
                                            Question.find()
                                            .populate('UserId', 'name')
                                            .sort({dateCreate: -1})
                                            .then( questions => {
                                                res.status(200).json( questions )
                                            })
                                            .catch( error => {
                                                console.log(error)
                                                res.status(500).json(error.message)
                                            })
                                        }
                                    });
                                })
                                .catch( error => {
                                    console.log(error)
                                    res.status(500).json(error.message)
                                })
                            })
                            .catch( error => {
                                res.status(500).json( error.message )
                            })
                    }			
                    //kalo sudah ada, maka hilangkan status downvote dari user tersebut
                    else{
                        result.update({$pull: {downvote: req.myId}})
                            .then( resultUpdate => {

                                //cari user yang punya artikel
                                User.findById(result.UserId)
                                .then( user => {
                                    user.popularity +=1
                                    user.save(function (error) {

                                        if(error) {
                                            console.log(error)
                                            res.status(500).json(error.message)
                                        } else {
                                            Question.find()
                                            .populate('UserId', 'name')
                                            .sort({dateCreate: -1})
                                            .then( questions => {
                                                res.status(200).json( questions )
                                            })
                                            .catch( error => {
                                                console.log(error)
                                                res.status(500).json(error.message)
                                            })
                                        }
                                    });

                                })
                                .catch( error => {
                                    console.log(error)
                                    res.status(500).json(error.message)
                                })
                            })
                            .catch( error => {
                                res.status(500).json( error.message )
                            })    
                    }
                }
            })
            .catch( error => {
                console.log(error)
                res.status(500).json( error.message )
            })
    }
}

module.exports = QuestionController
