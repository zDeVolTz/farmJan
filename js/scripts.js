
let dataIndexAsacol = 0;
const addButtonsTemp = [
    {
        image: 'url("slides/Enterol v3/Е (40).png")',
        index: 1
    },
    {
        image: 'url("slides/Enterol v3/Е (39).png")',
        index: 2
    },
    {
        image: 'url("slides/Enterol v3/Е (38).png")',
        index: 3
    },
    {
        image: 'url("slides/Enterol v3/Е (35).png")',
        index: 4
    },
    {
        image: 'url("slides/Enterol v3/Е (36).png")',
        index: 5
    },
    {
        image: 'url("slides/Enterol v3/Е (33).png")',
        index: 6
    },
    {
        image: 'url("slides/Enterol v3/Е (34).png")',
        index: 7
    },
    {
        image: 'url("slides/Enterol v3/Е (32).png")',
        index: 8
    },
    {
        image: 'url("slides/Enterol v3/Е (41).png")',
        index: 9
    },
    {
        image: 'url("slides/Enterol v3/Е (43).png")',
        index: 10
    },
    {
        image: 'url("slides/Enterol v3/Е (45).png")',
        index: 11
    },
    {
        image: 'url("slides/Enterol v3/Е (48).png")',
        index: 12
    },
];

function checkSpecAnimation(slide) {
    if (slide.special_animation === 'Special') {
        return slide.animation_text;
    } else return null;
}

function generateSlides(slideSet) {
    return slideSet.map((slide, index) => {
        // Проверка наличия специальной анимации
        const animationText = checkSpecAnimation(slide);
        const text = animationText !== null ? animationText : "";

        const section = document.createElement('section');
        section.setAttribute('data-type', slide.type || '');
        section.setAttribute('data-index', index + 1);
        section.id = `slide-${index + 1}`;
        section.className = 'slide-container';
        section.style.cssText = `
            display: flex !important;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
        `;

        const container = document.createElement('div');
        container.className = 'background-container';
        container.setAttribute('data-src', slide.image);
        container.style.backgroundImage = `url('${slide.image}')`; // Сразу загружаем изображение

        // Проверяем соотношение сторон и добавляем класс mobile
        if (window.innerHeight > window.innerWidth) {
            container.classList.add('mobile');
        }

        container.innerHTML = `
            <button class="invisible-button" onclick="Reveal.slide(0);"></button>
            <button class="invisible-left-button" onclick="Reveal.prev();"></button>
            <button class="invisible-right-button" onclick="Reveal.next();"></button>
            ${text}
        `;

        section.appendChild(container);
        return section.outerHTML;
    }).join('');
}

function loadSlides(setName) {
    window.imageIndex = 0;
    window.globalImageQueue = [];
    window.imageStates = {};
    const slidesContainer = document.getElementById('slides-container');
    const reveal = document.querySelector('.reveal');

    // Удаление старых слайдов
    Array.from(slidesContainer.children).forEach((slide, index) => {
        if (index > 0) {
            slidesContainer.removeChild(slide);
        }
    });

    // Генерация новых слайдов
    const newSlides = generateSlides(mapping[setName]);


    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newSlides;

    // Добавление новых слайдов в контейнер
    Array.from(tempDiv.children).forEach(slide => {
        slidesContainer.appendChild(slide);
    });

    // Применяем стиль для reveal
    reveal.style.display = 'flex';

    getDataIndexForAsacolSlide();
    // Синхронизация с Reveal.js
    Reveal.next();
    Reveal.sync(); // Синхронизация
    Reveal.layout();
    Reveal.slide(1); // Переход на первый слайд
}


function getDataIndexForAsacolSlide() {
    // Найдем все секции
    const slides = document.querySelectorAll('.reveal .slides section');
    
    // Пройдем по всем секциям
    slides.forEach((slide, index) => {
        // Если у секции есть атрибут data-type="Asacol"
        if (slide.getAttribute('data-type') === 'Asacol') {
            // Выведем data-index этой секции
            localStorage.setItem('dataIndexAsacol', index);
            console.log(localStorage.getItem('dataIndexAsacol'));
        }
    });
}


