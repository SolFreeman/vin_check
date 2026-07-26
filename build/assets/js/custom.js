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

document.querySelector('.vin-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const vin = document.querySelector('#vin').value.trim();
    showToast(vin.length === 17 ? `VIN ${vin} is ready to check.` : 'Enter a valid 17-character VIN.');
});
document.addEventListener('click', () => document.querySelectorAll('.language-bar').forEach((item) => item.classList.remove('open')));
renderLanguages();
syncLanguageBar();
