const router = require('express').Router();
const ctrl = require('../controllers/assignments');
const { csvUpload } = require('../middleware/upload');

router.post('/generate', csvUpload.single('previousFile'), ctrl.generate);

// separate routes instead of optional param
router.get('/download', ctrl.downloadCsv);
router.get('/download/:year', ctrl.downloadCsv);

router.get('/', ctrl.getByYear);
router.get('/:year', ctrl.getByYear);

module.exports = router;