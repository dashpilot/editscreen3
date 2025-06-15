# Beautiful Modal Editor with Alpine.js

A stunning, responsive modal editor built with Alpine.js that dynamically generates form inputs based on JSON data structure. Perfect for editing blog posts or any structured data.

## Features

✨ **Dynamic Form Generation**: Automatically creates appropriate input fields based on data types
🎨 **Beautiful UI**: Glassmorphism design with gradient backgrounds and smooth animations
📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
🔧 **Type-Aware**: Handles strings, numbers, booleans, arrays, and dates intelligently
🚀 **No Build Process**: Pure Alpine.js with CDN - just open and run
🎭 **Smooth Animations**: Elegant transitions and hover effects
✅ **Success Feedback**: Toast notifications for user actions

## How It Works

1. **Click to Edit**: Click on any post card with `data-edit="{id}"` attribute
2. **Auto-Detection**: The modal automatically detects field types from your JSON data
3. **Smart Inputs**: Generates appropriate input types:
   - Text inputs for strings
   - Textareas for content fields
   - Date pickers for date fields
   - Number inputs for numeric values
   - Toggle switches for booleans
   - Comma-separated inputs for arrays
4. **Save Changes**: Updates are reflected immediately in the UI

## File Structure

```
├── index.html          # Main application file
├── data.json          # Sample blog posts data
└── README.md          # This documentation
```

## Data Structure

The editor works with any JSON structure. Here's the sample format:

```json
{
	"posts": [
		{
			"id": "1",
			"title": "Post Title",
			"content": "Long form content...",
			"author": "Author Name",
			"publishDate": "2024-01-15",
			"category": "Category",
			"featured": true,
			"tags": ["tag1", "tag2"],
			"readTime": 5,
			"status": "published"
		}
	]
}
```

## Supported Field Types

- **String**: Regular text input
- **Number**: Number input with spinners
- **Boolean**: Elegant toggle switch
- **Array**: Comma-separated text input
- **Date**: Native date picker (for fields containing "date" or "Date")
- **Content**: Textarea (for fields named "content", "description", etc.)

## Customization

### Adding New Field Types

To add support for new field types, modify the form template in `index.html`:

```html
<!-- Custom Select Input -->
<div x-show="key === 'status'">
	<select :name="key" x-model="currentPost[key]" class="input-field w-full px-4 py-3 rounded-xl">
		<option value="draft">Draft</option>
		<option value="published">Published</option>
	</select>
</div>
```

### Styling

The design uses:

- **Tailwind CSS** for utility classes
- **Custom CSS** for glassmorphism effects
- **Inter Font** from Google Fonts
- **Gradient backgrounds** and **backdrop filters**

### Colors

Main color scheme:

- Primary: Purple gradient (`#667eea` to `#764ba2`)
- Secondary: Pink gradient (`#f093fb` to `#f5576c`)
- Background: Light purple to blue gradient

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE (not supported - uses modern CSS features)

## Usage

1. **Local Development**: Simply open `index.html` in a web browser
2. **Web Server**: Serve files through any HTTP server for CORS compatibility

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

## Contributing

Feel free to enhance the modal editor with:

- Additional field types
- Better validation
- Persistence options
- API integration
- More animation effects

## License

MIT License - feel free to use in your projects!

---

**Made with ❤️ using Alpine.js and Tailwind CSS**