function addButtonsToBackgroundContainer(slideId, buttons) {
    const section = document.getElementById(slideId); // Находим section по ID
    if (section) {
        const backgroundContainer = section.querySelector('.background-container'); // Находим div с классом background-container
        if (backgroundContainer) {
            buttons.forEach(button => {
                // Проверяем, существует ли кнопка с таким ID
                if (!backgroundContainer.querySelector(`#${button.id}`)) {
                    const btn = document.createElement('button');
                    btn.className = 'dynamic-button';
                    btn.id = button.id;
                    btn.style.position = 'absolute';
                    btn.style.left = `${button.x}%`;
                    btn.style.top = `92%`;
                    btn.style.width = `${button.width}%`;
                    btn.style.height = `${button.height}%`;
                    btn.style.background = `url(${button.icon}) no-repeat center`;
                    btn.style.backgroundSize = 'contain';
                    btn.style.border = 'none';
                    btn.style.cursor = 'pointer';
                    btn.setAttribute('onclick', button.action);

                    backgroundContainer.appendChild(btn); // Добавляем кнопку в background-container
                } else {
                    console.warn(`Кнопка с ID ${button.id} уже существует на слайде ${slideId}`);
                }
            });
        } else {
            console.error('background-container не найден в section:', slideId);
        }
        const bgImage = backgroundContainer.style.backgroundImage;
        const matchingSlide = addButtonsTemp.find(item => item.image === bgImage);

        if (matchingSlide) {
            const extraDiv = document.createElement('div');
            extraDiv.id = `extra-${matchingSlide.index}`;
            extraDiv.className = 'extra-content';
            
            extraDiv.addEventListener('click', function () {
                addTemporarySlide({ image: 'slides/Enterol2560/E (Ssi).png', type: 'Enterol' });
            });

            if (!backgroundContainer.querySelector(`#${extraDiv.id}`)) {
                backgroundContainer.appendChild(extraDiv);
            }
        }

    } else {
        console.error('Section с ID', slideId, 'не найден');
    }
}

Reveal.on('slidechanged', event => {
    const currentSlideId = event.currentSlide.id;
    const slideType = event.currentSlide.dataset.type;
    if (slideButtonConfig[slideType]) {
        addButtonsToBackgroundContainer(currentSlideId, slideButtonConfig[slideType]);
    }
});

let isMouseDown = false; // Флаг для проверки зажатия кнопки мыши

