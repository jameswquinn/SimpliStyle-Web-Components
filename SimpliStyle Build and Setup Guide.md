# SimpliStyle Build and Setup Guide

## Project Structure

First, let's set up the project structure:

```
simplistyle/
├── src/
│   ├── simplistyle-components.js
│   └── simplistyle-global.css
├── vite.config.js
├── package.json
└── .npmignore
```

## Main Component File

Let's create the main component file `src/simplistyle-components.js`:

```javascript
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

```


# SimpliStyle Build and Setup Guide - Part 2

## Global CSS File

Create the file `src/simplistyle-global.css` with the following content:

```css
/* src/simplistyle-global.css */

:root {
  /* Colors */
  --ss-primary-color: #0071e3;
  --ss-secondary-color: #5e5ce6;
  --ss-success-color: #34c759;
  --ss-warning-color: #ff9f0a;
  --ss-error-color: #ff3b30;
  --ss-background-color: #f2f2f7;
  --ss-text-color: #1c1c1e;
  --ss-light-text-color: #8e8e93;

  /* Typography */
  --ss-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --ss-font-size-base: 16px;
  --ss-line-height-base: 1.5;

  /* Spacing */
  --ss-spacing-unit: 8px;

  /* Borders */
  --ss-border-radius: 8px;
  --ss-border-width: 1px;
  --ss-border-color: #c6c6c8;

  /* Shadows */
  --ss-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --ss-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --ss-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --ss-transition-speed: 0.3s;
}

/* Base Styles */
body {
  font-family: var(--ss-font-family);
  font-size: var(--ss-font-size-base);
  line-height: var(--ss-line-height-base);
  color: var(--ss-text-color);
  background-color: var(--ss-background-color);
}

/* Typography */
h1, .ss-h1 { font-size: 2.5rem; }
h2, .ss-h2 { font-size: 2rem; }
h3, .ss-h3 { font-size: 1.75rem; }
h4, .ss-h4 { font-size: 1.5rem; }
h5, .ss-h5 { font-size: 1.25rem; }
h6, .ss-h6 { font-size: 1rem; }

/* Utility Classes */
.ss-text-center { text-align: center; }
.ss-text-left { text-align: left; }
.ss-text-right { text-align: right; }

.ss-mt-1 { margin-top: calc(var(--ss-spacing-unit) * 1); }
.ss-mt-2 { margin-top: calc(var(--ss-spacing-unit) * 2); }
.ss-mt-3 { margin-top: calc(var(--ss-spacing-unit) * 3); }

.ss-mb-1 { margin-bottom: calc(var(--ss-spacing-unit) * 1); }
.ss-mb-2 { margin-bottom: calc(var(--ss-spacing-unit) * 2); }
.ss-mb-3 { margin-bottom: calc(var(--ss-spacing-unit) * 3); }

.ss-ml-1 { margin-left: calc(var(--ss-spacing-unit) * 1); }
.ss-ml-2 { margin-left: calc(var(--ss-spacing-unit) * 2); }
.ss-ml-3 { margin-left: calc(var(--ss-spacing-unit) * 3); }

.ss-mr-1 { margin-right: calc(var(--ss-spacing-unit) * 1); }
.ss-mr-2 { margin-right: calc(var(--ss-spacing-unit) * 2); }
.ss-mr-3 { margin-right: calc(var(--ss-spacing-unit) * 3); }

.ss-p-1 { padding: calc(var(--ss-spacing-unit) * 1); }
.ss-p-2 { padding: calc(var(--ss-spacing-unit) * 2); }
.ss-p-3 { padding: calc(var(--ss-spacing-unit) * 3); }

.ss-d-none { display: none; }
.ss-d-block { display: block; }
.ss-d-flex { display: flex; }

.ss-justify-content-start { justify-content: flex-start; }
.ss-justify-content-center { justify-content: center; }
.ss-justify-content-end { justify-content: flex-end; }
.ss-justify-content-between { justify-content: space-between; }

.ss-align-items-start { align-items: flex-start; }
.ss-align-items-center { align-items: center; }
.ss-align-items-end { align-items: flex-end; }

/* Animations */
@keyframes ss-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ss-fade-in {
  animation: ss-fade-in var(--ss-transition-speed) ease-in;
}

.ss-scale-on-hover {
  transition: transform var(--ss-transition-speed);
}

.ss-scale-on-hover:hover {
  transform: scale(1.05);
}

/* Responsive Utilities */
@media (max-width: 576px) {
  .ss-hidden-sm { display: none; }
}

@media (min-width: 577px) and (max-width: 768px) {
  .ss-hidden-md { display: none; }
}

@media (min-width: 769px) and (max-width: 992px) {
  .ss-hidden-lg { display: none; }
}

@media (min-width: 993px) {
  .ss-hidden-xl { display: none; }
}

/* Accessibility */
.ss-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --ss-background-color: #000000;
    --ss-text-color: #ffffff;
    --ss-light-text-color: #8e8e93;
    --ss-border-color: #38383a;
  }
}
```

