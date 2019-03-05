const   mongoose = require('mongoose'),
        Schema = mongoose.Schema;

const answerSchema = new mongoose.Schema({
    QuestionId: {type:Schema.Types.ObjectId, ref: 'Question'},
    UserId: { type:Schema.Types.ObjectId, ref: 'User'},
    description: {type:String, required: true},
    upvote: [{ type:Schema.Types.ObjectId, ref: 'User'}],
    downvote: [{ type:Schema.Types.ObjectId, ref: 'User'}]
})

const Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer