# Drop-in Content Editor System

A powerful, lightweight content management system that transforms any website into an editable interface with just two files and simple HTML attributes. Built with Alpine.js for maximum compatibility and ease of integration.

## 🚀 Key Advantages

### **Zero Configuration Setup**

- **Drop-in Solution**: Add just 2 files (`editor.css`, `editor.js`) to any project
- **No Build Process**: Works with vanilla HTML, no compilation required
- **Framework Agnostic**: Compatible with any backend (PHP, Node.js, Python, etc.)
- **CDN Ready**: All dependencies loaded from CDN

### **Intelligent Content Detection**

- **Auto-Field Generation**: Automatically creates appropriate inputs based on data structure
- **Smart Type Detection**: Recognizes text, textarea, images, galleries, tags, toggles, and more
- **Dynamic Forms**: No manual form configuration needed
- **Flexible Data Structure**: Works with any JSON structure

### **Professional User Experience**

- **Modern UI**: Clean, professional design with subtle animations
- **Mobile Optimized**: Full responsive design with touch-friendly controls
- **Rich Text Editing**: Built-in WYSIWYG editor with bold, italic, and link support
- **Image Management**: Upload, resize, and manage images with base64 encoding
- **Gallery Support**: Multi-image galleries with reordering and titles

### **Developer Friendly**

- **Simple Integration**: Just add `data-edit` attributes to existing HTML
- **Server Agnostic**: Works with any backend that can handle POST requests
- **Data Preservation**: Maintains original data structure for compatibility
- **Error Handling**: Comprehensive error reporting and user feedback

## 🛠 Implementation

### **Core Architecture**

The system consists of three main components:

1. **HTML Attributes**: `data-edit` attributes mark editable content
2. **Alpine.js Component**: Reactive modal editor with form generation
3. **Server Integration**: Simple POST endpoint for data persistence

### **How It Works**

```html
<!-- Any element with data-edit becomes editable -->
<div data-edit="posts.1">
	<h2>{{ post.title }}</h2>
	<p>{{ post.content }}</p>
</div>
```

1. **Click Detection**: System listens for clicks on `data-edit` elements
2. **Data Parsing**: Extracts data path (e.g., "posts.1" = posts array, item with ID 1)
3. **Form Generation**: Automatically creates appropriate inputs based on data types
4. **Modal Display**: Shows professional editing interface
5. **Save & Sync**: Updates data and refreshes page content seamlessly

### **Field Type Detection**

The system automatically detects field types:

```javascript
// Image fields
if (key === 'image') field.type = 'image';

// Gallery/multiple images
if (key === 'gallery' || key === 'images') field.type = 'gallery';

// Tags (string arrays)
if (Array.isArray(value) && typeof value[0] === 'string') field.type = 'tags';

// Boolean toggles
if (typeof value === 'boolean') field.type = 'checkbox';

// Rich text content
if (key === 'content' || key === 'description') field.type = 'textarea';

// Status dropdowns
if (key === 'status') field.type = 'radio';
```

## 📁 File Structure

```
your-project/
├── editor.css          # Complete styling (1 file)
├── editor.js           # Complete functionality (1 file)
├── data.json          # Your content data
└── your-pages.html    # Your existing pages with data-edit attributes
```

## 🔧 Integration Guide

### **Step 1: Add Files**

Include the editor files in your HTML:

```html
<head>
	<!-- Alpine.js (required) -->
	<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

	<!-- Editor System -->
	<link rel="stylesheet" href="editor.css" />
	<script src="editor.js"></script>
</head>
```

### **Step 2: Configure Data Source**

Set your data URL (defaults to "data.json"):

```javascript
// Optional: Configure data source
cfg.data_url = 'api/content.json'; // or any URL
```

### **Step 3: Add Edit Attributes**

Mark content as editable:

```html
<!-- Single object editing -->
<div data-edit="site">
	<h1>{{ site.title }}</h1>
	<p>{{ site.description }}</p>
</div>

<!-- Collection item editing -->
<article data-edit="posts.{{ post.id }}">
	<h2>{{ post.title }}</h2>
	<div>{{ post.content }}</div>
	<img src="{{ post.image }}" alt="{{ post.title }}" />
</article>
```

