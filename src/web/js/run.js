(function () {
  let selectedQuestions = [];
  let currentSlide = 0;
  let answersArray = [];

  let slides = null;

  const confirmButton = document.getElementById('confirm');

  const startButton = document.getElementById('start');

  const nextButton = document.getElementById('next');

  const backButton = document.getElementById('back');

  const submitButton = document.getElementById('submit');

  function getRandomNItems(arr, n) {
    const shuffled = [...arr];
    let currentIndex = shuffled.length;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[currentIndex],
      ];
    }
    return shuffled.slice(0, n);
  }

  function buildQuestions() {
    const output = [];
    selectedQuestions.forEach((currentQuestion, questionNumber) => {
      const answers = [];
      Object.entries(currentQuestion.answers).forEach(([index, answer]) => {
        answers.push(
          `<input id="question-${questionNumber}-${index}" type="radio" name="question-${questionNumber}" class="with-font" value="${index}">
          <label for="question-${questionNumber}-${index}">${index}. ${answer}</label>`,
        );
      });
      const image = currentQuestion.image
        ? `<image src="${currentQuestion.image}"/>`
        : '';
      output.push(
        `<div class="slide">
            <div id="title" class="wow slideInDown">
              <h2>Câu: ${output.length + 1}/${selectedQuestions.length}</h2>
            </div>

            <div class="question wow fadeIn" data-wow-delay="1s" data-wow-duration="2s">
              <p>${currentQuestion.question}</p>
              ${image}
            </div>
            <div class="answers wow fadeIn" data-wow-delay="2s" data-wow-duration="2s">
              <p>${answers.join('')}</p>
            </div>
         </div>`,
      );
    });
    quizContainer.innerHTML = output.join('');
  }

  function showAnswer() {
    const selector = `input[name=question-${currentSlide}]:checked`;

    const answer = quizContainer.querySelector(selector);
    if (!answer) {
      return;
    }

    const currentQuestion = selectedQuestions[currentSlide];
    if (answer.value === currentQuestion.correctAnswer) {
      answersArray.push(
        `<div class="answer-slide" id="answer-${currentSlide}">
            <div class="answer-text wow slideInRight">
              <p><span style='font-size:50px;'>&#9989;</span></p>
            </div>
          </div>`,
      );
    } else {
      answersArray.push(
        `<div class="answer-slide" id="answer-${currentSlide}">
            <div class="answer-text wow slideInRight">
              <p><span style='font-size:50px;'>&#10060;</span> ${currentQuestion.title}</p>
            </div>
          </div>`,
      );
    }

    resultsTextContainer.innerHTML = answersArray.join('');
    showResult();
  }

  function showResult() {
    const answerSlide = document.getElementById(`answer-${currentSlide}`);
    if (answerSlide) {
      answerSlide.classList.add('active-slide');
      confirmButton.classList.add('disabled');
    } else {
      confirmButton.classList.remove('disabled');
    }
  }

  function hiddenCurrent() {
    slides[currentSlide].classList.remove('active-slide');
    const answerSlide = document.getElementById(`answer-${currentSlide}`);
    if (answerSlide) {
      answerSlide.classList.remove('active-slide');
    }
  }

  function showResults() {
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll('.answers');

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // find selected answer
      // First, we’re making sure we’re looking inside the answer container for the current question.
      const answerContainer = answerContainers[questionNumber];
      // In the next line, we’re defining a CSS selector that will let us find which radio button is checked.
      const selector = `input[name=question${questionNumber}]:checked`;
      // Then we’re using JavaScript’s querySelector to search for our CSS selector in the previously defined answerContainer.
      // this means that we’ll find which answer’s radio button is checked. Finally, we can get the value of that answer by using .value.
      // But what if the user left an answer blank? Then using .value would cause an error because you can’t get the value of something that’s not there.
      // To solve this, we’ve added ||, which means “or” and {} which is an empty object.
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;
      // if answer is correct
      if (userAnswer === currentQuestion.correctAnswer) {
        // add to the number of correct answers
        numCorrect++;
      }
    });

    // create dynamic quiz length
    const quizLength = Number(`${myQuestions.length}`);
    // calculate the half of the length
    const quizHalf = Number(`${myQuestions.length}`) / 2;

    // show number of correct answers out of total
    if (numCorrect === quizLength) {
      resultsContainer.innerHTML = `<div class="wow slideInDown"><h2>Congratulations!</h2></div><div class="wow fadeIn" data-wow-delay="1s" data-wow-duration="2s"><p>Very good, you seem to be a pro!</p><p>You answered ${numCorrect} out of ${myQuestions.length} questions correct.</p><a href="http://geobon.org"><button class="btn btn-default">My Dashboard</button></a></div>`;
    } else if (numCorrect >= quizHalf && numCorrect < quizLength) {
      resultsContainer.innerHTML = `<div class="wow slideInDown"><h2>Not bad...</h2></div><div class="wow fadeIn" data-wow-delay="1s" data-wow-duration="2s"><p>but not enough to be a winner.</p><p>You answered just ${numCorrect} out of ${myQuestions.length} questions correct.</p><a href="./index.html"><button id="playAgain" class="btn btn-default">Play again</button></a></div>`;
    } else {
      resultsContainer.innerHTML = `<div class="wow slideInDown"><h2>Very bad...</h2></div><div class="wow fadeIn" data-wow-delay="1s" data-wow-duration="2s"><p>You need to practice! All employees need to be familiar with the iDiv Health & Security rules.</p><p>You answered just ${numCorrect} out of ${myQuestions.length} questions correct.</p><a href="./index.html"><button id="playAgain" class="btn btn-default">Play again</button></a></div>`;
    }

    // switch off Title, Question and Answers
    $('#title h2').css('display', 'none');
    $('.question').css('display', 'none');
    $('.answers').css('display', 'none');
    submitButton.classList.add('display-none');
    nextButton.classList.add('display-none');
    confirmButton.classList.add('display-none');
    resultsTextContainer.innerHTML = '';
  }

  function showSlide(n) {
    hiddenCurrent();
    slides[n].classList.add('active-slide');
    currentSlide = n;
    showResult();
    if (n > 0) {
      backButton.classList.remove('display-none');
    } else {
      backButton.classList.add('display-none');
    }
    if (n === selectedQuestions.length - 1) {
      submitButton.classList.remove('display-none');
      nextButton.classList.add('display-none');
    } else {
      nextButton.classList.remove('display-none');
    }
  }

  function showBackSlide() {
    showSlide(Math.max(currentSlide - 1, 0));
  }

  function showNextSlide() {
    showSlide(currentSlide + 1);
  }

  function startTest() {
    selectedQuestions = getRandomNItems(Object.values(data.questions), 27);
    buildQuestions();
    slides = document.querySelectorAll('.slide');
    showSlide(0);
    confirmButton.classList.remove('display-none');
    startButton.classList.add('display-none');
  }

  const quizContainer = document.getElementById('optionContainer');

  const resultsContainer = document.getElementById('results');

  const resultsTextContainer = document.getElementById('resultsContainer');

  confirmButton.addEventListener('click', showAnswer);

  nextButton.addEventListener('click', showNextSlide);

  backButton.addEventListener('click', showBackSlide);

  submitButton.addEventListener('click', showResults);

  startButton.addEventListener('click', startTest);

  submitButton.classList.add('display-none');
  nextButton.classList.add('display-none');
  backButton.classList.add('display-none');
  confirmButton.classList.add('display-none');

  const introduction = document.getElementById('introduction');
  introduction.innerHTML = `<h1>${data.info}</h1>`;

  const selecting = document.getElementById('selecting');
  selecting.innerHTML = `<div id="selecting">
    </div>
    `;
})();
