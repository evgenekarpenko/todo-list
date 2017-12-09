const express = require('express');
const bodyParser = require('body-parser');
const routerTasks = require('./routes/todos');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use('/api/tasks', routerTasks);

app.use((req, res, next) => {
  res.status(404).send('404');
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('500');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});