## Vite Configuration

Create a `vite.config.js` file in the root of your project with the following content:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/simplistyle-components.js'),
      name: 'SimpliStyle',
      fileName: (format) => `simplistyle.${format}.js`
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  },
  plugins: [
    {
      name: 'custom-css-plugin',
      generateBundle(options, bundle) {
        bundle['simplistyle-global.css'] = {
          isAsset: true,
          type: 'asset',
          fileName: 'simplistyle-global.css',
          source: require('fs').readFileSync(resolve(__dirname, 'src/simplistyle-global.css'), 'utf-8')
        };
      }
    }
  ]
});
```

This Vite configuration does the following:

1. It sets up the build for a library, with the entry point being our `simplistyle-components.js` file.
2. It generates different output formats (ES module, UMD, etc.) for our library.
3. It includes a custom plugin to include our global CSS file in the build output.

With this configuration, when you run the build command, Vite will:
- Bundle your web components into a JavaScript file.
- Copy your global CSS file into the dist folder.

# SimpliStyle Build and Setup Guide - Part 3

## Package Configuration

Create a `package.json` file in the root of your project with the following content:

```json
{
  "name": "simplistyle",
  "version": "1.0.0",
  "description": "A lightweight, customizable web component framework inspired by Apple's design principles",
  "main": "dist/simplistyle.umd.js",
  "module": "dist/simplistyle.es.js",
  "exports": {
    ".": {
      "import": "./dist/simplistyle.es.js",
      "require": "./dist/simplistyle.umd.js"
    },
    "./css": "./dist/simplistyle-global.css"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "keywords": [
    "web-components",
    "css-framework",
    "ui-components"
  ],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "vite": "^4.3.9"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/simplistyle.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/simplistyle/issues"
  },
  "homepage": "https://github.com/yourusername/simplistyle#readme"
}
```

Make sure to replace "Your Name" and "yourusername" with your actual name and GitHub username.

## NPM Ignore File

Create a `.npmignore` file in the root of your project to specify which files should be excluded when publishing to npm:

```
# .npmignore
src/
vite.config.js
.gitignore
```

This will ensure that only the necessary files are included in your npm package.

## Building the Package

To build your SimpliStyle package, run the following command in your terminal:

```bash
npm run build
```

This will create a `dist` folder containing the bundled JavaScript files and the global CSS file.

## Publishing to npm

Before publishing, make sure you have an npm account and are logged in. If you haven't logged in, use the following command:

```bash
npm login
```

Once you're logged in, you can publish your package using:

```bash
npm publish
```

If this is the first time you're publishing this package, and the name is available, it will create a new package on npm. If you're updating an existing package, make sure to update the version number in `package.json` before publishing.

## Updating the Package

When you make changes to your package and want to publish a new version:

1. Update the version number in `package.json`. You can do this manually or use the `npm version` command:

   ```bash
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```

2. Rebuild the package:

   ```bash
   npm run build
   ```

3. Publish the new version:

   ```bash
   npm publish
   ```

## Using the Published Package

Once published, users can install your package using:

```bash
npm install simplistyle
```

They can then import and use your components in their JavaScript:

```javascript
import 'simplistyle';
import 'simplistyle/css';

// Now they can use your components
// <ss-button>Click me</ss-button>
```

## Development Workflow

1. Make changes to your components in `src/simplistyle-components.js` or styles in `src/simplistyle-global.css`.
2. Run `npm run dev` to start a development server and test your changes.
3. Once satisfied, build your package with `npm run build`.
4. Test the built package locally if needed.
5. Update the version number in `package.json`.
6. Publish the new version with `npm publish`.

## Conclusion

You now have a complete setup for building, publishing, and maintaining your SimpliStyle web component library. This setup allows for easy development, building, and publishing of your package to npm, making it accessible for other developers to use in their projects.

Remember to keep your README.md file up to date with any new features or changes, and consider setting up automated testing and continuous integration for your project as it grows.
