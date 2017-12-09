const express = require('express');
const router = express.Router();
const ctrlTasks = require('../controllers/todos');

router.get('/', ctrlTasks.getTasks);

router.get('/:id', ctrlTasks.getTask);

router.post('/', ctrlTasks.addTask);

router.put('/:id', ctrlTasks.editTask);

router.delete('/:id', ctrlTasks.deleteTask);

module.exports = router;