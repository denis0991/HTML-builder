const fs = require('fs');
const path = require('path');

const stylespath = path.join(__dirname, 'styles');
const outputpath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylespath, (err, files) => {
  if (err) throw err;

  const cssfiles = files.filter(
    (file) => path.extname(file).toLowerCase() === '.css',
  );
  const styles = cssfiles.map((file) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(stylespath, file), 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  });

  Promise.all(styles)
    .then((results) => results.join('\n'))
    .then((data) => {
      fs.writeFile(outputpath, data, (err) => {
        if (err) throw err;
        console.log('bundle created successfully!');
      });
    })
    .catch((err) => {
      throw err;
    });
});
