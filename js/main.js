//MENU BURGER
const selectors = {
    open: '.header__burger-button',
    close: '.menu__burger-button',
    menu: '.menu'
};

const btnOpen = document.querySelector(selectors.open);
const btnClose = document.querySelector(selectors.close);
const menu = document.querySelector(selectors.menu);
const body = document.body;

if (btnOpen && menu) {
    const toggleMenu = (isOpen) => {
        if (isOpen) {
            menu.style.display = 'block';
            body.classList.add('no-scroll');
            const panel = document.getElementById('bx-panel');
            const panelHeight = panel ? panel.offsetHeight : 0;
            if (panelHeight > 0) {
                menu.style.setProperty('padding-top', `${panelHeight}px`, 'important');
            }
            setTimeout(() => menu.classList.add('active'), 10);
        } else {
            menu.classList.remove('active');
            menu.style.display = 'none';
            body.classList.remove('no-scroll');
        }
    };

    btnOpen.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu(true);
    });
    if (btnClose) btnClose.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu(false);
    });

    menu.addEventListener('click', (e) => {
        if (e.target === menu || e.target.closest('a')) toggleMenu(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) toggleMenu(false);
    });
}

//SWIPER


//Главный баннер
if (document.querySelector('.hero__slider')) {
    new Swiper('.hero__slider', {
        loop: true,
        autoplay: { delay: 5500 },
        spaceBetween: 40,
        pagination: { el: '.swiper-pagination', clickable: true },
    });
}

//Слайдер статей на Главной странице 
const articlesContainer = document.querySelector('.index .articles__wrap');
if (articlesContainer) {
    new Swiper(articlesContainer, {
        slidesPerView: 1,
        watchSlidesProgress: true,
        spaceBetween: 24,
        observer: true,
        observeParents: true,
        pagination: {
            el: '.index .articles__wrap .swiper-pagination',
            clickable: true
        },
        breakpoints: {
            833: { slidesPerView: 2 },
            1280: { slidesPerView: 3 }
        }
    });
}

//  Слайдер статей на детальной странице 
const articlesDitailContainer = document.querySelector('.ditail .articles__wrap');

