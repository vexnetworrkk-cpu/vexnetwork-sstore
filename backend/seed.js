require('dotenv').config();
const mongoose = require('mongoose');
const Package = require('./models/Package');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Package.deleteMany({});

    const defaultPackages = [
      {
        name: 'GOD Rank (+3600 Coins)',
        description: 'The ultimate GOD Rank for the server.',
        price: 2700, // stored in smallest currency unit, e.g., cents if USD, or INR. The user had 27.00 USD, so let's put 2700. Wait,Razorpay expects INR usually, but let's assume 2700 for now.
        features: ['GOD Prefix', 'All Permissions', 'Weekly Kit', 'Private Discord Channel'],
        color: '#ef4444',
        category: 'lifesteal-rank',
        infoDetails: {
          perks: ['GOD Prefix in front of your name', 'Priority Queue to Server', 'Set up to 50 Homes', 'Create up to 25 Auction House Listings'],
          commands: ['Access to do /kit God', 'Access to do /fly', 'Access to do /nick', 'Access to do /heal'],
          others: ['3600 Coins'],
          note: 'This package is valid for the current season.',
          kitPreviewImg: ''
        }
      },
      {
        name: '15600 Coins (LIFESTEAL)',
        description: '15600 in-game coins for Lifesteal.',
        price: 1220,
        features: ['15600 Coins', 'Instant Delivery'],
        color: '#eab308',
        category: 'lifesteal-coin'
      },
      {
        name: 'Deadliest Rank (+1000 Coins)',
        description: 'Deadliest Rank with awesome perks.',
        price: 670,
        features: ['Deadliest Prefix', 'Special Kit'],
        color: '#8b5cf6',
        category: 'lifesteal-rank'
      },
      {
        name: 'Supreme Rank (+3200 Coins)',
        description: 'Supreme Rank with amazing perks.',
        price: 2200,
        features: ['Supreme Prefix', 'Priority Queue'],
        color: '#06b6d4',
        category: 'survival-rank'
      },
      {
        name: '15600 Coins (SURVIVAL)',
        description: '15600 in-game coins for Survival.',
        price: 1220,
        features: ['15600 Coins', 'Instant Delivery'],
        color: '#eab308',
        category: 'survival-coin'
      }
    ];

    await Package.insertMany(defaultPackages);
    console.log('Successfully seeded database with packages!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
