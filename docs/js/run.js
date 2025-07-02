(function () {
  const SELECTED_QUESTIONS_KEY = 'SelectedQuestions';
  const SELECTED_ANSWERS_KEY = 'SelectedAnswers';
  const SELECTED_LICENCE_KEY = 'SelectedLicence';

  function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function removeLocalStorage(key) {
    localStorage.removeItem(key);
  }

  function getLocalStorage() {
    const selectedQuestions = JSON.parse(
      localStorage.getItem(SELECTED_QUESTIONS_KEY) ?? '[]',
    );
    const selectedAnswers = JSON.parse(
      localStorage.getItem(SELECTED_ANSWERS_KEY) ?? '{}',
    );
    const selectedLicence = JSON.parse(
      localStorage.getItem(SELECTED_LICENCE_KEY) ?? null,
    );
    if (selectedQuestions.length < 1) {
      return [[], {}, null];
    }
    return [selectedQuestions, selectedAnswers, selectedLicence];
  }

  let [selectedQuestions, selectedAnswers, selectedLicence] = getLocalStorage();
  let currentSlide = 0;

  let slides = null;

  const playAgainButton = document.getElementById('playAgain');

  const confirmButton = document.getElementById('confirm');

  const startButton = document.getElementById('start');

  const nextButton = document.getElementById('next');

  const backButton = document.getElementById('back');

  const submitButton = document.getElementById('submit');

  const selecting = document.getElementById('selecting');

  const introduction = document.getElementById('introduction');

  const quiz = document.getElementById('quiz');

  function selectQuestion(question, value) {
    Object.assign(selectedAnswers, {
      [`${question}`]: { selected: value },
    });
    setLocalStorage(SELECTED_ANSWERS_KEY, selectedAnswers);
  }

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
          `<input id="question-${questionNumber}-${index}" type="radio" name="question-${questionNumber}" 
          data-question="${questionNumber}" ${
            selectedAnswers?.[questionNumber]?.selected === index
              ? 'checked'
              : ''
          } class="questions with-font" value="${index}">
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
            <div class="question wow fadeIn" data-wow-delay="0.5s" data-wow-duration="1s">
              <p>${currentQuestion.question}</p>
              ${image}
            </div>
            <div class="answers wow fadeIn" data-wow-delay="1s" data-wow-duration="1s">
              <p>${answers.join('')}</p>
            </div>
         </div>`,
      );
    });
    quizContainer.innerHTML = output.join('');
    const questions = quizContainer.querySelectorAll('.questions');
    questions.forEach((item) =>
      item.addEventListener('click', () => {
        const value = item.getAttribute('value');
        const question = item.getAttribute('data-question');
        selectQuestion(question, value);
      }),
    );
  }

  function showAnswer(submitted) {
    const answer = selectedAnswers[currentSlide];
    if (!answer) {
      return;
    }
    if (submitted === true) {
      answer.submitted = true;
      setLocalStorage(SELECTED_ANSWERS_KEY, selectedAnswers);
    }
    if (!answer.submitted) {
      return;
    }
    const currentQuestion = selectedQuestions[currentSlide];
    let answerResult = '';
    if (answer.selected === currentQuestion.correctAnswer) {
      answerResult = `<div class="answer-slide active-slide" id="answer-${currentSlide}">
            <div class="answer-text">
              <p>Cầu trả lời đúng</p>
            </div>
          </div>`;
    } else {
      answerResult = `<div class="answer-slide active-slide" id="answer-${currentSlide}">
            <div class="answer-text wrong">
              <p>Cầu trả lời sai</p>
              <p>Tham khảo ${currentQuestion.title} ở <a href="./doc.pdf">tài liệu</a></p>
            </div>
          </div>`;
    }
    resultsTextContainer.innerHTML = answerResult;

    showResult();
  }

  function showResult() {
    const answerSlide = selectedAnswers[currentSlide];
    if (answerSlide?.submitted) {
      confirmButton.classList.add('disabled');
      $('.answers').addClass('disabled');
    } else {
      $('.answers').removeClass('disabled');
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
    let numCorrect = 0;
    selectedQuestions.forEach((currentQuestion, questionNumber) => {
      const userAnswer = selectedAnswers?.[questionNumber]?.selected;
      if (userAnswer === currentQuestion.correctAnswer) {
        numCorrect++;
      }
    });
    const { requestPassed, numberOfQuestions, licence } = selectedLicence ?? {};

    if (numCorrect >= requestPassed) {
      resultsContainer.innerHTML = `<div class="wow slideInDown">
      <h2>Chúc mừng bạn đã vượt quá!</h2></div>
      <div class="wow fadeIn" data-wow-delay="1s" data-wow-duration="2s">
      <p>Bạn đã vượt qua bài kiêm tra cho hạng <strong>${licence}</strong>!</p>
      <p>Bạn đúng ${numCorrect} trên ${numberOfQuestions} của bài kiểm tra</p>
      <a href="./doc.pdf">Bạn có thể xem thêm tại liều ở đây!</a>
      </div>`;
    } else {
      resultsContainer.innerHTML = `<div class="wow slideInDown">
      <h2>Rất tiếc bạn chưa vượt quá!...</h2></div>
      <div class="wow fadeIn" data-wow-delay="1s" data-wow-duration="2s">
      <p>Bạn chưa hoàn thành bài thi.</p><p>Bạn chỉ đúng ${numCorrect} trên ${numberOfQuestions} của hàng <strong>${licence}</strong></p>
      <a href="./doc.pdf">Bạn có thể xem thêm tại liều ở đây!</a>
      </div>`;
    }

    $('#title h2').css('display', 'none');
    $('.question').css('display', 'none');
    $('.answers').css('display', 'none');
    submitButton.classList.add('display-none');
    nextButton.classList.add('display-none');
    backButton.classList.add('display-none');
    confirmButton.classList.add('display-none');
    quizContainer.innerHTML = '';
    resultsTextContainer.innerHTML = '';
    playAgainButton.classList.remove('display-none');
  }

  function showSlide(n) {
    hiddenCurrent();
    slides[n].classList.add('active-slide');
    currentSlide = n;
    showResult();
    showAnswer(false);
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
    showSlide(Math.min(currentSlide + 1, selectedLicence.numberOfQuestions));
  }

  function selectLicence(key) {
    let currentLicences = selecting.querySelector(
      `#${selectedLicence?.licence}`,
    );
    !!currentLicences && currentLicences.classList.remove('licence-active');
    Object.values(data.assess).some((item) => {
      if (item.licence[key]) {
        const selected = item.licence[key];
        selectedLicence = {
          licence: key,
          numberOfQuestions: selected.numberOfQuestions,
          requestPassed: selected.requestPassed,
          time: selected.time,
          paralysis: selected.paralysis,
        };
        return true;
      }
    });
    setLocalStorage(SELECTED_LICENCE_KEY, selectedLicence);
    currentLicences = selecting.querySelector(`#${selectedLicence.licence}`);
    currentLicences.classList.add('licence-active');
    startButton.classList.remove('disabled');
  }

  function playAgain() {
    removeLocalStorage(SELECTED_LICENCE_KEY);
    removeLocalStorage(SELECTED_ANSWERS_KEY);
    removeLocalStorage(SELECTED_QUESTIONS_KEY);
    selectedQuestions = undefined;
    selectedAnswers = undefined;
    selectedLicence = undefined;
    resultsContainer.innerHTML = '';
    playAgainButton.classList.add('display-none');
    buildSubject();
  }

  function startTest() {
    if (selectedLicence === null) {
      return;
    }
    const { numberOfQuestions } = selectedLicence;
    if (selectedQuestions.length < 1) {
      selectedQuestions = getRandomNItems(
        Object.values(data.questions),
        numberOfQuestions,
      );
      setLocalStorage(SELECTED_QUESTIONS_KEY, selectedQuestions);
    }
    buildQuestions();
    slides = document.querySelectorAll('.slide');
    showSlide(0);
    confirmButton.classList.remove('display-none');
    startButton.classList.add('display-none');
    selecting.classList.add('display-none');
    quiz.classList.remove('display-none');
  }

  function buildSubject() {
    introduction.innerHTML = `<h1>${data.info}</h1>`;

    let choose = '';
    Object.values(data.assess).forEach((item) => {
      let licences = '';
      Object.entries(item.licence).forEach(([key, licence]) => {
        licences += `<div class="licence wow fadeIn" data-wow-delay="0.2s" data-wow-duration="0.1s" id="${key}" data-licence="${key}">`;
        licences += `<p><strong>${key}:</strong> ${licence.title}</p>`;
        licences += `<p><strong>Số câu hỏi:</strong> ${licence.description} <strong>Thời gian:</strong> ${licence.time} phút</p>`;
        licences += `</div>`;
      });
      choose += `<div>
    <h5>${item.icon} ${item.title}</h5>
    ${licences}
    </div>`;
    });
    selecting.innerHTML = `<div id="warper">
  <h3>Học bằng hạng:</h3>
  ${choose}
  </div>`;
    const subjects = selecting.querySelectorAll('.licence');
    subjects.forEach((item) =>
      item.addEventListener('click', () => {
        const licence = item.getAttribute('data-licence');
        selectLicence(licence);
      }),
    );
    if (!selectedLicence) {
      quiz.classList.add('display-none');
      selecting.classList.remove('display-none');
      startButton.classList.remove('display-none');
      startButton.classList.add('disabled');
    }
    if (selectedQuestions.length > 0) {
      startTest();
    }
  }

  const quizContainer = document.getElementById('optionContainer');

  const resultsContainer = document.getElementById('results');

  const resultsTextContainer = document.getElementById('resultsContainer');

  confirmButton.addEventListener('click', () => showAnswer(true));

  nextButton.addEventListener('click', showNextSlide);

  backButton.addEventListener('click', showBackSlide);

  submitButton.addEventListener('click', showResults);

  startButton.addEventListener('click', startTest);

  playAgainButton.addEventListener('click', playAgain);

  submitButton.classList.add('display-none');
  playAgainButton.classList.add('display-none');
  nextButton.classList.add('display-none');
  backButton.classList.add('display-none');
  confirmButton.classList.add('display-none');

  buildSubject();
})();
