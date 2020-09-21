const express = require('express')
const app = express()
const fs = require('fs');
const template = require('./lib/template.js');
const qs = require('querystring');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const bodyParser = require('body-parser');
const compression = require('compression')
const helmet = require('helmet')

app.use(helmet())

app.use(express.static('public'))
app.use(compression({ level: 6 }))
app.use(bodyParser.urlencoded({ extended: false }))
app.get('*', (request, response, next) => {
  fs.readdir('data', 'utf8', (err, filelist) => {
    request.filelist = filelist;
    next();
  })
})


app.get('/', (request, response) => {
  let title = 'Welcome';
  let description = 'Hello NodeJS';
  let contents = template.Contents(request.filelist);
  template.makePage(title, contents, template.Body(title, description), `<a href="/create">create</a>`, response)
})

app.get('/page/:id', (request, response, next) => {
  var title = request.params.id;
  var filteredTitle = path.parse(title).base;
  fs.readFile(`data/${filteredTitle}`, 'utf8', (err, description) => {
    if (err) {
      next(err);
    } else {
      var contents = template.Contents(request.filelist);
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description);
      template.makePage(sanitizedTitle, contents, template.Body(sanitizedTitle, sanitizedDescription),
        `<a href="/create">create</a> 
        <a href="/update/${sanitizedTitle}">update</a>
        <form action="/delete_process" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
        </form>
        `, response)
    }

  })
})

app.get('/create', (request, response) => {
  title = 'Welcome';
  description = 'Hello NodeJS';
  var contents = template.Contents(request.filelist);
  template.makePage(title, contents, template.Create(), '', response)
})

app.post('/create_process', (request, response) => {
  var post = request.body;
  var title = post.title;
  var description = post.description;
  var filteredTitle = path.parse(title).base;
  fs.writeFile(`data/${filteredTitle}`, description, 'utf8', function (err) {
    response.redirect(`/page/${title}`);
  })
})

app.get('/update/:id', (request, response) => {
  var title = request.params.id;
  var filteredTitle = path.parse(title).base;
  fs.readFile(`data/${filteredTitle}`, 'utf8', (err, description) => {
    var contents = template.Contents(request.filelist);
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = sanitizeHtml(description);
    template.makePage(title, contents, `
        <form action="http://localhost:3000/update_process" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <p><input type="text" name='title' placeholder="title" value=${sanitizedTitle}></p>
          <p><textarea name="description" id="" cols="30" rows="5"  \
            placeholder="Description">${sanitizedDescription}</textarea></p>
          <p><input type="submit" value="send"></p>
        </form>
      `,
      ``,
      response)
  })
})

app.post('/update_process', (request, response) => {
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  var filteredTitle = path.parse(title).base;
  fs.rename(`data/${id}`, `data/${filteredTitle}`, function (error) {
    fs.writeFile(`data/${filteredTitle}`, description, 'utf8', function (err) {
      response.redirect(`/page/${title}`);
    })
  })
})

app.post('/delete_process', (request, response) => {
  var post = request.body;
  var fn = post.id;
  var filteredTitle = path.parse(fn).base;
  fs.unlink(`data/${filteredTitle}`, (err) => {
    response.redirect(`/`);
  })
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Requested URL do not exist')
})

app.listen(3000, () => console.log('Listening on port 3000!'))

/*
var http = require('http');
var fs = require('fs');
var url = require('url');
const qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function (request, response) {
  var _url = url.parse(request.url, true);
  var title = _url.query.id;
  var pathname = _url.pathname;
  if (pathname === '/') {
    if (title === undefined) {


    } else {

    }

  } else if (pathname === '/create') {

  } else if (pathname === '/create_process') {


  } else if (pathname === '/update') {


  } else if (pathname === '/update_process') {


  } else if (pathname === '/delete_process') {

  } else {
    response.writeHead(404);
    response.end('<h1><a href="/">WEB</a></h1><p>Page Not Found.</p>');
  }
});

app.listen(3000);

*/
