const auth = require('../middleware/auth');
const Task = require('../models/task');
const router = require('express').Router();



router.post('/addtask', auth, async (req, res) => {
    try {
        console.log("body", req.body);
        const { title, description } = req.body;
        const newTask = new Task({
            title,
            description,
            userId: req.userId,
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/getall', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { title, description },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;