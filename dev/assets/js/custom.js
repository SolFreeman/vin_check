const languages = ['EN', 'DE', 'PL', 'RO'];
const languageLabels = {
    EN: 'English',
    DE: 'Deutsch',
    PL: 'Polski',
    RO: 'Română'
};
let selectedLanguage = 'EN';

function renderLanguages() {
    document.querySelectorAll('.language-switcher').forEach((switcher) => {
        switcher.replaceChildren(...languages.map((language) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = language;
            button.className = language === selectedLanguage ? 'active' : '';
            button.setAttribute('aria-pressed', String(language === selectedLanguage));
            button.addEventListener('click', () => selectLanguage(language));
            return button;
        }));
    });
}

function selectLanguage(language) {
    selectedLanguage = language;
    document.documentElement.lang = language.toLowerCase();
    document.querySelectorAll('.language-bar').forEach((item) => item.classList.remove('open'));
    renderLanguages();
    syncLanguageBar();
    showToast(`Language switched to ${languageLabels[language]}`);
}

const barLanguageMap = {
    English: 'EN',
    Deutsch: 'DE',
    Poland: 'PL',
    Romania: 'RO'
};

function syncLanguageBar() {
    const bar = document.querySelector('.language-bar');
    if (!bar) return;
    bar.querySelector('.language-title').textContent = languageLabels[selectedLanguage];
    bar.querySelectorAll('.menu-item').forEach((item) => {
        item.classList.toggle('active', barLanguageMap[item.textContent.trim()] === selectedLanguage);
    });
}

const languageBar = document.querySelector('.language-bar');
if (languageBar) {
    const title = languageBar.querySelector('.language-title');
    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.setAttribute('aria-expanded', 'false');
    const toggleLanguageBar = () => {
        languageBar.classList.toggle('open');
        title.setAttribute('aria-expanded', String(languageBar.classList.contains('open')));
    };
    title.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleLanguageBar();
    });
    title.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleLanguageBar();
        }
    });
    languageBar.querySelectorAll('.menu-item a').forEach((link) => link.addEventListener('click', (event) => {
        event.preventDefault();
        selectLanguage(barLanguageMap[link.textContent.trim()]);
    }));
}

