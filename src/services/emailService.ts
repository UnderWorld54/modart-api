import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { emailTransporter, emailConfig } from '../config/email';
import { logger } from '../utils/logger';

export class EmailService {
  private static welcomeTemplate: handlebars.TemplateDelegate | null = null;

  // Compiler le template une seule fois au démarrage
  private static getWelcomeTemplate(): handlebars.TemplateDelegate {
    if (!this.welcomeTemplate) {
      try {
        const templatePath = path.join(__dirname, '../templates/welcomeStudent.hbs');
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        this.welcomeTemplate = handlebars.compile(templateSource);
        logger.info('Template email de bienvenue compilé avec succès');
      } catch (error) {
        logger.error('Erreur lors de la compilation du template email:', error);
        throw new Error('Impossible de charger le template email');
      }
    }
    return this.welcomeTemplate;
  }

  /**
   * Envoie un email de bienvenue à un nouvel étudiant
   */
  static async sendWelcomeEmail(
    email: string,
    firstName: string,
    lastName: string,
    temporaryPassword: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const template = this.getWelcomeTemplate();
      
      // Préparer les données pour le template
      const templateData = {
        firstName,
        lastName,
        email,
        temporaryPassword,
        loginUrl: `${emailConfig.frontendUrl}/login`
      };

      // Compiler le template avec les données
      const htmlContent = template(templateData);

      // Configuration de l'email
      const mailOptions = {
        from: emailConfig.from,
        to: email,
        subject: `🎨 Bienvenue chez Mod'Art International - Vos identifiants de connexion`,
        html: htmlContent,
        text: `
Bienvenue ${firstName} ${lastName} !

Nous sommes ravis de vous accueillir au sein de Mod'Art International.

Vos identifiants de connexion :
- Email : ${email}
- Mot de passe temporaire : ${temporaryPassword}

IMPORTANT: Ce mot de passe est temporaire. Vous devrez le modifier lors de votre première connexion.

Connectez-vous maintenant : ${emailConfig.frontendUrl}/login

Cordialement,
L'équipe Mod'Art International
        `.trim()
      };

      // Envoyer l'email
      const result = await emailTransporter.sendMail(mailOptions);
      
      logger.info(`Email de bienvenue envoyé avec succès à ${email}`, {
        messageId: result.messageId,
        recipient: email,
        student: `${firstName} ${lastName}`
      });

      return {
        success: true,
        messageId: result.messageId
      };

    } catch (error) {
      logger.error(`Erreur lors de l'envoi de l'email de bienvenue à ${email}:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'envoi de l\'email'
      };
    }
  }

  /**
   * Vérifie la configuration email
   */
  static async verifyEmailConfiguration(): Promise<boolean> {
    try {
      await emailTransporter.verify();
      logger.info('Configuration email vérifiée avec succès');
      return true;
    } catch (error) {
      logger.error('Erreur de configuration email:', error);
      return false;
    }
  }

  /**
   * Envoie un email de test
   */
  static async sendTestEmail(toEmail: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: emailConfig.from,
        to: toEmail,
        subject: 'Test de configuration email - Mod\'Art International',
        html: `
          <h2>Test de configuration email</h2>
          <p>Si vous recevez cet email, la configuration est correcte !</p>
          <p>Envoyé le : ${new Date().toLocaleString('fr-FR')}</p>
        `,
        text: `
Test de configuration email

Si vous recevez cet email, la configuration est correcte !
Envoyé le : ${new Date().toLocaleString('fr-FR')}
        `.trim()
      };

      const result = await emailTransporter.sendMail(mailOptions);
      logger.info(`Email de test envoyé avec succès à ${toEmail}`, { messageId: result.messageId });
      return true;
    } catch (error) {
      logger.error(`Erreur lors de l'envoi de l'email de test à ${toEmail}:`, error);
      return false;
    }
  }
} 