### **Step 4: Server Endpoint**

Create a simple save endpoint:

```php
// PHP example
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    file_put_contents('data.json', json_encode($data, JSON_PRETTY_PRINT));
    http_response_code(200);
    echo json_encode(['success' => true]);
}
```

```javascript
// Node.js example
app.post('/api/save', (req, res) => {
	fs.writeFileSync('data.json', JSON.stringify(req.body, null, 2));
	res.json({ success: true });
});
```

## 🎨 Features

### **Dual View System**

- **Edit Item**: Focus on single item with rich editing tools
- **All Items**: Overview with bulk operations and reordering
- **Split Button Interface**: Clear visual separation of modes

### **Rich Content Types**

- **Text Fields**: Auto-sized inputs with focus states
- **Rich Text**: WYSIWYG editor with formatting toolbar
- **Image Upload**: Automatic resizing to 750px width, base64 storage
- **Image Galleries**: Multiple images with titles and reordering
- **Tag System**: Dynamic tag addition/removal with visual chips
- **Toggle Switches**: Elegant boolean controls
- **Select Dropdowns**: Predefined option lists
- **Radio Groups**: Mutually exclusive selections

### **Advanced Interactions**

- **Smart Click Detection**: Ignores clicks on buttons/links within editable areas
- **Scroll Management**: Auto-scroll to top when opening/switching views
- **Save States**: Visual feedback with spinners and success states
- **Error Handling**: Detailed error messages and recovery options
- **Mobile Optimization**: Touch-friendly controls and full-screen modals

### **Data Management**

- **Flat Structure Preservation**: Maintains original data organization
- **Auto ID Generation**: Sequential IDs for new items
- **Delete Protection**: Prevents deletion of last item in collections
- **Real-time Sync**: Updates page content without full reload

## 🎯 Use Cases

### **Blog Management**

```html
<article data-edit="posts.{{ post.id }}">
	<h1>{{ post.title }}</h1>
	<img src="{{ post.image }}" alt="{{ post.title }}" />
	<div>{{ post.content }}</div>
	<div class="tags">
		{% for tag in post.tags %}
		<span class="tag">{{ tag }}</span>
		{% endfor %}
	</div>
</article>
```

### **Portfolio Sites**

```html
<div data-edit="projects.{{ project.id }}">
	<h2>{{ project.name }}</h2>
	<div class="gallery">
		{% for image in project.gallery %}
		<img src="{{ image.src }}" alt="{{ image.title }}" />
		{% endfor %}
	</div>
	<p>{{ project.description }}</p>
</div>
```

### **Site Settings**

```html
<header data-edit="site">
	<h1>{{ site.title }}</h1>
	<nav>
		<a href="{{ site.contact_email }}">Contact</a>
	</nav>
</header>
```

## 🔒 Security Considerations

- **Server Validation**: Always validate data on the server side
- **File Permissions**: Ensure proper write permissions for data files
- **Access Control**: Implement authentication for production use
- **Input Sanitization**: Sanitize user input before saving

## 📱 Mobile Features

- **Full-Screen Modals**: Maximizes editing space on mobile
- **Touch Optimizations**: Large touch targets and swipe gestures
- **iOS Zoom Prevention**: Prevents unwanted zooming on input focus
- **Icon-Only Navigation**: Compact interface for small screens

## 🎨 Customization

### **Styling**

The system uses CSS custom properties for easy theming:

```css
:root {
	--editor-primary: #1f2937;
	--editor-secondary: #6b7280;
	--editor-accent: #3b82f6;
	--editor-border-radius: 0.375rem;
}
```

### **Field Types**

Add custom field types by extending the detection logic:

```javascript
// In generateFormFields method
if (key === 'custom_field') {
	field.type = 'custom';
	field.options = ['option1', 'option2'];
}
```

## 🚀 Performance

- **Lightweight**: ~15KB total (CSS + JS combined)
- **No Dependencies**: Only requires Alpine.js from CDN
- **Lazy Loading**: Modal content generated on-demand
- **Efficient Updates**: Targeted DOM updates, not full page reloads
- **Image Optimization**: Automatic resizing reduces file sizes

## 📄 License

MIT License - Free for personal and commercial use.

---

**Transform any website into a content management system with just two files!**
