// Ждем загрузки дерева разметки (DOM)
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. УМНОЕ TOAST-УВЕДОМЛЕНИЕ ВМЕСТО ALERT()
    // ==========================================
    const showToast = (message) => {
        const toast = document.getElementById('toastNotification');
        const toastMsg = document.getElementById('toastMessage');
        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('show');
            
            // Плавное скрытие уведомления через 3 секунды
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    };

    // ==========================================
    // 2. ОТКРЫТИЕ И ЗАКРЫТИЕ МОДАЛЬНЫХ ОКОН
    // ==========================================
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex'; // Подготовка к отображению
            setTimeout(() => {
                modal.classList.add('active'); // Запуск плавного проявления
            }, 10);
        }
    };

    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active'); // Запуск плавного исчезновения
            setTimeout(() => {
                modal.style.display = 'none'; // Полное отключение отображения
            }, 300);
        }
    };

    // Общая функция привязки событий к кнопкам
    const setupModalTrigger = (btnId, modalId) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => openModal(modalId));
        }
    };

    const setupModalClose = (closeBtnId, modalId) => {
        const btn = document.getElementById(closeBtnId);
        if (btn) {
            btn.addEventListener('click', () => closeModal(modalId));
        }
    };

    // Активируем триггеры модалок
    setupModalTrigger('openAuthBtn', 'authModal');
    setupModalTrigger('vacanciesLink', 'vacanciesModal');
    setupModalTrigger('calculatorLink', 'calculatorModal');

    // Активируем кнопки закрытия (крестики)
    setupModalClose('closeAuthModal', 'authModal');
    setupModalClose('closeVacanciesModal', 'vacanciesModal');
    setupModalClose('closeCalculatorModal', 'calculatorModal');

    // Закрытие модального окна при клике на темный фон вокруг карточки
    window.addEventListener('click', (e) => {
        const overlays = document.querySelectorAll('.modal-overlay');
        overlays.forEach(overlay => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    // Имитация откликов на вакансии без alert
    const frontendBtn = document.getElementById('applyFrontendBtn');
    const designBtn = document.getElementById('applyDesignBtn');
    
    if (frontendBtn) {
        frontendBtn.addEventListener('click', () => {
            showToast('Отклик принят! Наш HR-менеджер свяжется с вами.');
            closeModal('vacanciesModal');
        });
    }
    if (designBtn) {
        designBtn.addEventListener('click', () => {
            showToast('Ваш отклик на вакансию UI/UX успешно отправлен.');
            closeModal('vacanciesModal');
        });
    }

    // ==========================================
    // 3. ИНТЕРАКТИВНЫЕ ВКЛАДКИ (TAB SWITCHER)
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-trigger');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.modal-card');
            
            // Снимаем классы активности со всех соседних кнопок и панелей
            card.querySelectorAll('.tab-trigger').forEach(btn => btn.classList.remove('active'));
            card.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

            // Добавляем класс активности текущей нажатой кнопке
            button.classList.add('active');
            
            // Находим целевую вкладку по атрибуту data-tab
            const targetId = button.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Обработка форм авторизации
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Вы успешно вошли в Личный Кабинет!');
            closeModal('authModal');
            loginForm.reset();
        });
    }
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Регистрация успешно пройдена!');
            closeModal('authModal');
            registerForm.reset();
        });
    }

    // ==========================================
    // 4. ПЕРЕКЛЮЧАТЕЛЬ СВЕТЛОЙ И ТЁМНОЙ ТЕМЫ
    // ==========================================
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('.theme-icon') : null;

    // Сверяемся с кэшем браузера (localStorage)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            
            // Сохраняем выбор в кэш
            localStorage.setItem('theme', isLight ? 'light' : 'dark');

            // Обновляем иконку переключателя
            if (themeIcon) {
                if (isLight) {
                    themeIcon.classList.replace('fa-moon', 'fa-sun');
                    showToast('Светлая тема активирована!');
                } else {
                    themeIcon.classList.replace('fa-sun', 'fa-moon');
                    showToast('Тёмная тема активирована!');
                }
            }
        });
    }

    // ==========================================
    // 5. КАЛЬКУЛЯТОР СТОИМОСТИ ПРОЕКТА
    // ==========================================
    const pagesRange = document.getElementById('pagesRange');
    const pagesValue = document.getElementById('pagesValue');
    const optionDesign = document.getElementById('optionDesign');
    const optionSEO = document.getElementById('optionSEO');
    const optionSupport = document.getElementById('optionSupport');
    const speedSelect = document.getElementById('speedSelect');
    const totalPrice = document.getElementById('totalPrice');

    const updateCalculations = () => {
        const basePagePrice = 10000;
        const totalPages = parseInt(pagesRange.value);
        let currentCost = totalPages * basePagePrice;

        if (optionDesign && optionDesign.checked) currentCost += 15000;
        if (optionSEO && optionSEO.checked) currentCost += 8000;
        if (optionSupport && optionSupport.checked) currentCost += 12000;

        if (speedSelect) {
            const speedModifier = parseFloat(speedSelect.value);
            currentCost = currentCost * speedModifier;
        }

        if (totalPrice) {
            totalPrice.textContent = currentCost.toLocaleString('ru-RU') + ' ₽';
        }
    };

    if (pagesRange) {
        pagesRange.addEventListener('input', () => {
            if (pagesValue) pagesValue.textContent = pagesRange.value;
            updateCalculations();
        });
    }

    if (optionDesign) optionDesign.addEventListener('change', updateCalculations);
    if (optionSEO) optionSEO.addEventListener('change', updateCalculations);
    if (optionSupport) optionSupport.addEventListener('change', updateCalculations);
    if (speedSelect) speedSelect.addEventListener('change', updateCalculations);

    updateCalculations();

    // Функция связи калькулятора с услугами
    window.openCalculatorWithPages = (pageCount) => {
        if (pagesRange) {
            pagesRange.value = pageCount;
            if (pagesValue) pagesValue.textContent = pageCount;
            updateCalculations();
        }
        openModal('calculatorModal');
    };

    // ==========================================
    // 6. ДИНАМИЧЕСКИЙ ФИЛЬТР ГАЛЕРЕИ
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    setTimeout(() => { item.style.opacity = '1'; }, 50);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ==========================================
    // 7. FAQ (АККОРДЕОНЫ)
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answerBox = item.querySelector('.faq-answer');

        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = '0';
            });

            if (!isOpen) {
                item.classList.add('active');
                answerBox.style.maxHeight = answerBox.scrollHeight + 'px';
            }
        });
    });

    // ==========================================
    // 8. ИНТЕРАКТИВНЫЙ СЛАЙДЕР ОТЗЫВОВ
    // ==========================================
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderPrevBtn = document.getElementById('sliderPrevBtn');
    const sliderNextBtn = document.getElementById('sliderNextBtn');
    const dots = document.querySelectorAll('#sliderDots .dot');
    let currentSlide = 0;
    const totalSlides = dots.length;

    const updateSlider = (index) => {
        if (sliderTrack) {
            currentSlide = index;
            sliderTrack.style.transform = `translateX(-${index * 100}%)`;
            
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) {
                dots[index].classList.add('active');
            }
        }
    };

    if (sliderNextBtn) {
        sliderNextBtn.addEventListener('click', () => {
            let nextIndex = currentSlide + 1;
            if (nextIndex >= totalSlides) nextIndex = 0; // Начать заново
            updateSlider(nextIndex);
        });
    }

    if (sliderPrevBtn) {
        sliderPrevBtn.addEventListener('click', () => {
            let prevIndex = currentSlide - 1;
            if (prevIndex < 0) prevIndex = totalSlides - 1; // Перейти к концу
            updateSlider(prevIndex);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
        });
    });

    // Автоматическое перелистывание каждые 8 секунд
    setInterval(() => {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= totalSlides) nextIndex = 0;
        updateSlider(nextIndex);
    }, 8000);

    // ==========================================
    // 9. ВАЛИДАЦИЯ ФОРМЫ СВЯЗИ
    // ==========================================
    const contactForm = document.getElementById('interactiveContactForm');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');

    const showError = (inputElement, errorElement, text) => {
        const parent = inputElement.parentElement;
        parent.classList.add('invalid');
        errorElement.textContent = text;
        errorElement.style.display = 'block';
    };

    const clearError = (inputElement, errorElement) => {
        const parent = inputElement.parentElement;
        parent.classList.remove('invalid');
        errorElement.style.display = 'none';
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nameErr = document.getElementById('nameError');
            const emailErr = document.getElementById('emailError');
            const msgErr = document.getElementById('messageError');

            if (nameInput.value.trim().length < 2) {
                showError(nameInput, nameErr, 'Имя должно содержать минимум 2 символа');
                isValid = false;
            } else {
                clearError(nameInput, nameErr);
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                showError(emailInput, emailErr, 'Введите корректный адрес почты');
                isValid = false;
            } else {
                clearError(emailInput, emailErr);
            }

            if (messageInput.value.trim().length < 10) {
                showError(messageInput, msgErr, 'Опишите задачу подробнее (минимум 10 символов)');
                isValid = false;
            } else {
                clearError(messageInput, msgErr);
            }

            if (isValid) {
                showToast(`Спасибо, ${nameInput.value}! Ваша заявка успешно отправлена.`);
                contactForm.reset();
            }
        });
    }
});

// ==========================================
// 10. ИНТЕРАКТИВНЫЙ LIGHTBOX (ГАЛЕРЕЯ)
// ==========================================
window.openLightbox = (src, captionText) => {
    const lightbox = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');
    
    if (lightbox && img) {
        img.src = src;
        if (caption) caption.textContent = captionText;
        lightbox.style.display = 'flex';
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
    }
};

window.closeLightbox = () => {
    const lightbox = document.getElementById('lightboxModal');
    if (lightbox) {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
    }
};