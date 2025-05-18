import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

const BookApp = {
    page: 1,
    matches: books,
    booksPerPage: BOOKS_PER_PAGE,

    init() {
        this.renderBooks();
        this.updateLoadMoreButton();
        this.initEventListeners();
        this.applyTheme();
    },

    renderBooks() {
        const container = document.querySelector('[data-list-items]');
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();

        for (const book of this.matches.slice(0, this.booksPerPage)) {
            fragment.appendChild(this.createBookPreview(book));
        }

        container.appendChild(fragment);
    },

    createBookPreview(book) {
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', book.id);

        element.innerHTML = `
            <img class="preview__image" src="${book.image}" />
            <div class="preview__info">
                <h3 class="preview__title">${book.title}</h3>
                <div class="preview__author">${authors[book.author]}</div>
            </div>
        `;

        return element;
    },

    filterBooks(filters) {
        const result = books.filter((book) => {
            const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
            const authorMatch = filters.author === 'any' || book.author === filters.author;
            const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);

            return titleMatch && authorMatch && genreMatch;
        });

        this.matches = result;
        this.page = 1;
        this.renderBooks();
        this.updateLoadMoreButton();
    },

    loadMore() {
        const start = this.page * this.booksPerPage;
        const end = start + this.booksPerPage;

        const fragment = document.createDocumentFragment();
        const booksToLoad = this.matches.slice(start, end);

        for (const book of booksToLoad) {
            fragment.appendChild(this.createBookPreview(book));
        }

        document.querySelector('[data-list-items]').appendChild(fragment);

        this.page++;
        this.updateLoadMoreButton();
    },

    updateLoadMoreButton() {
        const remaining = this.matches.length - (this.page * this.booksPerPage);
        const button = document.querySelector('[data-list-button]');
        
        button.disabled = remaining <= 0;
        button.innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
        `;
    },

    applyTheme() {
        const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
        this.setTheme(theme);
    },

    setTheme(theme) {
        const darkMode = theme === 'night';
        document.documentElement.style.setProperty('--color-dark', darkMode ? '255, 255, 255' : '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', darkMode ? '10, 10, 20' : '255, 255, 255');
    },

    initEventListeners() {
        document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const filters = Object.fromEntries(formData);
            this.filterBooks(filters);
        });

        document.querySelector('[data-list-button]').addEventListener('click', () => {
            this.loadMore();
        });

        document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const { theme } = Object.fromEntries(formData);
            this.setTheme(theme);
        });

        document.querySelector('[data-search-cancel]').addEventListener('click', () => {
            document.querySelector('[data-search-overlay]').open = false;
        });

        document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
            document.querySelector('[data-settings-overlay]').open = false;
        });
    }
};

BookApp.init();
