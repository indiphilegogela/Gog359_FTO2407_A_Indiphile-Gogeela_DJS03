// --- Sample dynamic book data ---
const books = [
  {
    cover: 'https://example.com/cover1.jpg',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic novel about the American dream.'
  },
  {
    cover: 'https://example.com/cover2.jpg',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A story of racial injustice in the Deep South.'
  },
  {
    cover: 'https://example.com/cover3.jpg',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian novel about surveillance and control.'
  }
];

// --- BookPreview Web Component Definition ---
class BookPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid #ddd;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-width: 300px;
          font-family: Arial, sans-serif;
          margin: 1rem 0;
        }
        .cover {
          width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          object-fit: cover;
        }
        .title {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .author {
          font-size: 1rem;
          color: #555;
          margin-bottom: 1rem;
        }
        .description {
          font-size: 0.9rem;
          color: #333;
        }
      </style>
      <div class="book-preview">
        <img class="cover" src="" alt="Book Cover">
        <div class="title"></div>
        <div class="author"></div>
        <div class="description"></div>
      </div>
    `;
  }

  static get observedAttributes() {
    return ['cover', 'title', 'author', 'description'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const element = this.shadowRoot.querySelector(`.${name}`);
    if (!element) return;

    if (name === 'cover') {
      element.src = newValue;
      element.alt = this.getAttribute('title') || 'Book Cover';
    } else {
      element.textContent = newValue;
    }
  }

  connectedCallback() {
    BookPreview.observedAttributes.forEach(attr => {
      if (this.hasAttribute(attr)) {
        this.attributeChangedCallback(attr, null, this.getAttribute(attr));
      }
    });
  }
}

customElements.define('book-preview', BookPreview);

// --- Function to render book previews dynamically ---
function renderBookPreviews(bookList, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id '${containerId}' not found.`);
    return;
  }

  container.innerHTML = '';

  bookList.forEach(book => {
    const bookPreview = document.createElement('book-preview');
    bookPreview.setAttribute('cover', book.cover);
    bookPreview.setAttribute('title', book.title);
    bookPreview.setAttribute('author', book.author);
    bookPreview.setAttribute('description', book.description);

    container.appendChild(bookPreview);
  });
}

// --- Initialize when DOM is ready ---
document.addEventListener('DOMContentLoaded', () => {
  const containerId = 'book-preview-container';

  // Render initial book previews
  renderBookPreviews(books, containerId);

  // Attach search event listener after DOM is fully loaded
  const searchBar = document.querySelector('search-bar');
  
  if (searchBar) {
    searchBar.addEventListener('search', (e) => {
      const query = e.detail.query.toLowerCase();
      const filteredBooks = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );

      renderBookPreviews(filteredBooks, containerId);
    });
  }
});