document.addEventListener('mousedown', () => {
    isMouseDown = true;
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

function handleMouseMove(event) {
    if (!isMouseDown) return; // Если кнопка мыши не зажата, ничего не делаем
    if (event.target.classList.contains('no-swipe-zone')) return;
    const humans = document.querySelectorAll('.human');
    const percentageElement = document.querySelector('#percentage');
    let paintedCount = 0;

    humans.forEach(human => {
        const rect = human.getBoundingClientRect();
        if (event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom) {
            if (!human.classList.contains('processed')) {
                if (!human.classList.contains('painted')) {
                    human.classList.add('painted');
                    human.style.backgroundImage = 'url(slides/Asacol/A1/231239.png)';
                } else {
                    human.classList.remove('painted');
                    human.style.backgroundImage = '';
                }
                human.classList.add('processed');
            }
        }
    });

    paintedCount = document.querySelectorAll('.human.painted').length;
    const totalHumans = humans.length;
    const percentage = Math.round((paintedCount / totalHumans) * 100);

    if (paintedCount > 0) {
        percentageElement.style.display = 'block';
        percentageElement.textContent = `${percentage}%`;
    } else {
        percentageElement.style.display = 'none';
    }
}

function handleTouchMove(event) {
    if (event.target.classList.contains('no-swipe-zone')) {
        event.preventDefault(); // Блокируем перелистывание
        return;
    }
    const humans = document.querySelectorAll('.human');
    const percentageElement = document.querySelector('#percentage');
    let paintedCount = 0;
    const touch = event.touches[0];

    humans.forEach(human => {
        const rect = human.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            if (!human.classList.contains('processed')) {
                if (!human.classList.contains('painted')) {
                    human.classList.add('painted');
                    human.style.backgroundImage = 'url(slides/Asacol/A1/231239.png)';
                } else {
                    human.classList.remove('painted');
                    human.style.backgroundImage = '';
                }
                human.classList.add('processed');
            }
        }
    });

    paintedCount = document.querySelectorAll('.human.painted').length;
    const totalHumans = humans.length;
    const percentage = Math.round((paintedCount / totalHumans) * 100);

    if (paintedCount > 0) {
        percentageElement.style.display = 'block';
        percentageElement.textContent = `${percentage}%`;
    } else {
        percentageElement.style.display = 'none';
    }
}

function resetProcessed() {
    const humans = document.querySelectorAll('.human');
    humans.forEach(human => {
        human.classList.remove('processed');
    });
}

document.addEventListener('mouseup', resetProcessed);
document.addEventListener('touchend', resetProcessed);


 function disableRevealSwipe() {
        Reveal.configure({ touch: false });
    }

function enableRevealSwipe() {
    Reveal.configure({ touch: true });
}

Reveal.on('slidechanged', (event) => {
    if (event.currentSlide.querySelector('.no-swipe-zone')) {
        disableRevealSwipe();
    } else {
        enableRevealSwipe();
    }
});

// Функция для проверки размеров экрана и применения стилей

function applyStyles() {
    // Соотношение сторон, например 16:9
    const aspectRatio = 16 / 9;

    // Вычисляем новый масштаб
    let scaleFactor = window.innerHeight / 1000; // Пусть 1000px - это 100% высоты

    // Применяем масштабирование и следим за пропорциями
    let container = document.getElementById('container'); // замените на id вашего контейнера
    if (container) {
        let newWidth = window.innerHeight * aspectRatio;

        // Если ширина выходит за пределы экрана, корректируем по ширине
        if (newWidth > window.innerWidth) {
            newWidth = window.innerWidth;
            scaleFactor = window.innerWidth / 1000; // Масштабируем по ширине
        }

        // Применяем стили для контейнера
        container.style.width = `${newWidth}px`;
        container.style.height = `${window.innerHeight}px`; // Высота всегда 100%
        container.style.transform = `scale(${scaleFactor})`;
        container.style.transformOrigin = 'top left'; // Масштабируем от верхнего левого угла
    }
}

function checkAspectRatio() {
    const containers = document.querySelectorAll('.background-container'); // Находим все элементы с классом background-container
    if (!containers.length) return;

    containers.forEach(container => {
        if (window.innerHeight > window.innerWidth) {
            container.classList.add('mobile');
        } else {
            container.classList.remove('mobile');
        }
    });
}

// Запускаем проверку при загрузке страницы и изменении размеров окна
window.addEventListener('load', checkAspectRatio);
window.addEventListener('resize', checkAspectRatio);

// Проверяем размеры экрана при загрузке страницы
applyStyles();




// Обрабатываем изменение размеров окна
window.addEventListener('resize', applyStyles);

function adjustScale() {
    const wrapper = document.querySelector('.special-content-wrapper');
    const topElement = document.querySelector('.image-f.img-1');
    if (!wrapper) return;  // Если элемент еще не появился, выходим из функции
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Базовый масштаб 2 и минимальная ширина для скейла 1
    const minWidth = 1000;
    const maxWidth = 1920;  // Максимальная ширина, при которой скейл будет равен 2

    // Если высота экрана больше ширины, применяем другие значения
    let scale, topPercent;

    if (screenHeight > screenWidth) {
        // Для портретной ориентации (когда высота больше ширины)
        scale = 1 + ((2 - 1) * (screenHeight - minWidth) / (maxWidth - minWidth)); // Меняется масштаб в зависимости от высоты
        scale = Math.max(0.7, Math.min(0.5, scale));  // Ограничиваем масштаб от 1 до 2

        topPercent = 10 + ((40 - 10) * (screenHeight - minWidth) / (maxWidth - minWidth));  // Меняется top для вертикального экрана
        topPercent = Math.max(2, Math.min(11, topPercent));  // Ограничиваем top от 10% до 40%
    } else {
        // Для ландшафтной ориентации (когда ширина больше высоты)
        // Вычисляем масштаб в зависимости от ширины экрана
        scale = 2 - ((2 - 1) * (maxWidth - screenWidth) / (maxWidth - minWidth));
        scale = Math.max(1, Math.min(2, scale));  // Ограничиваем масштаб от 1 до 2

        topPercent = 30 - ((30 - 20) * (maxWidth - screenWidth) / (maxWidth - minWidth));
        topPercent = Math.max(20, Math.min(30, topPercent));  // Ограничиваем top от 20% до 30%
    }
  
    // Применяем новый масштаб
    wrapper.style.transform = `scale(${scale})`;
  
    // Применяем новый top
    topElement.style.top = `${topPercent}%`;
}
  
  // Добавляем слушатель события для изменения размера окна
  window.addEventListener('resize', adjustScale);
  
  // Используем MutationObserver, чтобы отслеживать добавление элемента на страницу
  const observer2 = new MutationObserver(() => {
    const wrapper = document.querySelector('.special-content-wrapper');
    if (wrapper) {
      adjustScale();  // Если элемент найден, сразу применяем масштаб
    }
  });
  
  // Настроим наблюдатель на изменения в DOM
  observer2.observe(document.body, { childList: true, subtree: true });


  function toggleActiveClass(event) {
      // Находим все элементы с классом .m_14-btn
      const buttons = document.querySelectorAll('.m_14-btn');
      
      // Убираем класс active у всех кнопок
      buttons.forEach(button => button.classList.remove('active'));

      // Добавляем класс active только на ту, по которой кликнули
      event.target.classList.add('active');
  }

  