let topicsData = {};
let questionsPool = [];
let currentQuestionIndex = 0;
let userAnswers = [];
var selectedTopics =[]
async function getTopics() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Richard190104/SchoolTopics/refs/heads/main/questions.json');
        const topics = await response.json();
        return topics;
    } catch (err) {
        console.error(err);
    }
}

getTopics().then(topics => {
    topicsData = topics;
    const keys = Object.keys(topics);
    const half = Math.ceil(keys.length / 2);
    const divs = document.querySelectorAll('.questionSelect');

    keys.forEach((key, idx) => {
        const btn = document.createElement('div');
        btn.classList.add('questionSelectBtn');
        btn.textContent = key;
        divs[idx < half ? 0 : 1].appendChild(btn);
        btn.addEventListener('click', () => {
            btn.classList.toggle('selected');
            if (btn.classList.contains('selected')) {
                selectedTopics.push(key);
            } else {
                selectedTopics = selectedTopics.filter(topic => topic !== key);
            }
        });
    });
});

const startBtn = document.querySelector('.buttonDiv');
const quizContainer = document.createElement('div');
document.body.appendChild(quizContainer);

startBtn.addEventListener('click', () => {
    // Gather questions from selected topics
    questionsPool = [];
    selectedTopics.forEach(topic => {
        if (topicsData[topic]) {
            questionsPool = questionsPool.concat(topicsData[topic]);
        }
    });
    questionsPool = questionsPool
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);
    currentQuestionIndex = 0;
    userAnswers = [];
    showQuestion();
});

function showQuestion() {
    quizContainer.innerHTML = '';
    if (currentQuestionIndex >= questionsPool.length) {
        quizContainer.innerHTML = `
            <div style="font-size:1.2em; font-weight:bold; margin-bottom:10px;">Test dokončený!</div>
            <div style="margin-bottom:10px;">Vaše odpovede:</div>
            <div style="padding-left:10px;">
                ${userAnswers.map((ua, i) => `
                    <div style="margin-bottom:4px;">
                        <span style="font-weight:bold;">Otázka ${i+1}:</span>
                        <span>Vaša odpoveď: <span style="color:${ua.selected === ua.correct ? 'green' : 'red'};">${ua.selected}</span></span>
                        <span>(Správna: <span style="color:green;">${ua.correct}</span>)</span>
                    </div>
                `).join('')}
            </div>
        `;
        return;
    }
    const q = questionsPool[currentQuestionIndex];
    const questionDiv = document.createElement('div');
    questionDiv.style.padding = '18px 24px';
    questionDiv.style.border = '1px solid #ddd';
    questionDiv.style.borderRadius = '8px';
    questionDiv.style.background = 'transparent'; 
    questionDiv.style.margin = '24px auto';
    questionDiv.style.maxWidth = '500px';
    questionDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';

    const headerDiv = document.createElement('div');
    headerDiv.style.fontWeight = 'bold';
    headerDiv.style.marginBottom = '8px';
    headerDiv.style.fontSize = '1.1em';
    headerDiv.textContent = `Otázka ${currentQuestionIndex + 1} z ${questionsPool.length}${q.topic ? ` (${q.topic})` : ''}`;
    questionDiv.appendChild(headerDiv);

    if (q.topic) {
        const topicDiv = document.createElement('div');
        topicDiv.style.fontStyle = 'italic';
        topicDiv.style.marginBottom = '4px';
        topicDiv.style.color = '#555';
        topicDiv.textContent = `Téma: ${q.topic}`;
        questionDiv.appendChild(topicDiv);
    }

    const questionTextDiv = document.createElement('div');
    questionTextDiv.textContent = q.question;
    questionTextDiv.style.marginBottom = '14px';
    questionTextDiv.style.fontSize = '1.05em';
    questionDiv.appendChild(questionTextDiv);

    const optionsDiv = document.createElement('div');
    optionsDiv.style.display = 'flex';
    optionsDiv.style.flexDirection = 'column';
    optionsDiv.style.gap = '8px';
    let optionSelected = false;
    Object.entries(q.options).forEach(([key, value]) => {
        const optBtn = document.createElement('button');
        optBtn.textContent = `${key}: ${value}`;
        optBtn.classList.add('optionBtn');
        optBtn.style.padding = '8px 12px';
        optBtn.style.borderRadius = '6px';
        optBtn.style.border = '1px solid #bbb';
        optBtn.style.cursor = 'pointer';
        optBtn.addEventListener('click', () => {
            if (optionSelected) return;
            document.querySelectorAll('.optionBtn').forEach(btn => btn.classList.remove('selected'));
            optBtn.classList.add('selected');
            optBtn.style.background = '#e6f7ff';

            // --- Submit functionality here ---
            optionSelected = true;
            const selectedKey = optBtn.textContent[0];
            document.querySelectorAll('.optionBtn').forEach(btn => {
                btn.disabled = true; 
                if (btn.textContent[0] === q.answer) {
                    btn.style.background = '#c8f7c5';
                    btn.style.color = '#222';
                }
                if (btn.classList.contains('selected') && btn.textContent[0] !== q.answer) {
                    btn.style.background = '#008fc7 ';
                    btn.style.color = '#222';
                }
            });
            userAnswers.push({ selected: selectedKey, correct: q.answer });

            const nextBtn = document.createElement('button');
            nextBtn.textContent = currentQuestionIndex + 1 === questionsPool.length ? 'Zobraziť výsledky' : 'Ďalej';
            nextBtn.classList.add('nextBtn');
            nextBtn.style.marginLeft = '14px';
            nextBtn.style.padding = '8px 18px';
            nextBtn.style.background = '#1976d2';
            nextBtn.style.color = '#fff';
            nextBtn.style.border = 'none';
            nextBtn.style.borderRadius = '6px';
            nextBtn.style.cursor = 'pointer';
            nextBtn.style.fontSize = '1em';
            nextBtn.addEventListener('click', () => {
                currentQuestionIndex++;
                showQuestion();
            });
            questionDiv.appendChild(nextBtn);
        });
        optBtn.addEventListener('blur', () => {
            if (!optBtn.classList.contains('selected')) {
                optBtn.style.background = '#fff';
            }
        });
        optionsDiv.appendChild(optBtn);
    });
    questionDiv.appendChild(optionsDiv);

    // Removed submit button

    quizContainer.appendChild(questionDiv);
}
