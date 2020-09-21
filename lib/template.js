
var template = {
  HTML : function (title, contents, body, control) {
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ul>${contents}</ul>
        ${control} 
        ${body}
        <img src="/images/hello.jpg" style="width:300px; display:block; margin:5px;">
      </body>
      </html>
    `},
  Contents : function (filelist) {
      var contents = ``;
      for (var list of filelist) {
        contents += `<li><a href ="/page/${list}">${list}</a></li>`
      }
    
      return contents;
    },
  Body : function (title, description) {
      return `<h2>${title}</h2><p>${description}</p>`
    },
  Create : function () {
      return `
        <form action="http://localhost:3000/create_process" method="POST">
          <p><input type="text" name='title' placeholder="title"></p>
          <p><textarea name="description" id="" cols="30" rows="5"  \
            placeholder="Description"></textarea></p>
          <p><input type="submit" value="send"></p>
        </form>
      `
    },
  makePage : function (title, contents, body, control, response) {
      html = template.HTML(title, contents, body, control);
      response.send(html);
    }
}

module.exports = template;
