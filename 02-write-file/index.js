const fs = require('fs');
const readline = require('readline');

const filePath = './02-write-file/new-file.txt';
const promptText = 'Введите текст: ';
const exitText = 'Заходите еще!';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function writeToFile(text) {
  fs.appendFile(filePath, text, (err) => {
    if (err) throw err;
    rl.prompt();
  });
}

rl.setPrompt(promptText);
rl.prompt();
writeToFile('');

rl.on('line', (input) => {
  if (input === 'exit') {
    // console.log(exitText);
    rl.close();
  } else {
    writeToFile(input);
  }
});

rl.on('close', () => {
  console.log('\n');
  console.log(exitText);
  process.exit(0);
});
