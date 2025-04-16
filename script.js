// Основная функция для загрузки и обработки тем
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  
  // Установка начального состояния (загрузка)
  appContainer.innerHTML = `
    <div class="p-8 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl text-center">
      <div class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
      <p class="text-indigo-600 font-medium">Загрузка данных...</p>
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
        <div class="p-8 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl">
          <div class="bg-red-50 p-4 rounded-lg text-red-600 mb-4">
            <p class="font-bold">Ошибка загрузки</p>
            <p>${error.message}</p>
          </div>
          <p class="text-gray-600">
            Проверьте, что файл themes.txt доступен в вашем репозитории.
          </p>
        </div>
      `;
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
    <div class="p-8 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl">
      <h1 class="text-3xl font-bold mb-8 text-center text-indigo-900 shadow-sm pb-4 border-b-2 border-indigo-200 flex items-center justify-center">
        <span class="mr-3 text-indigo-600">
          <i data-lucide="book-open"></i>
        </span>
        <span>Темы вопросов игры IQ Capitalist</span>
      </h1>
      <div class="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-inner border border-indigo-100">
        <div class="mb-4 p-3 bg-white bg-opacity-70 rounded-lg text-sm text-gray-600 italic shadow-sm">
          Нажмите на любую категорию, чтобы развернуть или свернуть её содержимое. Наведите курсор для выделения.
        </div>
        <div id="theme-tree"></div>
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
        return 'text-xl font-bold text-indigo-800 transition-colors duration-300';
      case 2:
        return 'text-lg font-semibold text-indigo-700 transition-colors duration-300';
      case 3:
        return 'text-base font-medium text-indigo-600 transition-colors duration-300';
      case 4:
        return 'text-sm text-indigo-500 transition-colors duration-300';
      default:
        return 'text-sm';
    }
  };
  
  const nodeElement = document.createElement('div');
  nodeElement.className = 'ml-2 my-1 transition-all duration-300 ease-in-out';
  
  // Создаем верхнюю часть узла (заголовок)
  const nodeHeader = document.createElement('div');
  nodeHeader.className = 'flex items-start py-1 px-2 cursor-pointer rounded-lg transition-all duration-200 hover:bg-indigo-100';
  
  let toggleButton;
  
  // Создаем содержимое узла
  if (hasChildren) {
    toggleButton = document.createElement('div');
    toggleButton.className = 'text-indigo-400 bg-transparent p-1 mr-2 rounded-md transition-colors duration-300';
    toggleButton.innerHTML = '<i data-lucide="chevron-right" class="w-4 h-4"></i>';
    nodeHeader.appendChild(toggleButton);
  } else {
    const spacer = document.createElement('div');
    spacer.className = 'w-7';
    nodeHeader.appendChild(spacer);
  }
  
  const titleElement = document.createElement('div');
  titleElement.className = getLevelStyle();
  if (level > 1) {
    titleElement.innerHTML = `<span class="text-gray-500 font-normal mr-1">${nodeKey}.</span>${nodeData.text}`;
  } else {
    titleElement.textContent = nodeData.text;
  }
  nodeHeader.appendChild(titleElement);
  
  // Добавляем заголовок к узлу
  nodeElement.appendChild(nodeHeader);
  
  // Создаем контейнер для дочерних элементов (изначально скрыт)
  const childrenContainer = document.createElement('div');
  childrenContainer.className = 'ml-4 border-l-2 border-indigo-200 pl-2 transition-all duration-300 hidden';
  nodeElement.appendChild(childrenContainer);
  
  // Добавляем эффект при наведении
  nodeElement.addEventListener('mouseenter', () => {
    nodeHeader.classList.add('bg-indigo-50', 'rounded-lg');
  });
  
  nodeElement.addEventListener('mouseleave', () => {
    nodeHeader.classList.remove('bg-indigo-50', 'rounded-lg');
  });
  
  // Если есть дочерние элементы, добавляем обработчик клика
  if (hasChildren) {
    nodeHeader.addEventListener('click', () => {
      const isExpanded = !childrenContainer.classList.contains('hidden');
      
      // Переключаем видимость дочерних элементов
      if (isExpanded) {
        childrenContainer.classList.add('hidden');
        toggleButton.className = 'text-indigo-400 bg-transparent p-1 mr-2 rounded-md transition-colors duration-300';
        toggleButton.innerHTML = '<i data-lucide="chevron-right" class="w-4 h-4"></i>';
      } else {
        childrenContainer.classList.remove('hidden');
        toggleButton.className = 'text-indigo-600 bg-indigo-100 p-1 mr-2 rounded-md transition-colors duration-300';
        toggleButton.innerHTML = '<i data-lucide="chevron-down" class="w-4 h-4"></i>';
        
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
          class: 'w-4 h-4'
        }
      });
    });
  }
  
  return nodeElement;
}
