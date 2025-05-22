// routes/events.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const Event = require('../models/Event');

const router = express.Router();

// helper to return 400 on validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: CRUD operations on events
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: List all events (public)
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Array of event objects
 */
router.get('/', async (req, res) => {
  try {
    const list = await Event.find().sort({ startDate: 1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get a single event by ID (public)
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: The event object
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Event not found
 */
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid event ID'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const evt = await Event.findById(req.params.id);
      if (!evt) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json(evt);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ─── All routes below here require a valid JWT ─────────────────────
router.use(authenticate);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event (requires auth)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       200:
 *         description: The created event
 *       400:
 *         description: Validation errors
 */
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('startDate').isISO8601().withMessage('startDate must be a valid ISO date'),
    body('endDate').isISO8601().withMessage('endDate must be a valid ISO date'),
    body('location').notEmpty().withMessage('Location is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('ticketsAvailable')
      .isInt({ min: 0 })
      .withMessage('ticketsAvailable must be a non-negative integer'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const evt = new Event(req.body);
      const saved = await evt.save();
      res.json({ success: true, data: saved });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an existing event (requires auth)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       200:
 *         description: The updated event
 *       400:
 *         description: Validation errors
 *       404:
 *         description: Event not found
 */
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid event ID'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be positive'),
    body('startDate').optional().isISO8601().withMessage('Invalid startDate'),
    body('endDate').optional().isISO8601().withMessage('Invalid endDate'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    body('ticketsAvailable')
      .optional()
      .isInt({ min: 0 })
      .withMessage('ticketsAvailable must be a non-negative integer'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const updated = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event (requires auth)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Event not found
 */
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid event ID'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const deleted = await Event.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
