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

        
      const diagramContainer = document.getElementById('topics');
        renderBlockDiagram(topics.summary, diagramContainer);
        drawConnectors();
        const observer = new MutationObserver(() => {
            requestAnimationFrame(drawConnectors);
        });
        observer.observe(document.getElementById('diagram-wrapper'), {
        attributes: true,
        childList: true,
        subtree: true
        });
    }
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
