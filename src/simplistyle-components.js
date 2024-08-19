// src/simplistyle-components.js

// Utility functions
const createTemplate = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
};

const defineComponent = (name, component) => {
  if (!customElements.get(name)) {
    customElements.define(name, component);
  }
};

// Base class for SimpliStyle components
class SimpliStyleElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }

  setupEventListeners() {}

  // Utility method for setting multiple attributes
  setAttributes(elem, attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      elem.setAttribute(key, value);
    });
  }
}

// Button Component
class SSButton extends SimpliStyleElement {
  constructor() {
    super();
    this.template = createTemplate(`
      <style>
        :host {
          display: inline-block;
          --button-padding: 0.375rem 0.75rem;
          --button-font-size: 1rem;
          --button-line-height: 1.5;
          --button-border-radius: var(--ss-border-radius, 8px);
          --button-transition: color 0.3s, background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        button {
          font-family: var(--ss-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif);
          font-size: var(--button-font-size);
          line-height: var(--button-line-height);
          padding: var(--button-padding);
          border-radius: var(--button-border-radius);
          border: 1px solid transparent;
          cursor: pointer;
          transition: var(--button-transition);
        }
        button:hover {
          opacity: 0.9;
        }
        button:focus {
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        button.primary {
          color: #fff;
          background-color: var(--ss-primary-color, #0071e3);
          border-color: var(--ss-primary-color, #0071e3);
        }
        button.secondary {
          color: #fff;
          background-color: var(--ss-secondary-color, #5e5ce6);
          border-color: var(--ss-secondary-color, #5e5ce6);
        }
        button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          :host {
            --button-padding: 0.25rem 0.5rem;
            --button-font-size: 0.875rem;
          }
        }
      </style>
      <button><slot></slot></button>
    `);
  }

  connectedCallback() {
    super.connectedCallback();
    const button = this.shadowRoot.querySelector('button');
    
    if (this.hasAttribute('primary')) {
      button.classList.add('primary');
    } else if (this.hasAttribute('secondary')) {
      button.classList.add('secondary');
    }

    // Accessibility enhancements
    this.setAttributes(button, {
      role: this.getAttribute('role') || 'button',
      'aria-label': this.getAttribute('aria-label') || this.textContent.trim(),
      'aria-disabled': this.hasAttribute('disabled') ? 'true' : 'false'
    });

    if (this.hasAttribute('disabled')) {
      button.disabled = true;
    }
  }

  static get observedAttributes() {
    return ['disabled', 'aria-label'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      const button = this.shadowRoot.querySelector('button');
      if (name === 'disabled') {
        button.disabled = this.hasAttribute('disabled');
        button.setAttribute('aria-disabled', this.hasAttribute('disabled') ? 'true' : 'false');
      } else if (name === 'aria-label') {
        button.setAttribute('aria-label', newValue);
      }
    }
  }
}

// Card Component
class SSCard extends SimpliStyleElement {
  constructor() {
    super();
    this.template = createTemplate(`
      <style>
        :host {
          display: block;
          --card-padding: 1.25rem;
          --card-border-radius: var(--ss-border-radius, 8px);
          --card-box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .card {
          background-color: var(--ss-card-bg, #fff);
          border: 1px solid var(--ss-border-color, #c6c6c8);
          border-radius: var(--card-border-radius);
          padding: var(--card-padding);
          box-shadow: var(--card-box-shadow);
        }
        ::slotted(h2:first-child), ::slotted(h3:first-child) {
          margin-top: 0;
        }
        @media (max-width: 768px) {
          :host {
            --card-padding: 1rem;
          }
        }
      </style>
      <div class="card">
        <slot></slot>
      </div>
    `);
  }
}

// Navigation Component
class SSNav extends SimpliStyleElement {
  constructor() {
    super();
    this.template = createTemplate(`
      <style>
        :host {
          display: block;
        }
        nav {
          background-color: var(--ss-nav-bg, #f8f9fa);
          padding: 1rem;
        }
        ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
        }
        ::slotted(li) {
          margin-right: 1rem;
        }
        ::slotted(a) {
          color: var(--ss-nav-link-color, #0071e3);
          text-decoration: none;
          transition: color 0.3s;
        }
        ::slotted(a:hover), ::slotted(a:focus) {
          color: var(--ss-nav-link-hover-color, #004e9e);
        }
        @media (max-width: 768px) {
          ul {
            flex-direction: column;
          }
          ::slotted(li) {
            margin-right: 0;
            margin-bottom: 0.5rem;
          }
        }
      </style>
      <nav>
        <ul><slot></slot></ul>
      </nav>
    `);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'navigation');
    this.setAttribute('aria-label', this.getAttribute('aria-label') || 'Main navigation');
  }
}

