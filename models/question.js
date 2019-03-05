const   mongoose = require('mongoose'),
        Schema = mongoose.Schema;

const questionSchema = new mongoose.Schema({
    UserId: { type:Schema.Types.ObjectId, ref: 'User'},
    title: {type:String, required: true},
    slug: {type:String, index: { unique: true } },
    description: {type:String, required: true},
    upvote: [{ type:Schema.Types.ObjectId, ref: 'User'}],
    downvote: [{ type:Schema.Types.ObjectId, ref: 'User'}],
    dateCreate: {type:Date},
    tags: [],
    AnswerId: [{ type:Schema.Types.ObjectId, ref: 'Answer'}]
})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question