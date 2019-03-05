const   express = require('express'),
        router = express.Router(),
        TagController = require('../controllers/tag_controller');

router.get('/search/:tag', TagController.searchTag );
router.get('/readall', TagController.readTag );

module.exports = router;
