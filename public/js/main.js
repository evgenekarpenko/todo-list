function sendData(url, method, data, cb) {
  $.ajax({
    url: url,
    method: method,
    data: data,
    contentType: 'application/json',
    success: function(data) {
      cb(data);
    }
  });
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('table');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'TD') {
    ev.target.classList.toggle('checked');
  }
}, false);

// сброс формы
function reset() {
  var form = document.forms['taskForm'];
  form.elements['id'].value = 0;
  form.reset();
}

// создание строки для таблицы
var row = function(task) {
  return `<tr data-rowid='${task.id}'><td>${task.name}<a class='edit' data-id='${task.id}'>&#x270e</a> <a class='delete' data-id='${task.id}'>\u00D7</a></td></tr>`;
};

function getTasks() {
  sendData('/api/tasks', 'GET', {}, tasks => {
    let rows = '';
    $.each(tasks, (index, task) => {
      rows += row(Object.assign(task, {id: index}))
    });
    $('table tbody').append(rows);
  });
}

function getTask(id) {
  sendData('/api/tasks/' + id, 'GET', {}, task => {
    let form = document.forms['taskForm'];
    form.elements['id'].value = task.id;
    form.elements['name'].value = task.name;
  })
}

function createTask(task) {
  sendData('/api/tasks', 'POST', JSON.stringify(task), task => {
    reset();
    $('table tbody').append(row(task));
  })
}

function editTask(id, task) {
  sendData('/api/tasks/' + id, 'PUT', JSON.stringify(task), task => {
    reset();
    $('tr[data-rowid="' + task.id + '"]').replaceWith(row(task));
  })
}

function deleteTask(id) {
  sendData('/api/tasks/' + id, 'DELETE', {}, task => {
    $('tr[data-rowid="' + task.id + '"]').remove();
  })
}

$('form').on('submit', function(e) {
  e.preventDefault();
  let id = +this.elements['id'].value;
  let name = this.elements['name'].value;

  if (id === 0) {
    createTask({name});
  } else {
    editTask(id, {name});
  }
});

$('table tbody').on('click', '.delete', function() {
  let id = $(this).data('id');
  deleteTask(id);
})

$('table tbody').on('click', '.edit', function() {
  let id = $(this).data('id');
  getTask(id);
})

getTasks();