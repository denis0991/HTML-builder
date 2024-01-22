const fs = require('fs');
const path = require('path');

// Функция, которая заменяет теги в шаблоне и сохраняет результат в файл
async function replaceTags(templateContent, componentsDir, distDir) {
  // Парсинг тегов из шаблона
  const tags = templateContent.match(/{{(.*?)}}/g);

  if (!tags) {
    throw new Error('No tags found in the template');
  }

  // Замена тегов на содержимое компонентов
  for (const tag of tags) {
    // Получение имени компонента
    const componentName = tag.replace('{{', '').replace('}}', '');

    // Получение пути к файлу компонента
    const componentPath = path.join(componentsDir, componentName + '.html');

    try {
      // Чтение содержимого компонента
      const componentContent = await fs.promises.readFile(
        componentPath,
        'utf-8',
      );

      // Замена тега на содержимое компонента
      templateContent = templateContent.replace(tag, componentContent);
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`Component '${componentName}' not found`);
      } else {
        throw err;
      }
    }
  }

  // Запись результата в файл index.html
  const distPath = path.join(distDir, 'index.html');
  await fs.promises.writeFile(distPath, templateContent, 'utf-8');
  console.log('index.html has been created');
}

// Функция, которая компилирует стили из папки styles в один файл и сохраняет его
async function compileStyles(stylesDir, distDir) {
  // Создание потока для записи стилей
  const distStream = fs.createWriteStream(path.join(distDir, 'style.css'));

  // Чтение всех файлов из папки styles
  const files = await fs.promises.readdir(stylesDir);

  // Запись содержимого каждого файла в поток
  for (const file of files) {
    // Проверка расширения файла
    if (path.extname(file) === '.css') {
      const filePath = path.join(stylesDir, file);
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      distStream.write(fileContent);
    }
  }

  // Завершение записи и закрытие потока
  distStream.end();
  console.log('style.css has been created');
}

// Функция, которая копирует папку assets в папку dist
async function copyAssets(assetsDir, distDir) {
  // Создание папки assets в папке dist
  const distAssetsDir = path.join(distDir, 'assets');
  await fs.promises.mkdir(distAssetsDir);

  // Чтение всех файлов из папки assets
  const files = await fs.promises.readdir(assetsDir);

  // Копирование каждого файла в папку assets в папке dist
  for (const file of files) {
    const srcFilePath = path.join(assetsDir, file);
    const destFilePath = path.join(distAssetsDir, file);
    await fs.promises.copyFile(srcFilePath, destFilePath);
  }

  console.log('assets folder has been copied');
}

// Основная функция, которая выполняет все шаги сценария
async function buildPage() {
  // Пути к папкам и файлам
  const componentsDir = path.join(__dirname, 'components');
  const templatePath = path.join(__dirname, 'template.html');
  const stylesDir = path.join(__dirname, 'styles');
  const assetsDir = path.join(__dirname, 'assets');
  const distDir = path.join(__dirname, 'project-dist');

  try {
    // Создание папки project-dist
    await fs.promises.mkdir(distDir);

    // Чтение шаблона
    const templateContent = await fs.promises.readFile(templatePath, 'utf-8');

    // Замена тегов
    await replaceTags(templateContent, componentsDir, distDir);

    // Компиляция стилей
    await compileStyles(stylesDir, distDir);

    // Копирование assets
    await copyAssets(assetsDir, distDir);
  } catch (err) {
    console.error('An error occurred:', err.message);
  }
}

// Выполнение сценария
buildPage();
