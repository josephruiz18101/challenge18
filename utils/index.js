const connection = require('../config/connection')
connection.on('error', (err) => err);

const User = require('../models/User');
const Thought = require('../models/Thought');

const userData = require('./userData.json');
const thoughtData = require('./thoughtData.json');

console.log('Now seeding database');

connection.once('open', async () => {
    console.log('Connected to database');

    console.info('Now seeding database!');

    let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
    if (userCheck.length) {
        await connection.dropCollection('users');
    }

    let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
    if (thoughtCheck.length) {
        await connection.dropCollection('thoughts');
    }

    await User.collection.insertMany(userData);
    await Thought.collection.insertMany(thoughtData);

    console.table(userData);
    console.table(thoughtData);

    console.info('Database has been seeded!');
    process.exit(0);
});