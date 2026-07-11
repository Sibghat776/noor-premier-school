const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/noticeController');

router.get('/', c.getAll);
router.post('/', auth, c.create);
router.put('/:id', auth, c.update);
router.delete('/:id', auth, c.remove);

module.exports = router;
