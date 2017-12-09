const nconf = require('nconf');
const db = require('../models/todos')();

module.exports.getTasks = function (req, res) {
  res.json(db.stores.file.store);
}

module.exports.getTask = function (req, res) {
  let task = db.get(req.params.id);

  if (task) {
    Object.assign(task, {id: req.params.id});
    res.json(task);
  } else {
    res
      .status(404)
      .json({err: 'Task not found'});
  }
}

module.exports.addTask = function (req, res) {
  if (!(!!req.body.name)) {
    return res
      .status(400)
      .json({err: 'Data format is not correct'});
  }

  let task = {
    name: req.body.name
  };
  let idListTasks = Object.keys(db.stores.file.store);
  let id = Math.max(...idListTasks) + 1;

  db.set(id.toString(), task);
  db.save();

  Object.assign(task, {id: id});
  res.json(task);
}

module.exports.editTask = function (req, res) {
  if (!(!!req.body.name)) {
    return res
      .status(400)
      .json({err: 'Data format is not correct'});
  }

  let id = req.params.id;
  let task = db.get(id);

  if (task) {
    task.name = req.body.name;

    db.set(id, task);
    db.save();

    Object.assign(task, {id: id});
    res.json(task);
  } else {
    res
      .status(404)
      .json({err: 'Task not found'});
  }
}

module.exports.deleteTask = function (req, res) {
  let id = req.params.id;
  let isFoundTask = !!db.get(id);

  if(isFoundTask) {
    db.clear(id);
    db.save();
    res.json({id: id});
  } else {
    res
      .status(404)
      .json({err: 'Task not found'});
  }
}