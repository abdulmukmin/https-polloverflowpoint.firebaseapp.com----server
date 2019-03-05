const   express = require('express'),
        router = express.Router(),
        QuestionController = require('../controllers/question_controller.js'),
        authorizaiton = require('../middlewares/authorization'),
        authentication = require('../middlewares/authentication');

router.get('/all', QuestionController.readAll );
router.get('/:slug', QuestionController.readDetailQuestions );
router.post('/', authentication, QuestionController.create );
router.put('/:id', authentication,  QuestionController.update );
router.get('/', authentication, QuestionController.readOwnQuestions);
router.delete('/:id', authentication, QuestionController.delete );
router.patch('/upvote', authentication, QuestionController.upvote );
router.patch('/downvote', authentication, QuestionController.downvote );

module.exports = router;
