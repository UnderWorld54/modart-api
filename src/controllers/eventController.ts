import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { IEvent } from '../types';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import Joi from 'joi';
import { validateBody } from '../middleware/validate';

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