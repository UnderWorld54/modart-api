import { Request, Response } from 'express';
import { IProject } from '../types';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import Joi from 'joi';
import Project from '../models/Project';

export const projectSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().required(),
  externalUrl: Joi.string().uri().optional()
});

export class ProjectController {
  /**
   * @swagger
   * /api/projects:
   *   post:
   *     summary: Créer un nouveau projet
   *     tags: [Projects]
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
   *             properties:
   *               title:
   *                 type: string
   *                 maxLength: 100
   *                 description: Titre du projet
   *               description:
   *                 type: string
   *                 description: Description du projet
   *               externalUrl:
   *                 type: string
   *                 format: uri
   *                 description: Lien externe vers le projet (optionnel)
   *     responses:
   *       201:
   *         description: Projet créé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Project'
   *                 message:
   *                   type: string
   *                   example: Projet créé avec succès
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

  /**
   * @swagger
   * /api/projects:
   *   get:
   *     summary: Récupérer tous les projets
   *     tags: [Projects]
   *     responses:
   *       200:
   *         description: Liste de tous les projets
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
   *                     $ref: '#/components/schemas/Project'
   *       500:
   *         description: Erreur serveur
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
   */
  async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await Project.find().populate('createdBy', 'name email');
      res.status(200).json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
  }

  /**
   * @swagger
   * /api/projects/{id}:
   *   get:
   *     summary: Récupérer un projet par ID
   *     tags: [Projects]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du projet
   *     responses:
   *       200:
   *         description: Projet trouvé
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Project'
   *       404:
   *         description: Projet non trouvé
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
   *                   example: Projet non trouvé
   *       500:
   *         description: Erreur serveur
   */
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

  /**
   * @swagger
   * /api/projects/{id}:
   *   put:
   *     summary: Mettre à jour un projet (créateur ou admin uniquement)
   *     tags: [Projects]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du projet
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
   *                 description: Titre du projet
   *               description:
   *                 type: string
   *                 description: Description du projet
   *               externalUrl:
   *                 type: string
   *                 format: uri
   *                 description: Lien externe vers le projet
   *     responses:
   *       200:
   *         description: Projet mis à jour avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Project'
   *                 message:
   *                   type: string
   *                   example: Projet modifié avec succès
   *       400:
   *         description: Données invalides
   *       401:
   *         description: Non authentifié
   *       403:
   *         description: Accès refusé - Seul le créateur ou un admin peut modifier
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
   *                   example: Accès refusé
   *       404:
   *         description: Projet non trouvé
   */
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

  /**
   * @swagger
   * /api/projects/{id}:
   *   delete:
   *     summary: Supprimer un projet (créateur ou admin uniquement)
   *     tags: [Projects]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du projet
   *     responses:
   *       200:
   *         description: Projet supprimé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Projet supprimé avec succès
   *       400:
   *         description: Données invalides
   *       401:
   *         description: Non authentifié
   *       403:
   *         description: Accès refusé - Seul le créateur ou un admin peut supprimer
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
   *                   example: Accès refusé
   *       404:
   *         description: Projet non trouvé
   */
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