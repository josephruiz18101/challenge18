const router = require('express').Router();
const { User, Thought } = require('../../models');

// Get all users
router.get('/', async (req,res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Get single user
router.get('/:id', async (req,res) => {
    try {
        const user = await User.findOne(
            { _id: req.params.id }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Post a new user
router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            {  _id: req.params.id },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id });

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        await Thought.deleteMany({ _id: { $in: user.thoughts } });

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


// Add a friend to friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId }}
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


// Remove a friend from friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId }}
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;