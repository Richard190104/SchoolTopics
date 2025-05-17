async function getTopics() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Richard190104/SchoolTopics/refs/heads/main/topics.json');
        const topics = await response.json();
        return topics;
    } catch (err) {
        console.error(err);
    }
}

var selectedTopics = [];

getTopics().then(topics => {
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