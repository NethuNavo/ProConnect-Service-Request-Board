const express = require('express');
const validator = require('validator');
const JobRequest = require('../models/JobRequest');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const validateStatus = (status) => ['Open', 'In Progress', 'Closed'].includes(status);

router.get('/', async (req, res, next) => {
  try {
    const { category, status, q } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

router.get('/categories', async (req, res, next) => {
  try {
    const categories = await JobRequest.distinct('category');
    const filtered = categories.filter((value) => value !== 'All').sort((a, b) => a.localeCompare(b));
    res.json(filtered);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job request not found' });
    }
    res.json(job);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    } = req.body;

    if (!title || !description || !category || !location || !contactName || !contactEmail) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    });
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const updates = Object.keys(req.body);

    if (updates.length !== 1 || !updates.includes('status')) {
      return res.status(400).json({ message: 'PATCH /api/jobs/:id only supports status updates' });
    }

    if (!status || !validateStatus(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job request not found' });
    }

    job.status = status;
    job.updatedAt = Date.now();

    await job.save();
    res.json(job);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const allowedUpdates = ['title', 'description', 'category', 'location', 'contactName', 'contactEmail', 'status'];
    const updates = Object.keys(req.body);
    const invalidFields = updates.filter((field) => !allowedUpdates.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({ message: `Invalid update field(s): ${invalidFields.join(', ')}` });
    }

    const {
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
      status,
    } = req.body;

    if (!title || !description || !category || !location || !contactName || !contactEmail) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (contactEmail && !validator.isEmail(contactEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (status && !validateStatus(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job request not found' });
    }

    updates.forEach((field) => {
      job[field] = req.body[field];
    });
    job.updatedAt = Date.now();

    await job.save();
    res.json(job);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job request not found' });
    }

    await job.remove();
    res.json({ message: 'Job request deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
