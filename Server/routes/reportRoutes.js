const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const  verifyToken = require('../middlewares/auth');
const { adminOnly } = require('../middlewares/roleCheck');

router.post('/', verifyToken, reportController.createReport);
router.get('/', verifyToken, adminOnly, reportController.getReports);
router.delete('/:id',verifyToken,adminOnly,reportController.deleteReport);

module.exports = router;