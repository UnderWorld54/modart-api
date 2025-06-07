import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    age: 30,
    role: 'admin',
    isActive: true,
    socials: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/adminuser' },
      { platform: 'instagram', url: 'https://instagram.com/adminuser' }
    ]
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    age: 25,
    role: 'user',
    isActive: true,
    socials: [
      { platform: 'facebook', url: 'https://facebook.com/johndoe' },
      { platform: 'twitter', url: 'https://twitter.com/johndoe' }
    ]
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
    age: 28,
    role: 'user',
    isActive: true,
    socials: [
      { platform: 'instagram', url: 'https://instagram.com/janesmith' },
      { platform: 'tiktok', url: 'https://tiktok.com/@janesmith' }
    ]
  }
];

const seedUsers = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modart');
    console.log('Connected to MongoDB');

    // Suppression des utilisateurs existants
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash des mots de passe
    for (const user of users) {
      user.password = await bcrypt.hash(user.password, 12);
    }

    // Création des nouveaux utilisateurs
    await User.insertMany(users);
    console.log('Users seeded successfully');

    // Déconnexion de MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Exécution du seed
seedUsers(); 