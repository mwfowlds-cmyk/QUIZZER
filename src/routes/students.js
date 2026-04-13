const express = require('express');
const Student = require('../models/Student');
const { getStudentPerformance } = require('../services/questionSelector');

const router = express.Router();

/**
 * POST /students
 * Create a new student
 */
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required',
      });
    }

    const student = await Student.create(name, email);
    res.status(201).json(student);
  } catch (error) {
    if (error.message === 'Email already exists') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /students
 * Get all students
 */
router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /students/:id
 * Get student by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /students/:id/performance
 * Get student's performance metrics
 */
router.get('/:id/performance', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { quizId } = req.query;
    const performance = await getStudentPerformance(req.params.id, quizId);

    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /students/:id
 * Update student
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required',
      });
    }

    const student = await Student.update(req.params.id, name, email);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /students/:id
 * Delete student
 */
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.delete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;