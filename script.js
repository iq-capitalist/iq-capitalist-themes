// Основная функция для загрузки и обработки тем
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  
  // Установка начального состояния (загрузка)
  appContainer.innerHTML = `
    <div class="p-8 max-w-5xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(14,165,233,0.15)] text-center">
      <div class="flex flex-col justify-center items-center h-60">
        <div class="relative w-20 h-20 mb-6">
          <div class="absolute inset-0 animate-spin rounded-full h-20 w-20 border-b-4 border-sky-600"></div>
          <div class="absolute inset-0 animate-spin rounded-full h-20 w-20 border-r-4 border-cyan-500" style="animation-duration: 1.5s;"></div>
          <div class="absolute inset-0 animate-spin rounded-full h-20 w-20 border-t-4 border-emerald-400" style="animation-duration: 2s;"></div>
        </div>
        <p class="text-sky-600 font-medium text-xl">Загрузка данных...</p>
        <p class="text-sky-400 text-sm mt-2">Подготавливаем информацию о темах</p>
      </div>
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
        <div class="p-8 max-w-5xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(14,165,233,0.15)]">
          <div class="bg-red-50 p-6 rounded-xl text-red-600 mb-6 border border-red-100 shadow-sm">
            <div class="flex items-start">
              <div class="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg mr-4 text-red-500">
                <i data-lucide="alert-triangle"></i>
              </div>
              <div>
                <p class="font-bold text-lg mb-2">Ошибка загрузки</p>
                <p class="text-red-500">${error.message}</p>
              </div>
            </div>
          </div>
          <div class="bg-sky-50 p-6 rounded-xl text-sky-700 border border-sky-100">
            <p class="flex items-center">
              <i data-lucide="info" class="mr-2 text-sky-500"></i>
              Проверьте, что файл themes.txt доступен в вашем репозитории и имеет правильный формат.
            </p>
          </div>
        </div>
      `;
      
      // Инициализируем иконки Lucide
      lucide.createIcons();
                <p class="text-red-500">${error.message}</p>
              </div>
            </div>
          </div>
          <div class="bg-violet-50 p-6 rounded-xl text-violet-700 border border-violet-100">
            <p class="flex items-center">
              <i data-lucide="info" class="mr-2 text-violet-500"></i>
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
    <div class="p-8 max-w-5xl mx-auto scale-on-hover backdrop-blur-sm bg-white/90 rounded-3xl shadow-[0_20px_50px_rgba(14,165,233,0.15)] transition-all duration-300">
      <h1 class="relative text-3xl font-bold mb-10 text-center text-sky-900 pb-6 flex items-center justify-center overflow-hidden">
        <div class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-500 to-emerald-600"></div>
        <span class="flex items-center justify-center w-12 h-12 mr-4 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-xl text-white shadow-lg">
          <i data-lucide="book-open"></i>
        </span>
        <span>Темы вопросов IQ Capitalist</span>
      </h1>
      <div class="bg-gradient-to-br from-sky-100 via-white to-emerald-100 p-8 rounded-2xl shadow-[inset_0_2px_20px_rgba(14,165,233,0.1)] border border-sky-200">
        <div class="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl text-sm text-sky-700 shadow-sm border border-sky-100 transition-all duration-300 hover:shadow-md">
          <div class="flex items-center">
            <i data-lucide="info" class="w-5 h-5 mr-2 text-sky-500"></i>
            <span>Нажмите на категорию, чтобы развернуть или свернуть её содержимое. Наведите курсор для выделения.</span>
          </div>
        </div>
        <div id="theme-tree" class="space-y-2"></div>
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
        return 'text-xl font-bold text-sky-800 transition-colors duration-300';
      case 2:
        return 'text-lg font-semibold text-sky-700 transition-colors duration-300';
      case 3:
        return 'text-base font-medium text-sky-600 transition-colors duration-300';
      case 4:
        return 'text-sm text-emerald-600 transition-colors duration-300';
      default:
        return 'text-sm';
    }
  };
  
  const nodeElement = document.createElement('div');
  nodeElement.className = 'ml-2 my-1 transition-all duration-300 ease-in-out';
  
  // Создаем верхнюю часть узла (заголовок)
  const nodeHeader = document.createElement('div');
  nodeHeader.className = 'flex items-start py-2 px-3 cursor-pointer rounded-xl transition-all duration-300 hover:bg-sky-100/80 hover:shadow-sm';
  
  let toggleButton;
  
  // Создаем содержимое узла
  if (hasChildren) {
    toggleButton = document.createElement('div');
    toggleButton.className = 'flex items-center justify-center w-6 h-6 text-sky-400 bg-sky-50 p-1 mr-3 rounded-lg transition-all duration-300 transform';
    toggleButton.innerHTML = '<i data-lucide="chevron-right" class="w-4 h-4"></i>';
    nodeHeader.appendChild(toggleButton);
  } else {
    const spacer = document.createElement('div');
    spacer.className = 'w-9';
    nodeHeader.appendChild(spacer);
  }
  
  const titleElement = document.createElement('div');
  titleElement.className = getLevelStyle();
  
  // Добавляем дополнительные стили в зависимости от уровня
  if (level === 1) {
    titleElement.classList.add('py-1', 'px-2', 'rounded-lg', 'bg-gradient-to-r', 'from-sky-500/10', 'to-transparent');
  }
  
  if (level > 1) {
    titleElement.innerHTML = `<span class="text-sky-400 font-normal mr-1">${nodeKey}.</span>${nodeData.text}`;
  } else {
    titleElement.textContent = nodeData.text;
  }
  nodeHeader.appendChild(titleElement);
  
  // Добавляем заголовок к узлу
  nodeElement.appendChild(nodeHeader);
  
  // Создаем контейнер для дочерних элементов (изначально скрыт)
  const childrenContainer = document.createElement('div');
  childrenContainer.className = 'ml-4 border-l-2 border-sky-200 pl-3 transition-all duration-500 ease-in-out hidden';
  nodeElement.appendChild(childrenContainer);
  
  // Добавляем эффект при наведении
  nodeElement.addEventListener('mouseenter', () => {
    nodeHeader.classList.add('bg-sky-50/80', 'shadow-sm');
  });
  
  nodeElement.addEventListener('mouseleave', () => {
    nodeHeader.classList.remove('bg-sky-50/80', 'shadow-sm');
  });
  
  // Если есть дочерние элементы, добавляем обработчик клика
  if (hasChildren) {
    nodeHeader.addEventListener('click', () => {
      const isExpanded = !childrenContainer.classList.contains('hidden');
      
      // Переключаем видимость дочерних элементов
      if (isExpanded) {
        // Сворачиваем ветку
        childrenContainer.classList.add('hidden');
        toggleButton.className = 'flex items-center justify-center w-6 h-6 text-sky-400 bg-sky-50 p-1 mr-3 rounded-lg transition-all duration-300';
        toggleButton.innerHTML = '<i data-lucide="chevron-right" class="w-4 h-4"></i>';
        toggleButton.style.transform = 'rotate(0deg)';
      } else {
        // Разворачиваем ветку
        childrenContainer.classList.remove('hidden');
        toggleButton.className = 'flex items-center justify-center w-6 h-6 text-white bg-gradient-to-r from-sky-500 to-emerald-500 p-1 mr-3 rounded-lg transition-all duration-300 shadow-sm';
        toggleButton.innerHTML = '<i data-lucide="chevron-down" class="w-4 h-4"></i>';
        toggleButton.style.transform = 'rotate(180deg) translateY(2px)';
        
        // Добавляем анимацию появления
        setTimeout(() => {
          // Отрисовываем дочерние узлы, если они еще не отрисованы
          if (childrenContainer.children.length === 0) {
            Object.entries(nodeData.children).forEach(([childKey, childData]) => {
              const childNode = createTreeNode(childKey, childData, level + 1);
              childrenContainer.appendChild(childNode);
            });
          }
          
          // Обновляем иконки Lucide
          lucide.createIcons({
            attrs: {
              class: 'w-4 h-4'
            }
          });
        }, 50);
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
