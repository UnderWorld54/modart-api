import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { IEvent } from '../types';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import Joi from 'joi';
import { validateBody } from '../middleware/validate';
import Project from '../models/Project';
import { IProject } from '../types';

export const eventSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().greater(Joi.ref('start_date')).required(),
  location: Joi.string().required(),
  isActive: Joi.boolean().optional()
});

export const projectSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().required(),
  externalUrl: Joi.string().uri().optional()
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

export class ProjectController {
  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const projectData: IProject = {
        ...req.body,
        createdBy: req.user?._id
      };
      const project = await Project.create(projectData);
      logger.info('Projet créé', { projectId: project._id, by: req.user?._id });
      res.status(201).json({ success: true, data: project, message: 'Projet créé avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la création d\'un projet', { error });
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
  }

  async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await Project.find().populate('createdBy', 'name email');
      res.status(200).json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
  }

  async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await Project.findById(id).populate('createdBy', 'name email');
      if (!project) {
        res.status(404).json({ success: false, error: 'Projet non trouvé' });
        return;
      }
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
  }

  async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json({ success: false, error: 'Projet non trouvé' });
        return;
      }
      // Seul le créateur ou un admin peut modifier
      if (req.user?.role !== 'admin' && String(project.createdBy) !== String(req.user?._id)) {
        res.status(403).json({ success: false, error: 'Accès refusé' });
        return;
      }
      Object.assign(project, req.body);
      await project.save();
      logger.info('Projet modifié', { projectId: project._id, by: req.user?._id });
      res.status(200).json({ success: true, data: project, message: 'Projet modifié avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la modification d\'un projet', { error });
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json({ success: false, error: 'Projet non trouvé' });
        return;
      }
      // Seul le créateur ou un admin peut supprimer
      if (req.user?.role !== 'admin' && String(project.createdBy) !== String(req.user?._id)) {
        res.status(403).json({ success: false, error: 'Accès refusé' });
        return;
      }
      await project.deleteOne();
      logger.info('Projet supprimé', { projectId: project._id, by: req.user?._id });
      res.status(200).json({ success: true, message: 'Projet supprimé avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la suppression d\'un projet', { error });
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
  }
} 