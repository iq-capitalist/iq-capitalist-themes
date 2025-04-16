// Основная функция для загрузки и обработки тем
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  
  // Установка начального состояния (загрузка)
  appContainer.innerHTML = `
    <div class="p-4 md:p-8 max-w-5xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-md text-center">
      <div class="flex justify-center items-center h-32 md:h-40">
        <div class="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-sky-600"></div>
      </div>
      <p class="text-sky-700 font-medium">Загрузка данных...</p>
    </div>
  `;
  
  // Загрузка данных
  fetch('themes.txt')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      // Преобразование текста в иерархию
      const hierarchy = parseThemesToHierarchy(data);
      // Отображение дерева тем
      renderThemeTree(hierarchy, appContainer);
    })
    .catch(error => {
      // Отображение ошибки
      appContainer.innerHTML = `
        <div class="p-4 md:p-8 max-w-5xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-md">
          <div class="bg-red-50 p-4 md:p-6 rounded-lg md:rounded-xl text-red-700 mb-4 md:mb-6 border border-red-100">
            <div class="flex items-start">
              <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-lg mr-3 md:mr-4 text-red-600">
                <i data-lucide="alert-triangle" class="w-4 h-4 md:w-5 md:h-5"></i>
              </div>
              <div>
                <p class="font-bold text-base md:text-lg mb-1 md:mb-2">Ошибка загрузки</p>
                <p class="text-red-700 text-sm md:text-base">${error.message}</p>
              </div>
            </div>
          </div>
          <div class="bg-sky-50 p-4 md:p-6 rounded-lg md:rounded-xl text-sky-800 border border-sky-100 text-sm md:text-base">
            <p class="flex items-center">
              <i data-lucide="info" class="mr-2 text-sky-600 w-4 h-4 md:w-5 md:h-5"></i>
              Проверьте, что файл themes.txt доступен в вашем репозитории и имеет правильный формат.
            </p>
          </div>
        </div>
      `;
      
      // Инициализируем иконки Lucide
      lucide.createIcons();
    });
});

// Функция для преобразования текста в иерархическую структуру
function parseThemesToHierarchy(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const hierarchy = {};
  
  lines.forEach(line => {
    const match = line.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\.\s+(.+)$/);
    if (match) {
      const [_, level1, level2, level3, level4, text] = match;
      
      // Создаем каждый уровень иерархии, если он еще не существует
      if (!hierarchy[level1]) {
        hierarchy[level1] = { text: '', children: {} };
      }
      
      if (level2 === '0' && level3 === '0' && level4 === '0') {
        hierarchy[level1].text = text;
      } else {
        if (!hierarchy[level1].children[level2]) {
          hierarchy[level1].children[level2] = { text: '', children: {} };
        }
        
        if (level3 === '0' && level4 === '0') {
          hierarchy[level1].children[level2].text = text;
        } else {
          if (!hierarchy[level1].children[level2].children[level3]) {
            hierarchy[level1].children[level2].children[level3] = { text: '', children: {} };
          }
          
          if (level4 === '0') {
            hierarchy[level1].children[level2].children[level3].text = text;
          } else {
            if (!hierarchy[level1].children[level2].children[level3].children[level4]) {
              hierarchy[level1].children[level2].children[level3].children[level4] = { text: text };
            }
          }
        }
      }
    }
  });
  
  return hierarchy;
}

// Отрисовка дерева тем
function renderThemeTree(themes, container) {
  container.innerHTML = `
    <div class="p-4 md:p-8 max-w-5xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-md">
      <h1 class="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-slate-900 pb-3 md:pb-4 border-b border-sky-200 flex flex-col md:flex-row items-center justify-center">
        <span class="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 mb-2 md:mb-0 md:mr-3 bg-sky-600 rounded-lg text-white">
          <i data-lucide="book-open" class="w-5 h-5"></i>
        </span>
        <span>Темы вопросов IQ Capitalist</span>
      </h1>
      <div class="bg-slate-50 p-3 md:p-6 rounded-lg md:rounded-xl border border-slate-200">
        <div id="theme-tree" class="space-y-1"></div>
      </div>
    </div>
  `;
  
  // Инициализация значков Lucide
  lucide.createIcons();
  
  const themeTreeContainer = document.getElementById('theme-tree');
  
  // Отрисовка корневых узлов
  Object.entries(themes).forEach(([key, data]) => {
    const nodeElement = createTreeNode(key, data, 1);
    themeTreeContainer.appendChild(nodeElement);
  });
}

