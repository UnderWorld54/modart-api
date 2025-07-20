import { Request, Response } from 'express';
import User from '../models/User';
import { EmailService } from '../services/emailService';
import { logger } from '../utils/logger';
import crypto from 'crypto';

interface StudentData {
  firstName: string;
  lastName: string;
  email: string;
}

interface StudentCreationResult {
  student: StudentData;
  success: boolean;
  userId?: string;
  error?: string;
  emailSent?: boolean;
  emailError?: string;
}

export class StudentController {
  /**
   * Génère un mot de passe temporaire sécurisé
   */
  private static generateTemporaryPassword(): string {
    const adjectives = ['Smart', 'Bright', 'Creative', 'Art', 'Design', 'Mod'];
    const year = new Date().getFullYear();
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNumbers = Math.floor(Math.random() * 99) + 10;
    const specialChars = '!@#$%^&*';
    const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];
    const randomLetters = crypto.randomBytes(2).toString('hex').toUpperCase().substring(0, 2);
    
    return `${randomAdjective}${year}${randomSpecial}${randomLetters}${randomNumbers}`;
  }

  /**
   * Valide les données d'un étudiant
   */
  private static validateStudentData(student: any): string | null {
    if (!student.firstName || typeof student.firstName !== 'string' || student.firstName.trim().length < 2) {
      return 'Le prénom doit contenir au moins 2 caractères';
    }
    
    if (!student.lastName || typeof student.lastName !== 'string' || student.lastName.trim().length < 2) {
      return 'Le nom doit contenir au moins 2 caractères';
    }
    
    if (!student.email || typeof student.email !== 'string') {
      return 'L\'email est requis';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student.email)) {
      return 'Format d\'email invalide';
    }
    
    return null;
  }

  /**
   * Crée des comptes étudiants en lot
   */
  static async batchCreateStudents(req: Request, res: Response): Promise<void> {
    try {
      const { students } = req.body;

      // Validation de base
      if (!Array.isArray(students) || students.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Un tableau d\'étudiants non vide est requis'
        });
        return;
      }

      if (students.length > 100) {
        res.status(400).json({
          success: false,
          message: 'Maximum 100 étudiants par lot'
        });
        return;
      }

      logger.info(`Début de la création en lot de ${students.length} étudiants`);

      const results: StudentCreationResult[] = [];
      let successCount = 0;
      let errorCount = 0;

      // Traiter chaque étudiant
      for (const studentData of students) {
        const result: StudentCreationResult = {
          student: studentData,
          success: false
        };

        try {
          // Validation des données
          const validationError = this.validateStudentData(studentData);
          if (validationError) {
            result.error = validationError;
            results.push(result);
            errorCount++;
            continue;
          }

          // Normaliser les données
          const normalizedData = {
            firstName: studentData.firstName.trim(),
            lastName: studentData.lastName.trim(),
            email: studentData.email.trim().toLowerCase()
          };

          // Vérifier si l'email existe déjà
          const existingUser = await User.findOne({ email: normalizedData.email });
          if (existingUser) {
            result.error = 'Un utilisateur avec cet email existe déjà';
            results.push(result);
            errorCount++;
            continue;
          }

          // Générer un mot de passe temporaire
          const temporaryPassword = this.generateTemporaryPassword();

          // Créer l'utilisateur
          const userData = {
            name: `${normalizedData.firstName} ${normalizedData.lastName}`,
            email: normalizedData.email,
            password: temporaryPassword,
            role: 'user',
            isTemporaryPassword: true,
            mustChangePassword: true,
            isActive: true
          };

          const newUser = new User(userData);
          const savedUser = await newUser.save();

          result.success = true;
          result.userId = savedUser._id.toString();
          successCount++;

          logger.info(`Utilisateur créé avec succès:`, {
            userId: savedUser._id,
            email: normalizedData.email,
            name: userData.name
          });

          // Envoyer l'email de bienvenue
          try {
            const emailResult = await EmailService.sendWelcomeEmail(
              normalizedData.email,
              normalizedData.firstName,
              normalizedData.lastName,
              temporaryPassword
            );

            if (emailResult.success) {
              result.emailSent = true;
              logger.info(`Email de bienvenue envoyé à ${normalizedData.email}`);
            } else {
              result.emailSent = false;
              result.emailError = emailResult.error;
              logger.warn(`Échec de l'envoi de l'email à ${normalizedData.email}:`, emailResult.error);
            }
          } catch (emailError) {
            result.emailSent = false;
            result.emailError = emailError instanceof Error ? emailError.message : 'Erreur inconnue';
            logger.error(`Erreur lors de l'envoi de l'email à ${normalizedData.email}:`, emailError);
          }

        } catch (error) {
          result.error = error instanceof Error ? error.message : 'Erreur inconnue lors de la création';
          errorCount++;
          logger.error(`Erreur lors de la création de l'étudiant ${studentData.email}:`, error);
        }

        results.push(result);
      }

      // Préparer la réponse
      const response = {
        success: successCount > 0,
        message: `${successCount} étudiant(s) créé(s) avec succès, ${errorCount} échec(s)`,
        summary: {
          total: students.length,
          success: successCount,
          errors: errorCount
        },
        results
      };

      // Status code basé sur les résultats
      const statusCode = successCount === students.length ? 201 : 
                        successCount > 0 ? 207 : // Multi-Status
                        400;

      logger.info(`Création en lot terminée:`, response.summary);

      res.status(statusCode).json(response);

    } catch (error) {
      logger.error('Erreur générale lors de la création en lot d\'étudiants:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur lors de la création des étudiants',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  /**
   * Obtient les statistiques des étudiants
   */
  static async getStudentStats(req: Request, res: Response): Promise<void> {
    try {
      const totalUsers = await User.countDocuments({ role: 'user' });
      const temporaryPasswords = await User.countDocuments({ 
        role: 'user', 
        isTemporaryPassword: true 
      });
      const mustChangePassword = await User.countDocuments({ 
        role: 'user', 
        mustChangePassword: true 
      });
      const activeUsers = await User.countDocuments({ 
        role: 'user', 
        isActive: true 
      });

      const stats = {
        totalStudents: totalUsers,
        activeStudents: activeUsers,
        studentsWithTemporaryPassword: temporaryPasswords,
        studentsMustChangePassword: mustChangePassword,
        inactiveStudents: totalUsers - activeUsers
      };

      res.status(200).json({
        success: true,
        stats
      });

    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques étudiants:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }
} 