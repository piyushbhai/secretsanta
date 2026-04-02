const router = require('express').Router();
const ctrl = require('../controllers/employees');
const { csvUpload } = require('../middleware/upload');

router.post('/upload', csvUpload.single('file'), ctrl.uploadEmployees);
router.get('/', ctrl.getAll);

module.exports = router;