function showToast(message) {
    const toast = document.querySelector('.toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
}

document.querySelectorAll('.accordion-item button').forEach((button) => {
    button.addEventListener('click', () => {
        const item = button.closest('.accordion-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.accordion-item').forEach((other) => {
            other.classList.remove('open');
            other.querySelector('button').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
            item.classList.add('open');
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

const menu = document.querySelector('.header-menu');
const menuButton = document.querySelector('.js-nav-opener');

function closeMenu() {
    menu.classList.remove('open');
    menu.closest('.site-header').classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    menu.setAttribute('aria-hidden', String(window.innerWidth < 768));
    document.body.style.overflow = '';
}
menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menu.closest('.site-header').classList.toggle('menu-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
});
menu.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
    closeMenu();
});

closeMenu();

function vinValidate() {
    const vinInput = document.getElementById('vin');
    const vinForm = document.getElementById('vinForm');
    const vinError = document.getElementById('vinError');

    if (!vinInput || !vinForm || !vinError) return;

    // 1. Форматирование на лету (авто-upcase и очистка от невалидных знаков)
    vinInput.addEventListener('input', (e) => {
        e.target.value = e.target.value
            .toUpperCase()
            .replace(/[^A-HJ-NPR-Z0-9]/g, '');

        // Сбрасываем ошибку при редактировании
        clearError();
    });

    // 2. Проверка при отправке формы
    vinForm.addEventListener('submit', (e) => {
        // Проверяем валидность элемента средствами браузера на основе pattern и required
        if (!vinInput.checkValidity()) {
            e.preventDefault(); // Останавливаем отправку

            // Определяем, какой именно текст из data-атрибутов HTML нужно показать
            let errorMessage = '';

            if (vinInput.validity.valueMissing) {
                errorMessage = vinInput.dataset.msgRequired;
            } else if (vinInput.validity.patternMismatch) {
                errorMessage = vinInput.dataset.msgPattern;
            }

            showError(errorMessage);
        }
    });

    function showError(message) {
        vinError.textContent = message;
        vinInput.classList.add('invalid');
    }

    function clearError() {
        vinError.textContent = '';
        vinInput.classList.remove('invalid');
    }
}

vinValidate();

const vinForm = document.querySelector('.vin-form');
if (vinForm) {
    vinForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const vin = document.querySelector('#vin').value.trim();
        showToast(vin.length === 17 ? `VIN ${vin} is ready to check.` : 'Enter a valid 17-character VIN.');
    });
}
document.addEventListener('click', () => document.querySelectorAll('.language-bar').forEach((item) => item.classList.remove('open')));
renderLanguages();
syncLanguageBar();

const vinProcessTabs = document.querySelectorAll('.steps[role="tablist"] .steps-item');
const vinDiagramPanel = document.querySelector('#vin-diagram-panel');

if (vinProcessTabs.length && vinDiagramPanel) {
    const vinDiagramImage = vinDiagramPanel.querySelector('img');

    const selectVinProcessTab = (selectedTab) => {
        vinProcessTabs.forEach((tab) => {
            const isSelected = tab === selectedTab;
            tab.classList.toggle('active', isSelected);
            tab.setAttribute('aria-selected', String(isSelected));
            tab.tabIndex = isSelected ? 0 : -1;
        });

        vinDiagramPanel.setAttribute('aria-labelledby', selectedTab.id);
        vinDiagramImage.classList.add('is-changing');

        const nextImage = new Image();
        nextImage.onload = () => {
            vinDiagramImage.src = selectedTab.dataset.image;
            vinDiagramImage.alt = selectedTab.dataset.alt;
            requestAnimationFrame(() => vinDiagramImage.classList.remove('is-changing'));
        };
        nextImage.onerror = () => vinDiagramImage.classList.remove('is-changing');
        nextImage.src = selectedTab.dataset.image;
    };

    vinProcessTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectVinProcessTab(tab));
        tab.addEventListener('keydown', (event) => {
            if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();

            let nextIndex = index;
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = vinProcessTabs.length - 1;
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % vinProcessTabs.length;
            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + vinProcessTabs.length) % vinProcessTabs.length;

            vinProcessTabs[nextIndex].focus();
            selectVinProcessTab(vinProcessTabs[nextIndex]);
        });
    });
}

document.querySelectorAll('[data-sticker-tabs]').forEach((tabsBlock) => {
    const tabs = Array.from(tabsBlock.querySelectorAll('[role="tab"]'));
    const image = tabsBlock.querySelector('.window-sticker__preview img');
    if (!tabs.length || !image) return;

    tabs.forEach((tab) => tab.addEventListener('click', () => {
        tabs.forEach((item) => {
            const active = item === tab;
            item.classList.toggle('active', active);
            item.setAttribute('aria-selected', String(active));
        });
        const preview = tabsBlock.querySelector('.window-sticker__preview');
        image.classList.add('is-changing');
        preview.dataset.view = tab.dataset.view;
        window.setTimeout(() => image.classList.remove('is-changing'), 180);
    }));
});

const mobileSwiperElements = document.querySelectorAll('.vin-help .swiper');
let mobileSwipers = [];

function syncVinHelpSwipers() {
    if (typeof Swiper === 'undefined' || !mobileSwiperElements.length) return;
    if (window.innerWidth < 768 && !mobileSwipers.length) {
        mobileSwipers = Array.from(mobileSwiperElements, (element) => new Swiper(element, {
            slidesPerView: 'auto',
            spaceBetween: 16,
            speed: 420,
            resistanceRatio: .75,
            grabCursor: true,
            watchOverflow: true
        }));
    } else if (window.innerWidth >= 768 && mobileSwipers.length) {
        mobileSwipers.forEach((swiper) => swiper.destroy(true, true));
        mobileSwipers = [];
    }
}

syncVinHelpSwipers();
window.addEventListener('resize', syncVinHelpSwipers);

const specTable = document.querySelector('.sample-report .spec-table');
const specSlider = document.querySelector('.spec-mobile-slider');
let specSwiper = null;

