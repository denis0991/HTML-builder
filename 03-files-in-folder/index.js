const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, '/secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Ошибка чтения папки:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error('Ошибка получения информации о файле:', err);
        return;
      }

      if (stats.isFile()) {
        const fileName = path
          .basename(file)
          .slice(0, -path.extname(file).length);
        const fileExtension = path.extname(file).slice(1);
        const fileSize = stats.size + ' bytes';
        console.log(`${fileName} - ${fileExtension} - ${fileSize}`);
      }
    });
  });
});
