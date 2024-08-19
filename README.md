# SimpliStyle Web Components

SimpliStyle is a lightweight, customizable web component framework inspired by Apple's design principles. It provides a set of reusable, accessible UI components that can be easily integrated into any web project.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Components](#components)
   - [Button](#button)
   - [Card](#card)
   - [Navigation](#navigation)
   - [Modal](#modal)
   - [Tooltip](#tooltip)
   - [Accordion](#accordion)
   - [Tabs](#tabs)
4. [Utility Classes](#utility-classes)
5. [Customization](#customization)
6. [Accessibility](#accessibility)
7. [Browser Support](#browser-support)

## Installation

You can include SimpliStyle in your project using one of the following methods:

### CDN (Recommended)

Add the following lines to your HTML file:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simplistyle@latest/dist/simplistyle-global.min.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/simplistyle@latest/dist/simplistyle-components.min.js"></script>
```

### npm

Install the package using npm:

```bash
npm install simplistyle
```

Then import the components and CSS in your JavaScript file:

```javascript
import 'simplistyle/dist/simplistyle-global.min.css';
import 'simplistyle';
```

## Usage

After including SimpliStyle in your project, you can use the components directly in your HTML:

```html
<ss-button primary class="ss-mt-2">Click me</ss-button>
```

## Components

### Button

A customizable button component.

#### Example:

```html
<ss-button>Default Button</ss-button>
<ss-button primary>Primary Button</ss-button>
<ss-button secondary>Secondary Button</ss-button>
<ss-button disabled>Disabled Button</ss-button>
```

#### Attributes:

- `primary`: Applies primary button styles
- `secondary`: Applies secondary button styles
- `disabled`: Disables the button
- `aria-label`: Sets a custom aria-label for accessibility

### Card

A container component for grouping related content.

#### Example:

```html
<ss-card>
  <h2>Card Title</h2>
  <p>This is some card content.</p>
  <ss-button>Learn More</ss-button>
</ss-card>
```

### Navigation

A responsive navigation component.

#### Example:

```html
<ss-nav>
  <li><a href="#home">Home</a></li>
  <li><a href="#about">About</a></li>
  <li><a href="#contact">Contact</a></li>
</ss-nav>
```

### Modal

A modal dialog component.

#### Example:

```html
<ss-button id="openModalBtn">Open Modal</ss-button>

<ss-modal id="myModal">
  <h2>Modal Title</h2>
  <p>This is the modal content.</p>
  <ss-button>Close</ss-button>
</ss-modal>

<script>
  const modal = document.querySelector('#myModal');
  const openBtn = document.querySelector('#openModalBtn');
  openBtn.addEventListener('click', () => modal.open());
</script>
```

#### Methods:

- `open()`: Opens the modal
- `close()`: Closes the modal

#### Events:

- `ssmodalopen`: Fired when the modal is opened
- `ssmodalclose`: Fired when the modal is closed

### Tooltip

A tooltip component for displaying additional information.

#### Example:

```html
<ss-tooltip text="This is a helpful tip!">
  Hover over me
</ss-tooltip>
```

#### Attributes:

- `text`: The text to display in the tooltip

### Accordion

An accordion component for displaying collapsible content panels.

#### Example:

```html
<ss-accordion>
  <div class="accordion-item">
    <div class="accordion-header">Section 1</div>
    <div class="accordion-content">Content for section 1</div>
  </div>
  <div class="accordion-item">
    <div class="accordion-header">Section 2</div>
    <div class="accordion-content">Content for section 2</div>
  </div>
</ss-accordion>
```

### Tabs

A tabbed interface component.

#### Example:

```html
<ss-tabs>
  <ss-tab-panel label="Tab 1">Content for Tab 1</ss-tab-panel>
  <ss-tab-panel label="Tab 2">Content for Tab 2</ss-tab-panel>
  <ss-tab-panel label="Tab 3">Content for Tab 3</ss-tab-panel>
</ss-tabs>
```

## Utility Classes

SimpliStyle provides a set of utility classes for quick styling:

- Text alignment: `ss-text-center`, `ss-text-left`, `ss-text-right`
- Margins: `ss-mt-1`, `ss-mb-2`, `ss-ml-3`, `ss-mr-1`, etc.
- Padding: `ss-p-1`, `ss-p-2`, `ss-p-3`
- Display: `ss-d-none`, `ss-d-block`, `ss-d-flex`
- Flexbox: `ss-justify-content-start`, `ss-align-items-center`, etc.
- Responsive utilities: `ss-hidden-sm`, `ss-hidden-md`, `ss-hidden-lg`, `ss-hidden-xl`

Example:

```html
<div class="ss-d-flex ss-justify-content-between ss-align-items-center ss-p-2">
  <ss-button>Left</ss-button>
  <ss-button>Right</ss-button>
</div>
```

## Customization

SimpliStyle uses CSS custom properties (variables) for easy customization. You can override these variables in your own CSS:

```css
:root {
  --ss-primary-color: #0071e3;
  --ss-secondary-color: #5e5ce6;
  --ss-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --ss-border-radius: 8px;
}
```

### Dark Mode Toggle Example

SimpliStyle supports easy theming, including the ability to implement a dark mode. Here's an example of how to create a dark mode toggle:

1. First, define your light and dark theme variables:

```css
:root {
  /* Light theme (default) */
  --ss-bg-color: #ffffff;
  --ss-text-color: #333333;
  --ss-card-bg: #f0f0f0;
  
  /* Dark theme */
  --ss-dark-bg-color: #333333;
  --ss-dark-text-color: #ffffff;
  --ss-dark-card-bg: #1a1a1a;
}

/* Dark mode styles */
:root.dark-mode {
  --ss-bg-color: var(--ss-dark-bg-color);
  --ss-text-color: var(--ss-dark-text-color);
  --ss-card-bg: var(--ss-dark-card-bg);
}

/* Apply these variables to your elements */
body {
  background-color: var(--ss-bg-color);
  color: var(--ss-text-color);
}

ss-card {
  --ss-card-bg: var(--ss-card-bg);
}
```

2. Create a toggle button:

```html
<ss-button id="darkModeToggle">Toggle Dark Mode</ss-button>
```

3. Add JavaScript to toggle the dark mode:

```html
<script>
  const darkModeToggle = document.getElementById('darkModeToggle');
  const root = document.documentElement;

  darkModeToggle.addEventListener('click', () => {
    root.classList.toggle('dark-mode');
    
    // Optional: Save the user's preference
    const isDarkMode = root.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update button text
    darkModeToggle.textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  });

  // Optional: Load user's preference on page load
  if (localStorage.getItem('darkMode') === 'true') {
    root.classList.add('dark-mode');
    darkModeToggle.textContent = 'Switch to Light Mode';
  }
</script>
```

This example demonstrates how to:
- Define CSS custom properties for both light and dark themes
- Create a button to toggle between themes
- Use JavaScript to switch themes and save the user's preference
- Load the user's preferred theme on page load

You can expand on this example by adding more variables for different components and adjusting the styles as needed for your specific design.

## Accessibility

SimpliStyle components are built with accessibility in mind, following WCAG 2.1 guidelines. They include proper ARIA attributes and keyboard navigation support.

## Browser Support

SimpliStyle supports all modern browsers that implement the Web Components standards:

- Chrome (and Chromium-based browsers)
- Firefox
- Safari
- Edge (Chromium-based versions)

For older browsers, you may need to use polyfills for Web Components support.

---

For more detailed documentation and advanced usage, please visit our [official documentation](https://simplistyle.com/docs).