if (specTable && specSlider) {
    const sourceRows = Array.from(specTable.querySelectorAll('.spec-row'));
    const sliderWrapper = specSlider.querySelector('.swiper-wrapper');
    const pages = [sourceRows.slice(0, 11), sourceRows.slice(11)];

    pages.forEach((rows) => {
        const page = document.createElement('div');
        page.className = 'swiper-slide spec-mobile-page';
        rows.forEach((row, index) => {
            page.appendChild(row.cloneNode(true));
            if (index === 4) {
                const ad = specTable.querySelector('.report-ad--square').cloneNode(true);
                page.appendChild(ad);
            }
        });
        sliderWrapper.appendChild(page);
    });

    const syncSpecSwiper = () => {
        if (typeof Swiper === 'undefined') return;
        if (window.innerWidth < 768 && !specSwiper) {
            specSwiper = new Swiper(specSlider, {
                slidesPerView: 1,
                spaceBetween: 20,
                speed: 420,
                autoHeight: true,
                pagination: {
                    el: specSlider.querySelector('.swiper-pagination'),
                    clickable: true
                }
            });
        } else if (window.innerWidth >= 768 && specSwiper) {
            specSwiper.destroy(true, true);
            specSwiper = null;
        }
    };

    syncSpecSwiper();
    window.addEventListener('resize', syncSpecSwiper);
}

const brandsSeo = document.querySelector('.brands-seo');
const brandsSeoToggle = brandsSeo && brandsSeo.querySelector('button');
if (brandsSeoToggle) {
    brandsSeoToggle.addEventListener('click', () => {
        const expanded = brandsSeo.classList.toggle('is-expanded');
        brandsSeoToggle.textContent = expanded ? 'Show less' : 'Read more';
    });
}

const brandFilter = document.querySelector('.brand-directory');
if (brandFilter) {
    const filterButtons = brandFilter.querySelectorAll('[data-brand-letter]');
    const brandGroups = brandFilter.querySelectorAll('[data-brand-group]');
    filterButtons.forEach((button) => button.addEventListener('click', () => {
        const letter = button.dataset.brandLetter;
        filterButtons.forEach((item) => item.classList.toggle('active', item === button));
        brandGroups.forEach((group) => { group.hidden = letter !== 'all' && group.dataset.brandGroup !== letter; });
        const scroller = brandFilter.querySelector('.brand-directory__scroll');
        if (scroller) scroller.scrollTo({ left: 0, behavior: 'smooth' });
    }));
}

const toyotaSeo = document.querySelector('.toyota-seo');
const toyotaSeoToggle = toyotaSeo && toyotaSeo.querySelector('button');
if (toyotaSeoToggle) {
    toyotaSeoToggle.addEventListener('click', () => {
        const expanded = toyotaSeo.classList.toggle('is-expanded');
        toyotaSeoToggle.textContent = expanded ? 'Show less' : 'Read more';
    });
}

const toyotaModelSlider = document.querySelector('.toyota-models');
const toyotaTipsSlider = document.querySelector('.toyota-tips__slider');
let toyotaModelSwiper = null;
let toyotaTipsSwiper = null;

function syncToyotaSliders() {
    if (typeof Swiper === 'undefined') return;
    if (window.innerWidth < 768) {
        if (toyotaModelSlider && !toyotaModelSwiper) toyotaModelSwiper = new Swiper(toyotaModelSlider, { slidesPerView: 'auto', spaceBetween: 16, speed: 420, grabCursor: true });
        if (toyotaTipsSlider && !toyotaTipsSwiper) toyotaTipsSwiper = new Swiper(toyotaTipsSlider, { slidesPerView: 'auto', spaceBetween: 16, speed: 420, grabCursor: true, pagination: { el: toyotaTipsSlider.querySelector('.swiper-pagination'), clickable: true } });
    } else {
        if (toyotaModelSwiper) { toyotaModelSwiper.destroy(true, true); toyotaModelSwiper = null; }
        if (toyotaTipsSwiper) { toyotaTipsSwiper.destroy(true, true); toyotaTipsSwiper = null; }
    }
}

syncToyotaSliders();
window.addEventListener('resize', syncToyotaSliders);
