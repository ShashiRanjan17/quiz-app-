const quizData = [
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    answer: "JavaScript"
  },
  {
    question: "What does CSS stand for?",
    options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading Simple Sheets", "Computer Style Sheets"],
    answer: "Cascading Style Sheets"
  },
  {
    question: "What does HTML stand for?",
    options: ["Hypertext Markup Language", "Hyperloop Machine Language", "Hyperlink Mark Language", "None of these"],
    answer: "Hypertext Markup Language"
  },
  {
    question: " There are ___ levels of heading in HTML.",
    options: ["Three", "Four", "Five", "Six"],
    answer: "Six"
  },
  {
    question: "Which technology is primarily responsible for the styling of web pages?",
    options: ["JavaScript", "HTML", "CSS", "Python"],
    answer: "CSS"
  }
];

let currentQ = 0;
let score = 0;
let timer;
let countdown = 15;
let userAnswers = [];

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const countdownEl = document.getElementById('countdown');
const resultBox = document.getElementById('resultBox');
const finalScore = document.getElementById('finalScore');
const reviewBox = document.getElementById('reviewBox');

function setRandomBackground() {
  const colors = [
    "#667eea,#764ba2", "#ff758c,#ff7eb3", "#43cea2,#185a9d",
    "#ff9a9e,#fad0c4", "#89f7fe,#66a6ff" 
  ];
  const pick = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.background = 'linear-gradient(135deg, ${pick})';
}

function startTimer() {
  countdown = 15;
  countdownEl.textContent = countdown < 10 ? "0" + countdown : countdown;
  timer = setInterval(() => {
    countdown--;
    countdownEl.textContent = countdown < 10 ? "0" + countdown : countdown;
    if (countdown <= 0) {
      clearInterval(timer);
      recordAnswer(null); 
      nextQuestion();
    }
  }, 1000);
}

function showQuestion() {
  clearInterval(timer);
  setRandomBackground();
  startTimer();

  const current = quizData[currentQ];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";

  current.options.forEach(option => {
    const li = document.createElement("li");
    li.textContent = option;
    li.onclick = () => {
      recordAnswer(option);
      if (option === current.answer) score++;
      scoreEl.textContent = 'Score: ${score}';
      nextQuestion();
    };
    optionsEl.appendChild(li);
  });
}

function recordAnswer(answer) {
  userAnswers.push({
    question: quizData[currentQ].question,
    correct: quizData[currentQ].answer,
    selected: answer
  });
}

function showReview() {
  reviewBox.innerHTML = "<h3>Review Questions:</h3>";
  userAnswers.forEach((item, idx) => {
    const div = document.createElement('div');
    div.classList.add('review-item');
    const correct = item.selected === item.correct;
    div.innerHTML = `
      <p><b>Q${idx + 1}:</b> ${item.question}</p>
      <p>Your Answer: <span style="color:${correct ? 'lightgreen' : 'red'}">${item.selected || "No Answer"}</span> ${correct ? '✔' : '❌'}</p>
      <p>Correct Answer: <span style="color:lightgreen">${item.correct}</span></p>
      <hr>
    `;
    reviewBox.appendChild(div);
  });
}

function nextQuestion() {
  currentQ++;
  if (currentQ < quizData.length) {
    showQuestion();
  } else {
    clearInterval(timer);
    document.querySelector('.quiz-box').style.display = 'none';
    resultBox.style.display = 'block';
    finalScore.textContent = score;
    showReview();
  }
}

showQuestion();

function saveScore() {
  const name = document.getElementById("username").value.trim() || "Anonymous";
  const newScore = { name: name, score: score };

  let scores = JSON.parse(localStorage.getItem("quizLeaderboard")) || [];
  scores.push(newScore);

  scores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
  localStorage.setItem("quizLeaderboard", JSON.stringify(scores));

  loadLeaderboard();
  document.getElementById("nameBox").style.display = "none";
}

function loadLeaderboard() {
  const leaderboardEl = document.getElementById("leaderboard");
  const scores = JSON.parse(localStorage.getItem("quizLeaderboard")) || [];
  leaderboardEl.innerHTML = scores.map(s => <li>${s.name} - ${s.score}</li>).join('');
}

function nextQuestion() {
  currentQ++;
  if (currentQ < quizData.length) {
    showQuestion();
  } else {
    clearInterval(timer);
    document.querySelector('.quiz-box').style.display = 'none';
    resultBox.style.display = 'block';
    finalScore.textContent = score;
    showReview();
    loadLeaderboard(); 
  }
}