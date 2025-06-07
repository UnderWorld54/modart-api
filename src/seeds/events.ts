import mongoose from 'mongoose';
import Event from '../models/Event';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const seedEvents = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modart');
    console.log('Connected to MongoDB');

    // Récupérer un admin pour les références createdBy et updatedBy
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('No admin user found. Please run user seeds first.');
      process.exit(1);
    }

    // Suppression des événements existants
    await Event.deleteMany({});
    console.log('Cleared existing events');

    const events = [
      {
        title: "Défilé Printemps-Été 2024",
        description: "Collection haute couture inspirée par la nature et les couleurs vives du printemps. Présentation des nouvelles tendances pour la saison estivale.",
        start_date: new Date("2024-03-15T19:00:00Z"),
        end_date: new Date("2024-03-15T21:00:00Z"),
        location: "Palais de Tokyo, Paris",
        isActive: true,
        createdBy: admin._id,
        updatedBy: admin._id
      },
      {
        title: "Fashion Week Paris",
        description: "L'événement phare de la mode parisienne. Présentation des collections des plus grandes maisons de couture françaises.",
        start_date: new Date("2024-03-20T14:00:00Z"),
        end_date: new Date("2024-03-27T22:00:00Z"),
        location: "Carrousel du Louvre, Paris",
        isActive: true,
        createdBy: admin._id,
        updatedBy: admin._id
      },
      {
        title: "Défilé Haute Couture",
        description: "Présentation exclusive des pièces uniques de haute couture. Un événement réservé aux clients VIP et aux professionnels de la mode.",
        start_date: new Date("2024-04-05T20:00:00Z"),
        end_date: new Date("2024-04-05T22:30:00Z"),
        location: "Hôtel de Crillon, Paris",
        isActive: true,
        createdBy: admin._id,
        updatedBy: admin._id
      },
      {
        title: "Fashion Forward",
        description: "Défilé mettant en avant les jeunes créateurs et les nouvelles tendances de la mode. Focus sur l'innovation et le développement durable.",
        start_date: new Date("2024-04-12T15:00:00Z"),
        end_date: new Date("2024-04-12T18:00:00Z"),
        location: "Centre Pompidou, Paris",
        isActive: true,
        createdBy: admin._id,
        updatedBy: admin._id
      },
      {
        title: "Gala de la Mode",
        description: "Soirée de gala célébrant l'excellence de la mode française. Remise des prix aux créateurs les plus talentueux de l'année.",
        start_date: new Date("2024-05-01T19:30:00Z"),
        end_date: new Date("2024-05-01T23:00:00Z"),
        location: "Grand Palais, Paris",
        isActive: true,
        createdBy: admin._id,
        updatedBy: admin._id
      }
    ];

    // Création des nouveaux événements
    await Event.insertMany(events);
    console.log('Events seeded successfully');

    // Déconnexion de MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

// Exécuter le seed si le fichier est exécuté directement
if (require.main === module) {
  seedEvents();
}

export default seedEvents; 