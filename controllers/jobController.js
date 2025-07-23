const Job = require('../models/jobModel');
const { validationResult } = require('express-validator');

// إنشاء وظيفة
exports.createJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const job = await Job.create({ ...req.body, company: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// تعديل وظيفة
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.company.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to edit this job' });

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// حذف وظيفة
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.company.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this job' });

    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// عرض كل الوظائف (مع pagination و filter)
exports.getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, location, title, type } = req.query;
    const filters = {};

    if (location) filters.location = { $regex: location, $options: 'i' };
    if (title) filters.title = { $regex: title, $options: 'i' };
    if (type) filters.type = type;

    const jobs = await Job.find(filters)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