// Создание узла дерева
function createTreeNode(nodeKey, nodeData, level) {
  const hasChildren = nodeData.children && Object.keys(nodeData.children).length > 0;
  
  // Определение стилей на основе уровня
  const getLevelStyle = () => {
    switch (level) {
      case 1:
        return 'text-lg md:text-xl font-bold text-slate-900 transition-colors duration-300';
      case 2:
        return 'text-base md:text-lg font-semibold text-slate-800 transition-colors duration-300';
      case 3:
        return 'text-sm md:text-base font-medium text-slate-700 transition-colors duration-300';
      case 4:
        return 'text-xs md:text-sm text-slate-700 transition-colors duration-300';
      default:
        return 'text-xs md:text-sm';
    }
  };
  
  const nodeElement = document.createElement('div');
  nodeElement.className = 'ml-1 md:ml-2 my-1 transition-duration-300';
  
  // Создаем верхнюю часть узла (заголовок)
  const nodeHeader = document.createElement('div');
  nodeHeader.className = 'flex items-start py-1 px-1 md:px-2 cursor-pointer rounded-lg transition-colors duration-200 hover:bg-slate-100';
  
  let toggleButton;
  
  // Создаем содержимое узла
  if (hasChildren) {
    toggleButton = document.createElement('div');
    toggleButton.className = 'flex-shrink-0 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-sky-600 bg-sky-50 p-1 mr-1 md:mr-2 rounded-md transition-colors duration-200';
    toggleButton.innerHTML = '<i data-lucide="chevron-right" class="w-3 h-3 md:w-4 md:h-4"></i>';
    nodeHeader.appendChild(toggleButton);
  } else {
    const spacer = document.createElement('div');
    spacer.className = 'flex-shrink-0 w-5 md:w-8';
    nodeHeader.appendChild(spacer);
  }
  
  const titleElement = document.createElement('div');
  titleElement.className = `${getLevelStyle()} truncate`;
  
  if (level > 1) {
    titleElement.innerHTML = `<span class="text-sky-600 font-normal mr-1">${nodeKey}.</span>${nodeData.text}`;
  } else {
    titleElement.textContent = nodeData.text;
  }
  nodeHeader.appendChild(titleElement);
  
  // Добавляем заголовок к узлу
  nodeElement.appendChild(nodeHeader);
  
  // Создаем контейнер для дочерних элементов (изначально скрыт)
  const childrenContainer = document.createElement('div');
  childrenContainer.className = 'ml-3 md:ml-4 border-l-2 border-slate-200 pl-1 md:pl-2 transition-all duration-300 hidden';
  nodeElement.appendChild(childrenContainer);
  
  // Если есть дочерние элементы, добавляем обработчик клика
  if (hasChildren) {
    nodeHeader.addEventListener('click', () => {
      const isExpanded = !childrenContainer.classList.contains('hidden');
      
      // Переключаем видимость дочерних элементов
      if (isExpanded) {
        // Сворачиваем ветку
        childrenContainer.classList.add('hidden');
        toggleButton.className = 'flex-shrink-0 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-sky-600 bg-sky-50 p-1 mr-1 md:mr-2 rounded-md transition-colors duration-200';
        toggleButton.innerHTML = '<i data-lucide="chevron-right" class="w-3 h-3 md:w-4 md:h-4"></i>';
      } else {
        // Разворачиваем ветку
        childrenContainer.classList.remove('hidden');
        toggleButton.className = 'flex-shrink-0 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-white bg-sky-600 p-1 mr-1 md:mr-2 rounded-md transition-colors duration-200';
        toggleButton.innerHTML = '<i data-lucide="chevron-down" class="w-3 h-3 md:w-4 md:h-4"></i>';
        
        // Отрисовываем дочерние узлы, если они еще не отрисованы
        if (childrenContainer.children.length === 0) {
          Object.entries(nodeData.children).forEach(([childKey, childData]) => {
            const childNode = createTreeNode(childKey, childData, level + 1);
            childrenContainer.appendChild(childNode);
          });
        }
      }
      
      // Обновляем иконки Lucide
      lucide.createIcons({
        attrs: {
          class: 'w-3 h-3 md:w-4 md:h-4'
        }
      });
    });
  }
  
  return nodeElement;
}