if (articlesDitailContainer) {
    new Swiper(articlesDitailContainer, {
        slidesPerView: 1,
        watchSlidesProgress: true,
        spaceBetween: 24,
        observer: true,
        observeParents: true,
        allowTouchMove: true,
        pagination: {
            el: '.ditail .articles__wrap .swiper-pagination',
            clickable: true
        },
        breakpoints: {
            833: {
                slidesPerView: 2
            },
            1280: {
                slidesPerView: 3,
                allowTouchMove: false,
                pagination: {
                    el: null
                }
            }
        }
    });
}
// CONTACTS FORM
const form = document.querySelector('.contacts__form');
if (form) {
    form.noValidate = true;

    const updateLabelState = (input, isFocused = false) => {
        const parent = input.closest('.contacts__input-group') || input.closest('.contacts__input-group-textarea');
        if (!parent) return;

        let placeholderText = input.placeholder || input.getAttribute('data-placeholder');
        if (input.tagName === 'SELECT' && !placeholderText) {
            const firstOption = input.querySelector('option');
            if (firstOption) placeholderText = firstOption.textContent;
        }
        if (!placeholderText) return;

        let label = parent.querySelector('.contacts__floating-label');
        if (!label) {
            label = document.createElement('span');
            label.classList.add('contacts__floating-label');
            label.textContent = placeholderText;
            parent.insertBefore(label, input);
        }

        if (isFocused || input.value.trim() !== '') {
            label.classList.add('is-active');
        } else {
            label.classList.remove('is-active');
        }
    };

    const validateField = (input) => {
        const parent = input.closest('.contacts__input-group') ||
            input.closest('.contacts__input-group-textarea') ||
            input.closest('.contacts__checkbox-container');
        if (!parent) return;

        let isValid = true;
        const val = input.value.trim();

        if (input.hasAttribute('required')) {
            if (input.type === 'checkbox' && !input.checked) isValid = false;
            else if (!val) isValid = false;
        }

        if (isValid && input.name === 'name' && val.length > 0) {
            const nameRegex = /^[a-zA-Zа-яА-ЯёЁ]+([\s\-][a-zA-Zа-яА-ЯёЁ]+)*$/;
            if (val.length < 2 || !nameRegex.test(val)) {
                isValid = false;
            }
        }

        if (isValid && input.name === 'surname' && val.length > 0) {
            const nameRegex = /^[a-zA-Zа-яА-ЯёЁ]+([\s\-][a-zA-Zа-яА-ЯёЁ]+)*$/;
            if (val.length < 2 || !nameRegex.test(val)) {
                isValid = false;
            }
        }

        if (isValid && input.name === 'city' && val.length > 0 && val.length < 3) {
            isValid = false;
        }

        if (isValid && input.name === 'phone' && val.length > 0) {
            const phoneRegex = /^(?:\+7|7|8|\+8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
            if (!phoneRegex.test(val)) {
                isValid = false;
            }
        }

        if (isValid && input.name === 'subject') {
            if (input.hasAttribute('required') && !val) {
                isValid = false;
            }
        }

        const icon = parent.querySelector('.contacts__status-icon');
        if (icon) {
            icon.classList.remove('icon-success', 'icon-error');

            if (!isValid) {
                icon.classList.add('icon-error');
            } else if (val.length > 0) {
                icon.classList.add('icon-success');
            }
        }

        if (!isValid) {
            parent.classList.add('error');
            parent.classList.remove('success');
        } else {
            parent.classList.remove('error');
            if (val.length > 0 || (input.type === 'checkbox' && input.checked)) {
                parent.classList.add('success');
            } else {
                parent.classList.remove('success');
            }
        }
        return isValid;
    };

    form.addEventListener('input', (e) => {
        if (e.target.classList.contains('contacts__input') || e.target.type === 'checkbox') {
            validateField(e.target);
            if (e.target.classList.contains('contacts__input')) {
                updateLabelState(e.target, true);
            }
        }
    });

    form.addEventListener('change', (e) => {
        if (e.target.tagName === 'SELECT' || e.target.classList.contains('contacts__input')) {
            validateField(e.target);
            updateLabelState(e.target, document.activeElement === e.target);
        }
    });

    form.addEventListener('submit', (e) => {
        let isFormValid = true;
        const inputs = form.querySelectorAll('.contacts__input, input[type="checkbox"], select.contacts__input');

        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
            if (input.classList.contains('contacts__input')) {
                updateLabelState(input, document.activeElement === input);
            }
        });

        if (!isFormValid) {
            e.preventDefault();

            const firstErrorField = form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    form.addEventListener('focusin', (e) => {
        const input = e.target;
        if (!input.classList.contains('contacts__input')) return;
        updateLabelState(input, true);
    });

    form.addEventListener('focusout', (e) => {
        const input = e.target;
        if (!input.classList.contains('contacts__input')) return;
        updateLabelState(input, false);
    });

    const allTextInputs = form.querySelectorAll('.contacts__input');
    allTextInputs.forEach(input => {
        updateLabelState(input, document.activeElement === input);
    });
}


// FILTER
const modal = document.querySelector('.filter');
const articlesDropdown = document.querySelector('.articles__dropdown');
const dropdownBtn = document.querySelector('.articles__button-dropdown, .articles__button-tags');
const toggleButtons = document.querySelectorAll('.filter__button, .articles__button-tags, .articles__button-dropdown');

if (toggleButtons.length > 0) {

    // ЛОГИКА СЧЕТЧИКОВ
    const updateFilterCount = (btn) => {
        const icon = btn.querySelector('.filter__icon, .articles__icon-tags');
        if (!icon) return;

        let checkedCount = 0;

        if (btn.matches('.filter__button') && modal) {
            checkedCount = modal.querySelectorAll('.filter__checkbox:checked').length;
        } else if (btn.matches('.articles__button-tags') && articlesDropdown) {
            checkedCount = articlesDropdown.querySelectorAll('.articles__checkbox:checked').length;
        }

        if (checkedCount > 0) {
            icon.setAttribute('data-count', checkedCount);
        } else {
            icon.removeAttribute('data-count');
        }
    };

    const updateAllCounters = () => {
        toggleButtons.forEach(btn => updateFilterCount(btn));
    };

    updateAllCounters();

    document.addEventListener('change', (e) => {
        if (e.target.matches('.filter__checkbox, .articles__checkbox')) {
            updateAllCounters();
        }
    });

    // ВАЛИДАЦИЯ ИНПУТОВ ДИАПАЗОНА
    if (modal) {
        const rangeInputs = modal.querySelectorAll('.filter__range-input');
        rangeInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9+-]/g, '');
                if (e.target.value.includes('-', 1) || e.target.value.includes('+', 1)) {
                    e.target.value = e.target.value.slice(0, -1);
                }
            });
        });
    }
    // КНОПОКА «ПОКАЗАТЬ»
    const submitButtons = document.querySelectorAll('.filter__btn_submit, .articles__menu-submit');
    submitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.matches('.filter__btn_submit') && modal) {
                modal.classList.remove('active');
                const filterBtn = document.querySelector('.filter__button');
                if (filterBtn) filterBtn.classList.remove('active');
            } else if (articlesDropdown) {
                articlesDropdown.classList.remove('active');
                if (dropdownBtn) dropdownBtn.classList.remove('active');
            }
        });
    });


    // КНОПОКИ «СБРОСИТЬ»
    const resetButtons = document.querySelectorAll('.filter__btn_reset, .articles__menu-reset');
    resetButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const isCatalog = btn.matches('.filter__btn_reset');
            const container = isCatalog ? modal : articlesDropdown;
            const checkboxSelector = isCatalog ? '.filter__checkbox' : '.articles__checkbox';

            if (!container) return;

            container.querySelectorAll(checkboxSelector).forEach(cb => cb.checked = false);

            if (isCatalog) {
                const rangeInputs = container.querySelectorAll('.filter__range-input');
                if (rangeInputs.length === 2) {
                    rangeInputs[0].value = "-50";
                    rangeInputs[1].value = "+150";
                }
            }

            updateAllCounters();
        });
    });

    // ARTICLES MODAL
    // ЛОГИКА ОТКРЫТИЯ ЗАКРЫТИЯ ОКН 
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            if (btn.matches('.filter__button')) {
                if (modal) {
                    btn.classList.toggle('active');
                    modal.classList.toggle('active');
                }
            } else {

                if (articlesDropdown) {
                    if (dropdownBtn) dropdownBtn.classList.toggle('active');
                    articlesDropdown.classList.toggle('active');
                }
            }
        });
    });

    if (modal) {
        const closeBtn = modal.querySelector('.filter__btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                const filterBtn = document.querySelector('.filter__button');
                if (filterBtn) filterBtn.classList.remove('active');
            });
        }
    }



    // ЗАКРЫТИЕ 
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (articlesDropdown) articlesDropdown.classList.remove('active');
            if (dropdownBtn) dropdownBtn.classList.remove('active');
            if (modal) modal.classList.remove('active');
            const filterBtn = document.querySelector('.filter__button');
            if (filterBtn) filterBtn.classList.remove('active');
        }
    });
}