// Modal Component
class SSModal extends SimpliStyleElement {
  constructor() {
    super();
    this.template = createTemplate(`
      <style>
        :host {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background-color: var(--ss-modal-bg, white);
          padding: 2rem;
          border-radius: var(--ss-border-radius, 8px);
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }
        .close {
          float: right;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          color: var(--ss-modal-close-color, #333);
        }
        @media (max-width: 768px) {
          .modal {
            max-width: 90%;
            padding: 1rem;
          }
        }
      </style>
      <div class="modal" role="dialog" aria-modal="true">
        <button class="close" aria-label="Close modal">&times;</button>
        <slot></slot>
      </div>
    `);
    this._handleKeydown = this._handleKeydown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.querySelector('.close').addEventListener('click', () => this.close());
    this.addEventListener('click', (e) => {
      if (e.target === this) this.close();
    });
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._handleKeydown);
  }

  open() {
    this.style.display = 'flex';
    document.addEventListener('keydown', this._handleKeydown);
    this.dispatchEvent(new CustomEvent('ssmodalopen'));
    
    // Focus trap
    const focusableElements = this.shadowRoot.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    this._firstFocusableElement = focusableElements[0];
    this._lastFocusableElement = focusableElements[focusableElements.length - 1];
    this._firstFocusableElement.focus();
  }

  close() {
    this.style.display = 'none';
    document.removeEventListener('keydown', this._handleKeydown);
    this.dispatchEvent(new CustomEvent('ssmodalclose'));
  }

  _handleKeydown(e) {
    if (e.key === 'Escape') {
      this.close();
    } else if (e.key === 'Tab') {
      // Focus trap
      if (e.shiftKey) {
        if (document.activeElement === this._firstFocusableElement) {
          e.preventDefault();
          this._lastFocusableElement.focus();
        }
      } else {
        if (document.activeElement === this._lastFocusableElement) {
          e.preventDefault();
          this._firstFocusableElement.focus();
        }
      }
    }
  }
}

// Tooltip Component
class SSTooltip extends SimpliStyleElement {
  constructor() {
    super();
    this.template = createTemplate(`
      <style>
        :host {
          position: relative;
          display: inline-block;
        }
        .tooltip {
          visibility: hidden;
          background-color: var(--ss-tooltip-bg, black);
          color: var(--ss-tooltip-color, white);
          text-align: center;
          border-radius: 6px;
          padding: 5px;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s;
          white-space: nowrap;
        }
        :host(:hover) .tooltip,
        :host(:focus) .tooltip,
        :host(:focus-within) .tooltip {
          visibility: visible;
          opacity: 1;
        }
      </style>
      <slot></slot>
      <span class="tooltip" role="tooltip"></span>
    `);
  }

  connectedCallback() {
    super.connectedCallback();
    const tooltip = this.shadowRoot.querySelector('.tooltip');
    tooltip.textContent = this.getAttribute('text') || '';
    
    // Accessibility
    this.setAttribute('tabindex', '0');
    this.setAttribute('aria-describedby', 'tooltip');
    tooltip.id = 'tooltip';
  }

  static get observedAttributes() {
    return ['text'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'text' && oldValue !== newValue) {
      this.shadowRoot.querySelector('.tooltip').textContent = newValue;
    }
  }
}

// Accordion Component
class SSAccordion extends SimpliStyleElement {
  constructor() {
    super();
    this.template = createTemplate(`
      <style>
        :host {
          display: block;
          border: 1px solid var(--ss-border-color, #c6c6c8);
          border-radius: var(--ss-border-radius, 8px);
          overflow: hidden;
        }
        .accordion-item {
          border-bottom: 1px solid var(--ss-border-color, #c6c6c8);
        }
        .accordion-item:last-child {
          border-bottom: none;
        }
        .accordion-header {
          background-color: var(--ss-accordion-header-bg, #f8f9fa);
          padding: 1rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .accordion-content {
          padding: 1rem;
          display: none;
        }
        .accordion-content.active {
          display: block;
        }
      </style>
      <slot></slot>
    `);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick.bind(this));
  }

  _handleClick(event) {
    const header = event.target.closest('.accordion-header');
    if (header) {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      content.classList.toggle('active');
      header.setAttribute('aria-expanded', content.classList.contains('active'));
    }
  }
}

// Tabs Component
class SSTabs extends SimpliStyleElement {
  constructor() {
    super();
    this.template = createTemplate(`
      <style>
        :host {
          display: block;
        }
        .tabs {
          display: flex;
          border-bottom: 1px solid var(--ss-border-color, #c6c6c8);
        }
        .tab {
          padding: 0.5rem 1rem;
          cursor: pointer;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
        }
        .tab.active {
          border-bottom-color: var(--ss-primary-color, #0071e3);
        }
        .tab-content {
          display: none;
          padding: 1rem;
        }
        .tab-content.active {
          display: block;
        }
      </style>
      <div class="tabs"></div>
      <div class="tab-contents">
        <slot></slot>
      </div>
    `);
  }

  connectedCallback() {
    super.connectedCallback();
    this._createTabs();
    this._selectTab