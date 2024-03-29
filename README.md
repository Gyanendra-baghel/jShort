# jShort

jShort is a lightweight JavaScript library for common web development tasks, providing modules for DOM manipulation, AJAX requests, event handling, utility functions, and element creation.

## Installation

You can install Your Library Name via npm or include it directly in your HTML file:

### Via npm

```bash
npm install jshort
```

### Directly in HTML

```html
<script src="dist/jshort.js"></script>
```

## Usage

Here's how you can use the modules provided by jShort:

### DOM manipulation

```javascript
import { $ } from 'jshort';

// Create a DOM element
const element = $('.selector');

// Add a class to the element
element.addClass('class-name');

// Remove a class from the element
element.removeClass('class-name');

// Add an event listener to the element
element.on('click', function() {
  // Handle click event
});
```

### AJAX requests

```javascript
import { jShort } from 'jshort';

// Make an AJAX request
jShort.ajax({
  url: 'https://api.example.com/data',
  method: 'GET',
  success: function(response) {
    // Handle successful response
  },
  error: function(status, statusText) {
    // Handle error
  }
});
```

### Event handling

```javascript
import { $ } from 'jshort';

// Add event listener to an element
const element = $('my-element');
element.on('click', function() {
  // Handle click event
});
```


### Element creation

```javascript
import { $ } from 'jshort';

// Create a new DOM element
const newElement = $.create({
  tag: 'div',
  class: 'my-class',
  html: 'Hello, world!',
  attr: {
    'data-id': '123'
  },
  childs: ['span', { tag: 'a', html: 'Link' }]
});


```

## Contributing

Contributions are welcome! Please read the [contribution guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Feel free to customize the README.md file according to your library's features, usage instructions, and documentation links. Make sure to include relevant information to help users understand how to use your library effectively.