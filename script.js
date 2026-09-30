
const menuToggle = document.querySelector('#menu-toggle');
const navLinks = document.querySelector('#nav-links');
const themeToggle = document.querySelector('#theme-toggle');
const projectSearch = document.querySelector('#project-search');
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
const noResults = document.querySelector('#no-results');
const contactForm = document.querySelector('#contact-form');
const messageInput = document.querySelector('#contact-message');
const formStatus = document.querySelector('#form-status');

menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Mở menu' : 'Đóng menu');
    navLinks.classList.toggle('is-open', !isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Mở menu');
    });
});

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'dark') document.body.classList.add('dark-theme');
updateThemeButton();

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('portfolio-theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    updateThemeButton();
});

function updateThemeButton() {
    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', isDark ? 'Bật giao diện sáng' : 'Bật giao diện tối');
}

let activeFilter = 'all';
function filterProjects() {
    const query = projectSearch.value.trim().toLocaleLowerCase('vi');
    let visibleCount = 0;
    projectCards.forEach((card) => {
        const matchesFilter = activeFilter === 'all' || card.dataset.tags.split(' ').includes(activeFilter);
        const matchesSearch = `${card.textContent} ${card.dataset.tags}`.toLocaleLowerCase('vi').includes(query);
        const isVisible = matchesFilter && matchesSearch;
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
    });
    noResults.hidden = visibleCount !== 0;
}

projectSearch.addEventListener('input', filterProjects);
filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach((filterButton) => {
            const isActive = filterButton === button;
            filterButton.classList.toggle('is-active', isActive);
            filterButton.setAttribute('aria-pressed', String(isActive));
        });
        filterProjects();
    });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelector('#current-year').textContent = new Date().getFullYear();

messageInput.addEventListener('input', () => {
    document.querySelector('#char-count').textContent = messageInput.value.length;
    formStatus.textContent = '';
});

contactForm.addEventListener('input', (event) => {
    if (event.target.matches('input, textarea')) {
        event.target.classList.remove('has-error');
        const error = document.querySelector(`#${event.target.id.replace('contact-', '')}-error`);
        if (error) error.textContent = '';
    }
});

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.querySelector('#contact-name');
    const email = document.querySelector('#contact-email');
    const message = messageInput;
    const errors = [
        { field: name, target: '#name-error', message: name.value.trim().length < 2 ? 'Tên cần có ít nhất 2 ký tự.' : '' },
        { field: email, target: '#email-error', message: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? '' : 'Vui lòng nhập địa chỉ email hợp lệ.' },
        { field: message, target: '#message-error', message: message.value.trim().length < 20 ? 'Lời nhắn cần có ít nhất 20 ký tự.' : '' }
    ];
    let firstInvalidField;

    errors.forEach(({ field, target, message: errorMessage }) => {
        document.querySelector(target).textContent = errorMessage;
        field.classList.toggle('has-error', Boolean(errorMessage));
        if (errorMessage && !firstInvalidField) firstInvalidField = field;
    });

    if (firstInvalidField) {
        formStatus.textContent = '';
        firstInvalidField.focus();
        return;
    }

    formStatus.textContent = 'Thông tin hợp lệ! Đây là form minh họa và chưa gửi dữ liệu đi.';
    contactForm.reset();
    document.querySelector('#char-count').textContent = '0';
});