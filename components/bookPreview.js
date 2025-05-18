class BookPreview extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM to encapsulate styles and markup
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

  // Define which attributes to observe for changes
  static get observedAttributes() {
    return ['cover', 'title', 'author', 'description'];
  }

  // Update the component whenever attributes change
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

  // Optionally, initialize with current attribute values on connect
  connectedCallback() {
    BookPreview.observedAttributes.forEach(attr => {
      if (this.hasAttribute(attr)) {
        this.attributeChangedCallback(attr, null, this.getAttribute(attr));
      }
    });
  }
}

// Register the custom element
customElements.define('book-preview', BookPreview);
