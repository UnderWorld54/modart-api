import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { IEvent } from '../types';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import Joi from 'joi';

export const eventSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().greater(Joi.ref('start_date')).required(),
  location: Joi.string().required(),
  isActive: Joi.boolean().optional()
});

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  /**
   * @swagger
   * /api/events:
   *   post:
   *     summary: Créer un nouvel événement
   *     tags: [Events]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - description
   *               - start_date
   *               - end_date
   *               - location
   *             properties:
   *               title:
   *                 type: string
   *                 maxLength: 100
   *                 description: Titre de l'événement
   *               description:
   *                 type: string
   *                 description: Description de l'événement
   *               start_date:
   *                 type: string
   *                 format: date-time
   *                 description: Date et heure de début de l'événement
   *               end_date:
   *                 type: string
   *                 format: date-time
   *                 description: Date et heure de fin de l'événement
   *               location:
   *                 type: string
   *                 description: Lieu de l'événement
   *               isActive:
   *                 type: boolean
   *                 description: Statut actif de l'événement
   *     responses:
   *       201:
   *         description: Événement créé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Event'
   *                 message:
   *                   type: string
   *                   example: Event created successfully
   *       400:
   *         description: Données invalides
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *       401:
   *         description: Non authentifié
   */
  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventData: IEvent = {
        ...req.body,
        createdBy: req.user?._id,
        updatedBy: req.user?._id
      };
      
      const event = await this.eventService.createEvent(eventData);
      
      const response: ApiResponse<IEvent> = {
        success: true,
        data: event,
        message: 'Event created successfully'
      };
      
      logger.info('Événement créé', { eventId: event._id, title: event.title, by: req.user?._id });
      res.status(201).json(response);
    } catch (error) {
      logger.error('Erreur lors de la création d\'un événement', { error });
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(400).json(response);
    }
  };

  /**
   * @swagger
   * /api/events:
   *   get:
   *     summary: Récupérer tous les événements
   *     tags: [Events]
   *     responses:
   *       200:
   *         description: Liste de tous les événements
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Event'
   *                 message:
   *                   type: string
   *                   example: Retrieved 5 events
   *       500:
   *         description: Erreur serveur
   */
  getAllEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const events = await this.eventService.getAllEvents();
      
      const response: ApiResponse<IEvent[]> = {
        success: true,
        data: events,
        message: `Retrieved ${events.length} events`
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  /**
   * @swagger
   * /api/events/{id}:
   *   get:
   *     summary: Récupérer un événement par ID
   *     tags: [Events]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de l'événement
   *     responses:
   *       200:
   *         description: Événement trouvé
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Event'
   *                 message:
   *                   type: string
   *                   example: Event retrieved successfully
   *       404:
   *         description: Événement non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: Event not found
   *       500:
   *         description: Erreur serveur
   */
  getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const event = await this.eventService.getEventById(id);
      
      if (!event) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Event not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse<IEvent> = {
        success: true,
        data: event,
        message: 'Event retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  /**
   * @swagger
   * /api/events/{id}:
   *   put:
   *     summary: Mettre à jour un événement
   *     tags: [Events]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de l'événement
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 maxLength: 100
   *                 description: Titre de l'événement
   *               description:
   *                 type: string
   *                 description: Description de l'événement
   *               start_date:
   *                 type: string
   *                 format: date-time
   *                 description: Date et heure de début de l'événement
   *               end_date:
   *                 type: string
   *                 format: date-time
   *                 description: Date et heure de fin de l'événement
   *               location:
   *                 type: string
   *                 description: Lieu de l'événement
   *               isActive:
   *                 type: boolean
   *                 description: Statut actif de l'événement
   *     responses:
   *       200:
   *         description: Événement mis à jour avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Event'
   *                 message:
   *                   type: string
   *                   example: Event updated successfully
   *       400:
   *         description: Données invalides
   *       404:
   *         description: Événement non trouvé
   *       401:
   *         description: Non authentifié
   */
  updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const eventData: Partial<IEvent> = {
        ...req.body,
        updatedBy: req.user?._id
      };
      
      const event = await this.eventService.updateEvent(id, eventData);
      
      if (!event) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Event not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse<IEvent> = {
        success: true,
        data: event,
        message: 'Event updated successfully'
      };
      
      logger.info('Événement modifié', { eventId: event?._id, by: req.user?._id });
      res.status(200).json(response);
    } catch (error) {
      logger.error('Erreur lors de la modification d\'un événement', { error });
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(400).json(response);
    }
  };

  /**
   * @swagger
   * /api/events/{id}:
   *   delete:
   *     summary: Supprimer un événement
   *     tags: [Events]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de l'événement
   *     responses:
   *       200:
   *         description: Événement supprimé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Event'
   *                 message:
   *                   type: string
   *                   example: Event deleted successfully
   *       404:
   *         description: Événement non trouvé
   *       401:
   *         description: Non authentifié
   *       500:
   *         description: Erreur serveur
   */
  deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const event = await this.eventService.deleteEvent(id);
      
      if (!event) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Event not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse<IEvent> = {
        success: true,
        data: event,
        message: 'Event deleted successfully'
      };
      
      logger.info('Événement supprimé', { eventId: event?._id, by: req.user?._id });
      res.status(200).json(response);
    } catch (error) {
      logger.error('Erreur lors de la suppression d\'un événement', { error });
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  /**
   * @swagger
   * /api/events/active:
   *   get:
   *     summary: Récupérer tous les événements actifs
   *     tags: [Events]
   *     responses:
   *       200:
   *         description: Liste des événements actifs
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Event'
   *                 message:
   *                   type: string
   *                   example: Retrieved 3 active events
   *       500:
   *         description: Erreur serveur
   */
  getActiveEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const events = await this.eventService.getActiveEvents();
      
      const response: ApiResponse<IEvent[]> = {
        success: true,
        data: events,
        message: `Retrieved ${events.length} active events`
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };
} 