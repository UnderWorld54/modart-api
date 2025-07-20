import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

// Configuration du transporteur email
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true pour 465, false pour les autres ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Vérifier la connexion
  transporter.verify((error: any, success: any) => {
    if (error) {
      logger.error('Erreur de configuration email:', error);
    } else {
      logger.info('Serveur email prêt pour l\'envoi de messages');
    }
  });

  return transporter;
};

export const emailTransporter = createTransporter();

export const emailConfig = {
  from: process.env.EMAIL_FROM || '"Mod\'Art International" <noreply@modart.fr>',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
}; 