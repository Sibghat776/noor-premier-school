const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/admissionController');

router.post('/', c.admissionRules, c.submit);
router.get('/', auth, c.getAll);
router.put('/:id/status', auth, c.updateStatus);
router.delete('/:id', auth, c.remove);

module.exports = router;
