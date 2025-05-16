async function getTopics() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Richard190104/SchoolTopics/refs/heads/main/topics.json');
        const topics = await response.json();
        return topics;
    } catch (err) {
        console.error(err);
    }
}

   function displayTopics(topics) {
      const container = document.getElementById('topics');
      container.innerHTML = ''; 

      Object.entries(topics).forEach(([category, questions]) => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        const topicClick = document.createElement('h2');
        topicClick.className = 'topicClick';
        topicClick.innerHTML = category;
        categoryElement.appendChild(topicClick);
         Object.entries(questions).forEach(([question, answer]) => {
          const topicElement = document.createElement('div');
          topicElement.className = 'topic';
          topicElement.innerHTML = `
            <h3>${question}</h3>
            `;
          const topicAnswer = document.createElement('p');
          topicAnswer.className = 'answer';
          topicAnswer.innerHTML = answer.replace(/;/g, '<br>');
          categoryElement.appendChild(topicElement);
          topicElement.appendChild(topicAnswer);

          topicElement.addEventListener('click', () => {
            topicAnswer.classList.toggle('expanded');
          });

          topicClick.addEventListener('click', () => {
          topicElement.classList.toggle('expanded');
        }); 
        });
        

        container.appendChild(categoryElement);
      });
    }

function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category');
}

const categoryKey = getCategoryFromURL();

getTopics().then(topics => {
    if (topics) {
         if (topics) {
           if (topics && categoryKey && topics[categoryKey]) {
            console.log(topics[categoryKey]);
                displayTopics(topics[categoryKey]); 
           }
           else{
            Object.keys(topics).forEach(key => {
                const btn = document.createElement('div');
                btn.classList.add('topicClick');
                btn.textContent = key;
                btn.onclick = () => {
                      window.location.href = `tema.html?category=${encodeURIComponent(key)}`;

                };
                document.getElementById('topics').appendChild(btn);
            });
           }
            
       
    }        
    }
});
