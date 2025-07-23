const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createJob,
  updateJob,
  deleteJob,
  getJobs,
  getJobById
} = require('../controllers/jobController');

const { protect, companyOnly } = require('../middleware/authMiddleware');


router.get('/', getJobs);


router.get('/:id', getJobById);


router.post(
  '/',
  protect,
  companyOnly,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('type').isIn(['Full-time', 'Part-time', 'Remote', 'Internship']).withMessage('Invalid type')
  ],
  createJob
);


router.put('/:id', protect, companyOnly, updateJob);

router.delete('/:id', protect, companyOnly, deleteJob);

module.exports = router;
