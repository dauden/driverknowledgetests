const fs = require('fs');

// Load text.txt and data.json
const rawText = fs.readFileSync('./text.txt', 'utf8');

// Parse the questions
const lines = rawText.split('\n');
const questions = {};
const chapters = {};

let counter = 0;
let currentNumber = null;
let currentTitle = '';
let currentOptions = [];
let currentChapter = null;
const saveChapter = () => {
  if (currentChapter !== null) {
    chapters[currentChapter] = {
      id: currentChapter,
      title: `CHƯƠNG ${currentChapter}. ${currentTitle.trim()}`,
      description: `từ câu số 1 đến câu 180`,
      numberOfQuestions: counter,
    };
  }
};

function saveQuestion() {
  if (currentNumber !== null) {
    const answers = {};
    currentOptions.forEach((opt, index) => {
      answers[index + 1] = opt.trim();
    });
    const path = `./images/${currentNumber}.png`;
    const image = fs.existsSync(path) ? path : null;
    questions[currentNumber] = {
      id: currentNumber,
      tag: currentChapter,
      question: currentTitle.trim(),
      title: `Câu ${currentNumber}`,
      image,
      answers,
      correctAnswer: '',
    };
  }
}

for (let line of lines) {
  line = line.trim();
  if (!line) continue;

  const chapterMatch = line.match(/^CHƯƠNG (\w+)\.\s*(.*)/);
  const questionMatch = line.match(/^Câu (\d+)\.\s*(.*)/);
  const optionMatch = line.match(/^\d+\.\s*(.*)/);

  if (chapterMatch) {
    currentChapter = chapterMatch[1];
    currentTitle = chapterMatch[2];
    saveChapter();
  } else if (questionMatch) {
    saveQuestion();
    currentNumber = questionMatch[1];
    currentTitle = questionMatch[2];
    currentOptions = [];
  } else if (optionMatch) {
    currentOptions.push(optionMatch[1]);
  } else {
    currentTitle += ' ' + line;
  }
}

saveQuestion(); // save the last one
const data = {
  info: '600 CÂU HỎI\nDÙNG CHO SÁT HẠCH LÁI XE\nCƠ GIỚI ĐƯỜNG BỘ',
  chapters,
  questions,
};

// Write output
fs.writeFileSync('parsed_data.json', JSON.stringify(data, null, 2), 'utf8');
console.log('✅ Parsed data written to parsed_data.json');