const contentBlocks = document.querySelectorAll('.ditail__info');
const skuText = document.querySelector('.ditail__info-text');
const skuTdsBtn = document.querySelector('.ditail__tds-button');


const tags = document.querySelectorAll('.articles__tag');
const weightButtons = document.querySelectorAll('.ditail__weight');
const tabButtons = document.querySelectorAll('.ditail__select-item');


function handleToggle(e) {
    const el = e.currentTarget;


    let currentGroup = [];
    if (el.classList.contains('articles__tag')) currentGroup = tags;
    else if (el.classList.contains('ditail__weight')) currentGroup = weightButtons;
    else if (el.classList.contains('ditail__select-item')) currentGroup = tabButtons;


    currentGroup.forEach(item => item.classList.remove('active'));
    el.classList.add('active');


    if (el.classList.contains('ditail__weight')) {
        const text = el.getAttribute('data-text');
        const tds = el.getAttribute('data-tds');

        if (skuText && text) skuText.textContent = text;
        if (skuTdsBtn) {
            skuTdsBtn.href = tds || '#';
            skuTdsBtn.style.display = tds ? 'inline-block' : 'none';
        }
    }


    if (el.classList.contains('ditail__select-item')) {
        const target = el.getAttribute('data-tab');

        contentBlocks.forEach(block => {
            block.classList.toggle('active', block.getAttribute('data-content') === target);
        });
    }
}


[...tags, ...weightButtons, ...tabButtons].forEach(btn => {
    btn.addEventListener('click', handleToggle);
});