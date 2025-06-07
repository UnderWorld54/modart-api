import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const eventController = new EventController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - start_date
 *         - end_date
 *         - location
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the event
 *         description:
 *           type: string
 *           description: Description of the event
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Start date of the event
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: End date of the event
 *         location:
 *           type: string
 *           description: Location of the event
 *         isActive:
 *           type: boolean
 *           description: Whether the event is active
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */

/**
 * @swagger
 * /api/events/active:
 *   get:
 *     summary: Get all active events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of active events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Event not found
 */

// Routes publiques (sans authentification)
router.get('/', eventController.getAllEvents);
router.get('/active', eventController.getActiveEvents);
router.get('/:id', eventController.getEventById);

// Routes protégées (avec authentification)
router.use(authenticate);

// Routes accessibles uniquement aux administrateurs
router.post('/', authorize('admin'), eventController.createEvent);
router.put('/:id', authorize('admin'), eventController.updateEvent);
router.delete('/:id', authorize('admin'), eventController.deleteEvent);

export default router; 