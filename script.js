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
    if (category !== 'summary') {
      const categoryElement = document.createElement('div');
      categoryElement.className = 'category';

      const topicClick = document.createElement('h2');
      topicClick.className = 'topicClick';
      topicClick.innerHTML = category;
      categoryElement.appendChild(topicClick);

      Object.entries(questions).forEach(([question, answer]) => {
        const topicElement = document.createElement('div');
        topicElement.className = 'topic';
        topicElement.innerHTML = `<h3>${question}</h3>`;

        const topicAnswer = document.createElement('p');
        topicAnswer.className = 'answer';
        topicAnswer.innerHTML = answer.replace(/;/g, '<br>');

        categoryElement.appendChild(topicElement);
        topicElement.appendChild(topicAnswer);

        topicElement.addEventListener('click', () => {
          topicAnswer.classList.toggle('expanded');
          requestAnimationFrame(() => {
            requestAnimationFrame(drawConnectors);
            });

        });

        topicClick.addEventListener('click', () => {
          topicElement.classList.toggle('expanded');
          requestAnimationFrame(() => {
            requestAnimationFrame(drawConnectors);
            });

        });
      });

      container.appendChild(categoryElement);
    } else {
      const treeData = topics.summary;

      const treeRoot = document.createElement('div');
      treeRoot.className = 'tree-root';

    function renderBlockDiagram(data, container) {
        const createNode = (node) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'tree-level';

        const box = document.createElement('div');
        box.className = 'node-box';
        let name = node.name;
       if (name.startsWith('TITLE')) {
        name = name.replace(/^TITLE\s*/, '');
        box.style.color = '#00c4ff';
        box.dataset.title = 'true'; 
        }

        box.textContent = name;
        wrapper.appendChild(box);

        if (node.children && node.children.length > 0) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'node-children';
        node.children.forEach(child => {
            const childNode = createNode(child);
            childrenContainer.appendChild(childNode);
        });
        wrapper.appendChild(childrenContainer);
        }

    return wrapper;
  };

  const tree = createNode(data);
  container.appendChild(tree);
}
function drawConnectors() {


  const svg = document.getElementById('connector-layer');
  svg.innerHTML = ''; 

  const levels = document.querySelectorAll('.tree-level');

  levels.forEach(parent => {
    const parentBox = parent.querySelector('.node-box');
    const children = parent.querySelectorAll(':scope > .node-children > .tree-level');

    children.forEach(child => {
      const childBox = child.querySelector('.node-box');
    if (childBox.dataset.title === 'true') {
  return; 
}
      

      const pRect = parentBox.getBoundingClientRect();
      const cRect = childBox.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', pRect.left + pRect.width / 2 - svgRect.left);
      line.setAttribute('y1', pRect.bottom - svgRect.top);
      line.setAttribute('x2', cRect.left + cRect.width / 2 - svgRect.left);
      line.setAttribute('y2', cRect.top - svgRect.top);
      line.setAttribute('stroke', '#888');
      line.setAttribute('stroke-width', '2');

      svg.appendChild(line);
    });
  });
}

      const map = document.createElement('div');
      map.className = 'choiceButton';
      map.innerHTML = '<h2>Vytvoriť myšlienkovú mapu a podcast</h2>';
     
      document.querySelector(".choices").appendChild(map);
   
      map.addEventListener('click', () => {
        createVoiceElement()
          const diagramContainer = document.getElementById('contentdiv');
          
          renderBlockDiagram(topics.summary, diagramContainer);
          drawConnectors();
      });
        
     
       
    }
  });
}

function createVoiceElement(){
   const diagramContainer = document.getElementById('contentdiv');
        diagramContainer.innerHTML = '';
       
          let oldPlayer = document.getElementById('audio-player-wrapper');
          if (oldPlayer) oldPlayer.remove();

          const playerWrapper = document.createElement('div');
          playerWrapper.id = 'audio-player-wrapper';
          playerWrapper.style.margin = '20px 0';

          const category = getCategoryFromURL();
          if (category) {
            console.log(category);
            const audio = document.createElement('audio');
            audio.id = 'audio-player';
            audio.src = `podcasts/${category.match(/\d+/)[0]}.wav`;
            audio.controls = true;
            audio.style.width = '100%';

            const timeline = document.createElement('input');
            timeline.type = 'range';
            timeline.min = 0;
            timeline.value = 0;
            timeline.step = 0.01;
            timeline.style.width = '100%';

            const timeDisplay = document.createElement('span');
            timeDisplay.style.marginLeft = '10px';

            const playBtn = document.createElement('button');
            playBtn.textContent = 'Play';

            const stopBtn = document.createElement('button');
            stopBtn.textContent = 'Stop';
            stopBtn.style.marginLeft = '5px';

            const rewindBtn = document.createElement('button');
            rewindBtn.textContent = '⏪';
            rewindBtn.style.marginLeft = '5px';

            const forwardBtn = document.createElement('button');
            forwardBtn.textContent = '⏩';
            forwardBtn.style.marginLeft = '5px';

            const controls = document.createElement('div');
            controls.appendChild(playBtn);
            controls.appendChild(stopBtn);
            controls.appendChild(rewindBtn);
            controls.appendChild(forwardBtn);
            controls.appendChild(timeDisplay);

            playerWrapper.appendChild(audio);
            playerWrapper.appendChild(timeline);
            playerWrapper.appendChild(controls);

            diagramContainer.appendChild(playerWrapper);

            audio.addEventListener('loadedmetadata', () => {
              timeline.max = audio.duration;
              timeDisplay.textContent = `0:00 / ${Math.floor(audio.duration / 60)}:${('0' + Math.floor(audio.duration % 60)).slice(-2)}`;
            });
            audio.addEventListener('timeupdate', () => {
              timeline.value = audio.currentTime;
              timeDisplay.textContent = `${Math.floor(audio.currentTime / 60)}:${('0' + Math.floor(audio.currentTime % 60)).slice(-2)} / ${Math.floor(audio.duration / 60)}:${('0' + Math.floor(audio.duration % 60)).slice(-2)}`;
            });

            timeline.addEventListener('input', () => {
              audio.currentTime = timeline.value;
            });

            playBtn.addEventListener('click', () => {
              if (audio.paused) {
                audio.play();
                playBtn.textContent = 'Pause';
              } else {
                audio.pause();
                playBtn.textContent = 'Play';
              }
            });
            audio.addEventListener('play', () => playBtn.textContent = 'Pause');
            audio.addEventListener('pause', () => playBtn.textContent = 'Play');

            stopBtn.addEventListener('click', () => {
              audio.pause();
              audio.currentTime = 0;
              playBtn.textContent = 'Play';
            });

            rewindBtn.addEventListener('click', () => {
              audio.currentTime = Math.max(0, audio.currentTime - 10);
            });

            forwardBtn.addEventListener('click', () => {
              audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
            });
          }

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
            const title = document.createElement('h1');
            title.innerHTML = categoryKey;
            
            title.style.textAlign = 'center';
            title.style.marginTop = '20px';
            document.querySelector(".headder").appendChild(title);
            displayTopics(topics[categoryKey]); 
           }
           else{
            Object.keys(topics).forEach(key => {
                const btn = document.createElement('div');
                btn.classList.add('topicClick');
                btn.style.color = 'white';
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

window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(drawConnectors);
});

  const toggleBtn = document.getElementById('themeToggle');

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');

    const isLight = document.body.classList.contains('light-mode');
    toggleBtn.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';

    requestAnimationFrame(() => {
      if (typeof drawConnectors === 'function') drawConnectors();
    });
  });
