class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 400px;
          margin-bottom: 1rem;
          font-family: Arial, sans-serif;
        }
        form {
          display: flex;
          gap: 0.5rem;
        }
        input[type="search"] {
          flex-grow: 1;
          padding: 0.5rem;
          font-size: 1rem;
        }
        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          background-color: #007bff;
          border: none;
          color: white;
          border-radius: 0.3rem;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #0056b3;
        }
      </style>
      <form part="form">
        <input type="search" placeholder="Search books..." aria-label="Search books" />
        <button type="submit">Search</button>
      </form>
    `;

    this._form = this.shadowRoot.querySelector('form');
    this._input = this.shadowRoot.querySelector('input[type="search"]');

    this._form.addEventListener('submit', this._onSubmit.bind(this));
  }

  _onSubmit(event) {
    event.preventDefault();
    const query = this._input.value.trim();
    this.dispatchEvent(
      new CustomEvent('search', {
        detail: { query },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('search-bar', SearchBar);
