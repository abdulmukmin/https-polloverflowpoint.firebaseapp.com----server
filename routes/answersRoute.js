const   express = require('express'),
        router = express.Router(),
        AnswerController = require('../controllers/answer_controller'),
        authorizaiton = require('../middlewares/authorization'),
        authentication = require('../middlewares/authentication');

/* GET users listing. */

router.get('/related/:slug', AnswerController.readRelated );
router.post('/', authentication, AnswerController.create );
router.put('/:id', authentication, AnswerController.update );
router.get('/', authentication, AnswerController.readOwn );
router.get('/:id', authentication, AnswerController.readOne );
router.get('/all', AnswerController.readAll );
router.patch('/upvote', authentication, AnswerController.upvote );
router.patch('/downvote', authentication, AnswerController.downvote );

module.exports = router;
