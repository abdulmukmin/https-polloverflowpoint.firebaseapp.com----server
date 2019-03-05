const   express = require('express'),
        router = express.Router(),
        UserController = require('../controllers/user_controller'),
        authorizaiton = require('../middlewares/authorization'),
        authentication = require('../middlewares/authentication');

router.post('/gSignIn', UserController.gSignIn );
router.post('/fSignIn', UserController.fSignIn );
router.post('/signin', UserController.signIn );
router.get('/best', UserController.readBestContributor );
router.get('/', authentication, UserController.readOne );
router.post('/', UserController.create );
router.patch('/', authentication, UserController.updatePassword );

module.exports = router;
