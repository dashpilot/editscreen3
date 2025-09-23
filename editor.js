// Dynamic Editor Template - generates inputs based on data structure
const editorTemplate = `
<div class="modal-overlay" x-show="isOpen" x-transition style="display: none;" @click.self="closeModal()">
    <div class="modal-container">
        <div class="modal-content">
            <div class="modal-sidebar">
                <div class="sidebar-header">
                    <h3 class="sidebar-title">Editor</h3>
                </div>
                <div class="sidebar-nav">
                    <button class="sidebar-nav-item" :class="{ active: currentTab === 'edit' }" @click="switchTab('edit')">
                        <i class="bi bi-pencil"></i>
                        <span class="nav-text">Edit Item</span>
                    </button>
                    <button class="sidebar-nav-item" :class="{ active: currentTab === 'all' }" @click="switchTab('all')" x-show="editType === 'collection'">
                        <i class="bi bi-list-ul"></i>
                        <span class="nav-text">All Items</span>
                    </button>
                </div>
            </div>
            <div class="modal-main">
                <div class="modal-header">
                    <h2 class="modal-title" x-text="currentTab === 'edit' ? 'Edit Item' : 'All ' + (collectionName || 'Items')"></h2>
                    <button class="modal-close" @click="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                <!-- Edit Item View -->
                <div class="tab-content" :class="{ active: currentTab === 'edit' }">
                    <form @submit.prevent="saveItem()">
                        <template x-for="field in formFields" :key="field.key">
                            <div class="form-group">
                                <!-- Text Input -->
                                <template x-if="field.type === 'text'">
                                    <div>
                                        <label class="form-label" :for="field.key" x-text="field.label"></label>
                                        <input 
                                            type="text" 
                                            :id="field.key"
                                            :name="field.key"
                                            class="form-input" 
                                            x-model="formData[field.key]"
                                            :required="field.required"
                                        >
                                    </div>
                                </template>
                                
                                <!-- Date Input -->
                                <template x-if="field.type === 'date'">
                                    <div>
                                        <label class="form-label" :for="field.key" x-text="field.label"></label>
                                        <input 
                                            type="date" 
                                            :id="field.key"
                                            :name="field.key"
                                            class="form-input" 
                                            x-model="formData[field.key]"
                                            :required="field.required"
                                        >
                                    </div>
                                </template>
                                
                                <!-- Textarea with Rich Text Editor -->
                                <template x-if="field.type === 'textarea'">
                                    <div>
                                        <label class="form-label" x-text="field.label"></label>
                                        <div class="rich-text-editor">
                                            <div class="rich-text-toolbar">
                                                <button type="button" class="toolbar-btn" @click="formatText('bold')" title="Bold">
                                                    <i class="bi bi-type-bold"></i>
                                                </button>
                                                <button type="button" class="toolbar-btn" @click="formatText('italic')" title="Italic">
                                                    <i class="bi bi-type-italic"></i>
                                                </button>
                                                <button type="button" class="toolbar-btn" @click="insertLink()" title="Insert Link">
                                                    <i class="bi bi-link-45deg"></i>
                                                </button>
                                            </div>
                                            <div 
                                                class="rich-text-content" 
                                                contenteditable="true"
                                                spellcheck="false"
                                                :id="'editor_' + field.key"
                                                @input="updateRichTextContent($event, field.key)"
                                                @paste="handlePaste($event)"
                                                x-init="initRichTextContent($el, field.key)"
                                            ></div>
                                        </div>
                                    </div>
                                </template>
                                
                                <!-- Select -->
                                <template x-if="field.type === 'select'">
                                    <div>
                                        <label class="form-label" :for="field.key" x-text="field.label"></label>
                                        <select 
                                            :id="field.key"
                                            :name="field.key"
                                            class="form-select" 
                                            x-model="formData[field.key]"
                                            :required="field.required"
                                        >
                                            <option value="">Select an option</option>
                                            <template x-for="option in field.options" :key="option">
                                                <option :value="option" x-text="option"></option>
                                            </template>
                                        </select>
                                    </div>
                                </template>
                                
                                <!-- Tags -->
                                <template x-if="field.type === 'tags'">
                                    <div>
                                        <label class="form-label" x-text="field.label"></label>
                                        <div class="tag-input-container">
                                            <template x-for="(tag, index) in formData[field.key]" :key="index">
                                                <span class="tag">
                                                    <span x-text="tag"></span>
                                                    <button type="button" class="tag-remove" @click="removeTag(field.key, index)">&times;</button>
                                                </span>
                                            </template>
                                            <input 
                                                type="text" 
                                                class="tag-input" 
                                                placeholder="Add tags..."
                                                @keydown.enter.prevent="addTag(field.key, $event.target.value); $event.target.value = ''"
                                            >
                                        </div>
                                    </div>
                                </template>
                                
                                <!-- Radio -->
                                <template x-if="field.type === 'radio'">
                                    <div>
                                        <label class="form-label" x-text="field.label"></label>
                                        <div class="flex gap-4">
                                            <template x-for="option in field.options" :key="option.value">
                                                <label class="flex items-center gap-2">
                                                    <input 
                                                        type="radio" 
                                                        :name="field.key"
                                                        :value="option.value"
                                                        x-model="formData[field.key]"
                                                    >
                                                    <span x-text="option.label"></span>
                                                </label>
                                            </template>
                                        </div>
                                    </div>
                                </template>
                                
                                <!-- Checkbox/Toggle -->
                                <template x-if="field.type === 'checkbox'">
                                    <div>
                                        <label class="flex items-center gap-2">
                                            <div class="toggle-switch">
                                                <input 
                                                    type="checkbox" 
                                                    :id="field.key"
                                                    :name="field.key"
                                                    x-model="formData[field.key]"
                                                >
                                                <span class="toggle-slider"></span>
                                            </div>
                                            <span x-text="field.label"></span>
                                        </label>
                                    </div>
                                </template>
                                
                                <!-- Image Upload -->
                                <template x-if="field.type === 'image'">
                                    <div>
                                        <label class="form-label" x-text="field.label"></label>
                                        <div class="image-upload-container">
                                            <template x-if="formData[field.key]">
                                                <div class="image-preview">
                                                    <img :src="formData[field.key]" alt="Preview" class="preview-image">
                                                    <button type="button" class="remove-image-btn" @click="formData[field.key] = ''" title="Remove image">
                                                        <i class="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </template>
                                            <template x-if="!formData[field.key]">
                                                <button type="button" class="image-upload-btn" @click="triggerImageUpload(field.key)">
                                                    <i class="bi bi-cloud-upload"></i>
                                                    <span>Upload Image</span>
                                                </button>
                                            </template>
                                            <input 
                                                type="file" 
                                                :id="'imageInput_' + field.key"
                                                accept="image/*" 
                                                style="display: none;"
                                                @change="handleImageUpload($event, field.key)"
                                            >
                                        </div>
                                    </div>
                                </template>
                                
                                <!-- YouTube Video -->
                                <template x-if="field.type === 'youtube'">
                                    <div>
                                        <label class="form-label" x-text="field.label"></label>
                                        <div class="youtube-input-container">
                                            <div class="youtube-input-wrapper">
                                                <input 
                                                    type="text" 
                                                    :id="field.key"
                                                    :name="field.key"
                                                    class="form-input youtube-input" 
                                                    x-model="formData[field.key]"
                                                    @input="handleYouTubeInput($event, field.key)"
                                                    :required="field.required"
                                                    placeholder="Enter YouTube ID or paste YouTube URL"
                                                >
                                                <div class="youtube-input-help">
                                                    <i class="bi bi-info-circle"></i>
                                                    <span>Paste a YouTube URL or enter just the video ID</span>
                                                </div>
                                            </div>
                                            <template x-if="formData[field.key] && isValidYouTubeId(formData[field.key])">
                                                <div class="youtube-preview">
                                                    <div class="youtube-preview-header">
                                                        <span class="youtube-preview-title">Video Preview</span>
                                                        <button type="button" class="youtube-clear-btn" @click="formData[field.key] = ''" title="Clear video">
                                                            <i class="bi bi-x"></i>
                                                        </button>
                                                    </div>
                                                    <div class="youtube-thumbnail-wrapper">
                                                        <img :src="'https://img.youtube.com/vi/' + formData[field.key] + '/hqdefault.jpg'" 
                                                             alt="YouTube video thumbnail" 
                                                             class="youtube-thumbnail"
                                                             @error="$event.target.style.display = 'none'">
                                                        <div class="youtube-play-overlay">
                                                            <i class="bi bi-play-circle-fill"></i>
                                                        </div>
                                                    </div>
                                                    <div class="youtube-info">
                                                        <div class="youtube-id">
                                                            <strong>Video ID:</strong> <span x-text="formData[field.key]"></span>
                                                        </div>
                                                        <a :href="'https://www.youtube.com/watch?v=' + formData[field.key]" 
                                                           target="_blank" 
                                                           class="youtube-link">
                                                            <i class="bi bi-box-arrow-up-right"></i>
                                                            Watch on YouTube
                                                        </a>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </template>
                                
                                <!-- Gallery/Images -->
                                <template x-if="field.type === 'gallery'">
                                    <div>
                                        <label class="form-label" x-text="field.label"></label>
                                        <div class="gallery-container">
                                            <template x-for="(galleryItem, index) in formData[field.key]" :key="index">
                                                <div class="gallery-item">
                                                    <div class="gallery-item-preview">
                                                        <img :src="galleryItem.image || galleryItem.src" alt="Gallery item" class="gallery-thumbnail">
                                                    </div>
                                                    <div class="gallery-item-controls">
                                                        <input 
                                                            type="text" 
                                                            class="gallery-title-input" 
                                                            placeholder="Image title..."
                                                            x-model="galleryItem.title"
                                                        >
                                                        <div class="gallery-actions">
                                                            <button type="button" class="gallery-btn up" @click="moveGalleryItem(field.key, index, -1)" :disabled="index === 0" title="Move up">
                                                                <i class="bi bi-arrow-up"></i>
                                                            </button>
                                                            <button type="button" class="gallery-btn down" @click="moveGalleryItem(field.key, index, 1)" :disabled="index === formData[field.key].length - 1" title="Move down">
                                                                <i class="bi bi-arrow-down"></i>
                                                            </button>
                                                            <button type="button" class="gallery-btn delete" @click="removeGalleryItem(field.key, index)" title="Delete">
                                                                <i class="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                            <button type="button" class="add-gallery-btn" @click="triggerGalleryUpload(field.key)">
                                                <i class="bi bi-plus-circle"></i>
                                                <span>Add Images</span>
                                            </button>
                                            <input 
                                                type="file" 
                                                :id="'galleryInput_' + field.key"
                                                accept="image/*" 
                                                multiple
                                                style="display: none;"
                                                @change="handleGalleryUpload($event, field.key)"
                                            >
                                        </div>
                                    </div>
                                </template>
                                
                                <!-- Array (for non-image arrays) -->
                                <template x-if="field.type === 'array'">
                                    <div>
                                        <label class="form-label" x-text="field.label"></label>
                                        <!-- Special handling for categories -->
                                        <template x-if="field.key === 'categories'">
                                            <div class="categories-container">
                                                <template x-for="(categoryItem, index) in formData[field.key]" :key="index">
                                                    <div class="category-item">
                                                        <div class="category-content">
                                                            <span class="category-name" x-text="categoryItem"></span>
                                                        </div>
                                                        <div class="category-actions">
                                                            <button type="button" class="action-btn move" @click="moveArrayItem(field.key, index, -1)" :disabled="index === 0" title="Move up">
                                                                <i class="bi bi-arrow-up"></i>
                                                            </button>
                                                            <button type="button" class="action-btn move" @click="moveArrayItem(field.key, index, 1)" :disabled="index === formData[field.key].length - 1" title="Move down">
                                                                <i class="bi bi-arrow-down"></i>
                                                            </button>
                                                            <button type="button" class="action-btn delete" @click="deleteCategoryItem(field.key, index)" title="Delete category">
                                                                <i class="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </template>
                                                <button type="button" class="button button-secondary array-add-btn" @click="addArrayItem(field.key)">
                                                    <i class="bi bi-plus"></i>
                                                    <span>Add Category</span>
                                                </button>
                                            </div>
                                        </template>
                                        <!-- Regular array handling for non-categories -->
                                        <template x-if="field.key !== 'categories'">
                                            <div class="array-container">
                                                <template x-for="(arrayItem, index) in formData[field.key]" :key="index">
                                                    <div class="array-item-group">
                                                        <div class="array-item-header">
                                                            <span class="array-item-title" x-text="'Item ' + (index + 1)"></span>
                                                            <button type="button" class="array-remove-btn" @click="removeArrayItem(field.key, index)" title="Remove">
                                                                <i class="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                        <!-- Handle string arrays -->
                                                        <template x-if="typeof arrayItem === 'string'">
                                                            <div class="array-item">
                                                                <input 
                                                                    type="text" 
                                                                    class="form-input" 
                                                                    :placeholder="'Item ' + (index + 1)"
                                                                    x-model="formData[field.key][index]"
                                                                >
                                                            </div>
                                                        </template>
                                                        <!-- Handle object arrays -->
                                                        <template x-if="typeof arrayItem === 'object' && arrayItem !== null">
                                                            <div class="array-object-fields">
                                                                <template x-for="(value, objKey) in arrayItem" :key="objKey">
                                                                    <div class="array-object-field">
                                                                        <label class="form-label" x-text="objKey.charAt(0).toUpperCase() + objKey.slice(1).replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')"></label>
                                                                        <input 
                                                                            type="text" 
                                                                            class="form-input" 
                                                                            :placeholder="objKey"
                                                                            x-model="formData[field.key][index][objKey]"
                                                                        >
                                                                    </div>
                                                                </template>
                                                            </div>
                                                        </template>
                                                    </div>
                                                </template>
                                                <button type="button" class="button button-secondary array-add-btn" @click="addArrayItem(field.key)">
                                                    <i class="bi bi-plus"></i>
                                                    <span>Add Item</span>
                                                </button>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </form>
                </div>
                
                <!-- All Items View -->
                <div class="tab-content" :class="{ active: currentTab === 'all' }" x-show="editType === 'collection'">
                    <div class="items-header">
                        <h3 class="items-title" x-text="'All ' + (collectionName || 'Items')"></h3>
                        <button class="button button-primary" @click="addNewItem()">
                            <i class="bi bi-plus"></i>
                            <span x-text="'Add New ' + (itemTypeName || 'Item')"></span>
                        </button>
                    </div>
                    <div class="items-list">
                        <template x-for="(item, index) in collectionItems" :key="item.id || item._idx || index">
                            <div class="item-card" :class="{ current: isCurrentItem(item) }" @click="editItem(item)" :data-item-id="item.id || item._idx">
                                <div class="item-info">
                                    <div class="item-title" x-text="getItemTitle(item)"></div>
                                    <div class="item-meta">
                                        <template x-if="item.category">
                                            <span class="item-category" x-text="item.category"></span>
                                        </template>
                                        <template x-if="item.status">
                                            <span class="item-status" :class="item.status" x-text="item.status"></span>
                                        </template>
                                        <template x-if="item.featured">
                                            <i class="bi bi-star-fill item-featured"></i>
                                        </template>
                                        <template x-if="item.publishDate">
                                            <span x-text="new Date(item.publishDate).toLocaleDateString()"></span>
                                        </template>
                                    </div>
                                </div>
                                <div class="item-actions">
                                    <button class="action-btn move" @click.stop="moveItem(index, -1)" :disabled="index === 0" title="Move up">
                                        <i class="bi bi-arrow-up"></i>
                                    </button>
                                    <button class="action-btn move" @click.stop="moveItem(index, 1)" :disabled="index === collectionItems.length - 1" title="Move down">
                                        <i class="bi bi-arrow-down"></i>
                                    </button>
                                    <button class="action-btn edit" @click.stop="editItem(item)" title="Edit">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="action-btn delete" @click.stop="deleteItem(item)" :disabled="collectionItems.length <= 1" title="Delete">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                </div>
                <div class="modal-footer">
                    <div class="footer-content" x-show="currentTab === 'edit'">
                        <div class="flex items-center justify-end gap-2">
                            <button type="button" class="button button-secondary" @click="closeModal()">
                                Cancel
                            </button>
                            <button type="button" class="button button-primary" @click="saveItem()" :disabled="isSaving">
                                <template x-if="isSaving">
                                    <i class="bi bi-arrow-clockwise" style="animation: spin 1s linear infinite;"></i>
                                </template>
                                <span x-text="isSaving ? 'Saving...' : 'Save'"></span>
                            </button>
                        </div>
                    </div>
                    <div class="footer-content" x-show="currentTab === 'all'">
                        <div class="flex items-center justify-end gap-2">
                            <button type="button" class="button button-secondary" @click="closeModal()">
                                Close
                            </button>
                            <button type="button" class="button button-primary" @click="saveItem()" :disabled="isSaving">
                                <template x-if="isSaving">
                                    <i class="bi bi-arrow-clockwise" style="animation: spin 1s linear infinite;"></i>
                                </template>
                                <span x-text="isSaving ? 'Saving...' : 'Save'"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// Dynamic Editor Component
function createDynamicEditor() {
	return {
		// State
		isOpen: false,
		currentTab: 'edit',
		editType: 'object', // 'object' or 'collection'
		currentItem: {},
		formData: {},
		formFields: [],
		collectionName: '',
		collectionItems: [],
		itemTypeName: '',
		data: {},
		isSaving: false,

		// Sortable instance
		sortableInstance: null,
		originalOrder: [],

		async init() {
			// Load data from data.json
			await this.loadData();

			// Listen for data-edit clicks
			document.addEventListener('click', (event) => {
				const editElement = event.target.closest('[data-edit]');
				if (editElement) {
					// Check if the clicked element is a link, button, or inside one
					const clickedElement = event.target;
					const isInteractiveElement = clickedElement.closest('a, button, input, select, textarea');

					// If clicked on an interactive element, don't trigger the modal
					if (isInteractiveElement) {
						return;
					}

					event.preventDefault();
					const dataEdit = editElement.getAttribute('data-edit');
					this.openEditor(dataEdit);
				}
			});
		},

		async loadData() {
			try {
				console.log('Attempting to fetch data from:', cfg.data_url);
				const response = await fetch(cfg.data_url);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
				}

				const rawData = await response.json();
				console.log('Successfully loaded data:', rawData);

				// Keep the original data structure intact
				this.data = rawData;

				console.log('Data loaded successfully');
			} catch (error) {
				console.error('Failed to load data:', error);
				console.error('Error details:', {
					message: error.message,
					url: cfg.data_url,
					type: error.name
				});

				// Initialize with empty data structure if loading fails
				this.data = {};
				/*
				alert(
					`Failed to load data from ${cfg.data_url}:\n${error.message}\n\nCheck the console for more details.`
				);
                */
			}
		},

		openEditor(target) {
			let editValue;

			// Handle both string values and DOM elements
			if (typeof target === 'string') {
				editValue = target;
			} else if (target && target.getAttribute) {
				editValue = target.getAttribute('data-edit');
			} else {
				console.error('Invalid target passed to openEditor:', target);
				return;
			}

			if (!editValue) return;

			console.log('Opening editor for:', editValue);

			// Parse the edit value (e.g., "site", "pages.1", "navigation.links.1")
			const parts = editValue.split('.');

			if (parts.length === 1) {
				// Editing a top-level object or array (e.g., "site", "categories")
				const key = parts[0];
				const dataValue = this.data[key];

				// Special handling for categories - treat as collection
				if (key === 'categories' && Array.isArray(dataValue)) {
					this.editType = 'collection';
					this.collectionName = key;
					this.itemTypeName = 'Category';

					// Create collection items with IDs for categories
					this.collectionItems = dataValue.map((category, index) => ({
						id: index,
						_idx: index,
						name: category,
						title: category
					}));

					// Set current item to first category or empty
					this.currentItem = this.collectionItems[0] || { id: 0, _idx: 0, name: '', title: '' };
				} else {
					this.editType = 'object';

					// If it's an array, wrap it in an object for form generation
					if (Array.isArray(dataValue)) {
						this.currentItem = { [key]: dataValue };
					} else {
						this.currentItem = dataValue || {};
					}

					this.collectionName = key;
					this.itemTypeName = this.formatLabel(key);
				}
			} else if (parts.length === 2) {
				// Editing an item in a top-level array (e.g., "pages.1")
				const key = parts[0];
				const itemId = parseInt(parts[1]);

				this.editType = 'collection';
				this.collectionName = key;
				this.itemTypeName = this.formatLabel(key.slice(0, -1)); // Remove 's' from plural

				const collection = this.data[key] || [];

				// Find item by ID
				this.currentItem = collection.find((item) => item.id === itemId);

				if (!this.currentItem) {
					console.error('Item not found:', editValue);
					return;
				}

				// Set up collection items for "All Items" view
				this.collectionItems = [...collection];
			} else if (parts.length === 3) {
				// Editing an item in a nested array (e.g., "navigation.links.1")
				const parentKey = parts[0];
				const arrayKey = parts[1];
				const itemId = parseInt(parts[2]);

				this.editType = 'collection';
				this.collectionName = `${parentKey}.${arrayKey}`;
				this.itemTypeName = this.formatLabel(arrayKey.slice(0, -1)); // Remove 's' from plural

				const parentObject = this.data[parentKey] || {};
				const collection = parentObject[arrayKey] || [];

				// Find item by ID
				this.currentItem = collection.find((item) => item.id === itemId);

				if (!this.currentItem) {
					console.error('Item not found:', editValue);
					return;
				}

				// Set up collection items for "All Items" view
				this.collectionItems = [...collection];
			} else {
				console.error('Unsupported edit path depth:', editValue);
				return;
			}

			this.generateFormFields(this.currentItem);
			this.formData = { ...this.currentItem };

			// Ensure boolean values remain as booleans
			this.preserveDataTypes();
			this.currentTab = 'edit';
			this.isOpen = true;

			// Reset scroll to top when opening modal
			this.$nextTick(() => {
				const modalBody = document.querySelector('.modal-body');
				if (modalBody) {
					modalBody.scrollTop = 0;
				}
			});
		},

		generateFormFields(item) {
			this.formFields = [];

			for (const [key, value] of Object.entries(item)) {
				if (key.startsWith('_') || key === 'id') continue; // Skip internal fields and id

				const field = {
					key,
					label: this.formatLabel(key),
					required: false
				};

				// Determine field type based on key name and value
				if (key === 'date') {
					field.type = 'date';
				} else if (key === 'image') {
					field.type = 'image';
				} else if (key === 'video' || key === 'youtube') {
					field.type = 'youtube';
				} else if (key === 'gallery' || key === 'images') {
					field.type = 'gallery';
				} else if (Array.isArray(value)) {
					// Only use gallery for specific image-related keys
					if (key === 'gallery' || key === 'images') {
						field.type = 'gallery';
					} else if (value.length === 0 || typeof value[0] === 'string') {
						// Use 'array' for top-level arrays (when the key matches the collection being edited)
						// Use 'tags' for arrays that are properties within objects (like post tags)
						if (key === this.collectionName) {
							field.type = 'array';
						} else {
							field.type = 'tags';
						}
					} else {
						// For other arrays of objects, create simple text inputs
						field.type = 'array';
					}
				} else if (typeof value === 'boolean') {
					field.type = 'checkbox';
				} else if (key === 'status') {
					field.type = 'radio';
					field.options = [
						{ value: 'draft', label: 'Draft' },
						{ value: 'published', label: 'Published' }
					];
				} else if (key === 'category') {
					field.type = 'select';
					// Use categories from data if available, otherwise fallback to hardcoded options
					field.options = this.data.categories || [
						'Technology',
						'Design',
						'Business',
						'Lifestyle',
						'JavaScript',
						'UI/UX',
						'CSS'
					];
				} else if (
					key === 'content' ||
					key === 'description' ||
					key === 'body' ||
					key === 'extended'
				) {
					field.type = 'textarea';
				} else {
					field.type = 'text';
				}

				// Mark common required fields
				if (['title', 'content', 'category'].includes(key)) {
					field.required = true;
				}

				this.formFields.push(field);
			}
		},

		formatLabel(key) {
			return (
				key.charAt(0).toUpperCase() +
				key
					.slice(1)
					.replace(/([A-Z])/g, ' $1')
					.replace(/_/g, ' ')
			);
		},

		preserveDataTypes() {
			// Ensure boolean values in formData remain as booleans
			for (const [key, value] of Object.entries(this.currentItem)) {
				if (typeof value === 'boolean') {
					// Convert string representations back to boolean if needed
					if (typeof this.formData[key] === 'string') {
						this.formData[key] = this.formData[key] === 'true';
					}
				}
			}
		},

		getCollectionByPath(path) {
			// Helper function to get collection by path (handles nested paths like "navigation.links")
			if (path.includes('.')) {
				const parts = path.split('.');
				const parentKey = parts[0];
				const arrayKey = parts[1];
				return this.data[parentKey][arrayKey];
			} else {
				return this.data[path];
			}
		},

		setCollectionByPath(path, value) {
			// Helper function to set collection by path
			if (path.includes('.')) {
				const parts = path.split('.');
				const parentKey = parts[0];
				const arrayKey = parts[1];
				if (!this.data[parentKey]) {
					this.data[parentKey] = {};
				}
				this.data[parentKey][arrayKey] = value;
			} else {
				this.data[path] = value;
			}
		},

		switchTab(tab) {
			// Don't allow switching to 'all' tab for objects
			if (tab === 'all' && this.editType !== 'collection') {
				return;
			}

			this.currentTab = tab;
			if (tab === 'all' && this.editType === 'collection') {
				// Refresh collection items
				this.collectionItems = this.getCollectionByPath(this.collectionName) || [];
			}

			// Reset scroll to top when switching tabs
			this.$nextTick(() => {
				const modalBody = document.querySelector('.modal-body');
				if (modalBody) {
					modalBody.scrollTop = 0;
				}
			});
		},

		addTag(fieldKey, value) {
			if (value.trim()) {
				if (!this.formData[fieldKey]) {
					this.formData[fieldKey] = [];
				}
				this.formData[fieldKey].push(value.trim());
			}
		},

		removeTag(fieldKey, index) {
			this.formData[fieldKey].splice(index, 1);
		},

		addArrayItem(fieldKey) {
			if (!this.formData[fieldKey]) {
				this.formData[fieldKey] = [];
			}

			// Determine what type of item to add based on existing items
			if (this.formData[fieldKey].length > 0) {
				const firstItem = this.formData[fieldKey][0];
				if (typeof firstItem === 'object' && firstItem !== null) {
					// Clone the structure of the first object with empty values
					const newItem = {};
					for (const key in firstItem) {
						newItem[key] = '';
					}
					this.formData[fieldKey].push(newItem);
				} else {
					// Add empty string for string arrays
					this.formData[fieldKey].push('');
				}
			} else {
				// Default to empty string if array is empty
				this.formData[fieldKey].push('');
			}
		},

		removeArrayItem(fieldKey, index) {
			this.formData[fieldKey].splice(index, 1);
		},

		moveArrayItem(fieldKey, index, direction) {
			const items = this.formData[fieldKey];
			const newIndex = index + direction;

			if (newIndex >= 0 && newIndex < items.length) {
				const item = items.splice(index, 1)[0];
				items.splice(newIndex, 0, item);
			}
		},

		deleteCategoryItem(fieldKey, index) {
			const categoryName = this.formData[fieldKey][index];
			const confirmMessage = `Delete "${categoryName}"? Make sure to update any posts using this category.`;

			if (confirm(confirmMessage)) {
				this.formData[fieldKey].splice(index, 1);
			}
		},

		async saveItem() {
			if (this.isSaving) return; // Prevent double-clicking

			this.isSaving = true;

			try {
				// Update local data first
				if (this.editType === 'collection') {
					// Special handling for categories
					if (this.collectionName === 'categories') {
						// Update categories array from collection items
						this.data.categories = this.collectionItems.map((item) => item.name || item.title);
						console.log('Categories updated:', this.data.categories);
					} else {
						// Update item in collection array
						const collection = this.getCollectionByPath(this.collectionName);
						const index = collection.findIndex((item) => item.id === this.currentItem.id);

						if (index !== -1) {
							collection[index] = { ...this.formData };
							this.collectionItems = [...collection];
							console.log('Item updated in collection:', this.collectionName);
						} else {
							console.error('Item not found for update');
							return;
						}
					}
				} else {
					// Update object directly, or unwrap array if it was wrapped
					if (
						this.formData[this.collectionName] &&
						Array.isArray(this.formData[this.collectionName])
					) {
						// This was a wrapped array, so unwrap it
						this.data[this.collectionName] = [...this.formData[this.collectionName]];
						console.log('Array updated:', this.collectionName);
					} else {
						// Regular object update
						this.data[this.collectionName] = { ...this.formData };
						console.log('Object updated:', this.collectionName);
					}
				}

				this.currentItem = { ...this.formData };

				// Save to server
				console.log('Saving data to server...');
				const saveResponse = await fetch('/api/save', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(this.data)
				});

				if (!saveResponse.ok) {
					throw new Error(`Save failed: ${saveResponse.status} - ${saveResponse.statusText}`);
				}

				console.log('Data saved successfully to server');

				// Fetch updated HTML from current page
				console.log('Fetching updated page content...');
				const pageResponse = await fetch(window.location.href);

				if (!pageResponse.ok) {
					throw new Error(`Page fetch failed: ${pageResponse.status} - ${pageResponse.statusText}`);
				}

				const updatedHTML = await pageResponse.text();

				// Parse the response HTML
				const parser = new DOMParser();
				const updatedDoc = parser.parseFromString(updatedHTML, 'text/html');

				// Determine the data-edit path we're currently editing
				let editPath;
				if (this.editType === 'collection') {
					editPath = `${this.collectionName}.${this.currentItem.id}`;
				} else {
					editPath = this.collectionName;
				}

				console.log('Looking for updated content with data-edit:', editPath);

				// Find the corresponding element in the updated HTML
				const updatedElement = updatedDoc.querySelector(`[data-edit="${editPath}"]`);
				const currentElement = document.querySelector(`[data-edit="${editPath}"]`);

				if (updatedElement && currentElement) {
					// Replace the content of the current element with the updated content
					currentElement.innerHTML = updatedElement.innerHTML;
					console.log('Page content updated successfully');
				} else {
					console.warn('Could not find matching elements for content update');
					if (!updatedElement) console.warn('Updated element not found in server response');
					if (!currentElement) console.warn('Current element not found on page');
				}

				console.log('Save and update completed successfully');

				// Handle post-save actions based on current tab
				if (this.currentTab === 'all') {
					// For "All Items" view, refresh the entire page since multiple elements may have changed
					console.log('Refreshing page after saving from All Items view');
					window.location.reload();
				} else {
					// For "Edit Item" view, update specific element and close modal
					this.closeModal();
				}
			} catch (error) {
				console.error('Error during save:', error);
				alert(`Save failed: ${error.message}\n\nCheck the console for more details.`);
			} finally {
				this.isSaving = false;
			}
		},

		addNewItem() {
			if (this.editType === 'collection') {
				// Special handling for categories
				if (this.collectionName === 'categories') {
					const newCategoryName = prompt('Enter new category name:');
					if (newCategoryName && newCategoryName.trim()) {
						const nextId = this.collectionItems.length;
						const newCategory = {
							id: nextId,
							_idx: nextId,
							name: newCategoryName.trim(),
							title: newCategoryName.trim()
						};

						this.collectionItems.push(newCategory);
						console.log('New category added:', newCategoryName);
					}
				} else {
					let collection = this.getCollectionByPath(this.collectionName);

					// Calculate next ID
					let nextId = 1;
					if (collection && collection.length > 0) {
						const existingIds = collection
							.map((item) => item.id)
							.filter((id) => typeof id === 'number')
							.sort((a, b) => b - a); // Sort descending

						if (existingIds.length > 0) {
							nextId = existingIds[0] + 1;
						}
					}

					// Create template based on existing item structure
					let template = {};
					if (collection && collection.length > 0) {
						const firstItem = collection[0];
						for (const [key, value] of Object.entries(firstItem)) {
							if (key === 'id') {
								template[key] = nextId;
							} else if (Array.isArray(value)) {
								template[key] = [];
							} else if (typeof value === 'boolean') {
								template[key] = false;
							} else if (typeof value === 'number') {
								template[key] = 0;
							} else {
								template[key] = '';
							}
						}
					} else {
						// Default template if no items exist
						template = {
							id: nextId,
							title: '',
							content: ''
						};
					}

					// Add to collection (ensure collection exists)
					if (!collection) {
						collection = [];
						this.setCollectionByPath(this.collectionName, collection);
					}
					collection.push(template);

					// Update reactive data
					this.collectionItems = [...collection];

					// Edit the new item
					this.editItem(template);

					console.log('New item added with ID:', nextId);
				}
			}
		},

		editItem(item) {
			this.currentItem = item;
			this.generateFormFields(item);
			this.formData = { ...item };
			this.preserveDataTypes();
			this.switchTab('edit');
		},

		deleteItem(item) {
			// Special handling for categories
			if (this.collectionName === 'categories') {
				const categoryName = item.name || item.title;
				const confirmMessage = `Delete "${categoryName}"? Make sure to update any posts using this category.`;

				if (confirm(confirmMessage)) {
					const index = this.collectionItems.findIndex((i) => i.id === item.id);
					if (index !== -1) {
						this.collectionItems.splice(index, 1);
						console.log('Category deleted:', categoryName);

						// Close modal if we're editing the deleted item
						if (this.currentItem && this.currentItem.id === item.id) {
							this.closeModal();
						}
					}
				}
			} else {
				const collection = this.getCollectionByPath(this.collectionName);

				// Prevent deletion of the last item in a collection
				if (collection.length <= 1) {
					alert(
						'Cannot delete the last item in this collection. At least one item must remain to keep the editor accessible.'
					);
					return;
				}

				if (confirm('Are you sure you want to delete this item?')) {
					const index = collection.findIndex((i) => i.id === item.id);

					if (index !== -1) {
						collection.splice(index, 1);
						this.collectionItems = [...collection];
						console.log('Item deleted');

						// Close modal if we're editing the deleted item
						if (this.currentItem && this.currentItem.id === item.id) {
							this.closeModal();
						}
					}
				}
			}
		},

		isCurrentItem(item) {
			return (
				this.currentItem &&
				((item.id && item.id === this.currentItem.id) ||
					(item._idx && item._idx === this.currentItem._idx))
			);
		},

		getItemTitle(item) {
			return item.title || item.name || `Item ${item.id || item._idx || ''}`;
		},

		closeModal() {
			this.isOpen = false;
			this.currentTab = 'edit';

			// Clean up sortable instance
			if (this.sortableInstance) {
				this.sortableInstance.destroy();
				this.sortableInstance = null;
			}
		},

		async handleImageUpload(event, fieldKey) {
			const file = event.target.files[0];
			if (!file) return;

			try {
				const resizedImage = await this.resizeImage(file, 750);
				this.formData[fieldKey] = resizedImage;
			} catch (error) {
				console.error('Error processing image:', error);
				alert('Error processing image. Please try again.');
			}
		},

		async handleGalleryUpload(event, fieldKey) {
			const files = Array.from(event.target.files);
			if (!files.length) return;

			try {
				for (const file of files) {
					const resizedImage = await this.resizeImage(file, 750);
					const galleryItem = {
						id: Date.now() + Math.random(),
						title: '',
						image: resizedImage,
						src: resizedImage // Support both 'image' and 'src' properties
					};

					if (!this.formData[fieldKey]) {
						this.formData[fieldKey] = [];
					}
					this.formData[fieldKey].push(galleryItem);
				}
			} catch (error) {
				console.error('Error processing gallery images:', error);
				alert('Error processing images. Please try again.');
			}

			// Clear the input
			event.target.value = '';
		},

		resizeImage(file, maxWidth) {
			return new Promise((resolve, reject) => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				const img = new Image();

				img.onload = () => {
					const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
					canvas.width = img.width * ratio;
					canvas.height = img.height * ratio;

					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

					canvas.toBlob(
						(blob) => {
							const reader = new FileReader();
							reader.onload = () => resolve(reader.result);
							reader.onerror = reject;
							reader.readAsDataURL(blob);
						},
						'image/jpeg',
						0.9
					);
				};

				img.onerror = reject;
				img.src = URL.createObjectURL(file);
			});
		},

		moveGalleryItem(fieldKey, index, direction) {
			const items = this.formData[fieldKey];
			const newIndex = index + direction;

			if (newIndex >= 0 && newIndex < items.length) {
				const item = items.splice(index, 1)[0];
				items.splice(newIndex, 0, item);
			}
		},

		removeGalleryItem(fieldKey, index) {
			this.formData[fieldKey].splice(index, 1);
		},

		moveItem(index, direction) {
			const newIndex = index + direction;

			if (newIndex >= 0 && newIndex < this.collectionItems.length) {
				// Special handling for categories
				if (this.collectionName === 'categories') {
					// Move item in collection items array
					const item = this.collectionItems.splice(index, 1)[0];
					this.collectionItems.splice(newIndex, 0, item);

					// Update IDs to match new positions
					this.collectionItems.forEach((cat, idx) => {
						cat.id = idx;
						cat._idx = idx;
					});

					console.log('Category moved:', {
						from: index,
						to: newIndex,
						item: item.name || item.title
					});
				} else {
					// Update both the main data and reactive data
					const items = this.getCollectionByPath(this.collectionName);
					const item = items.splice(index, 1)[0];
					items.splice(newIndex, 0, item);

					// Update reactive array
					this.collectionItems = [...items];

					console.log('Item moved:', {
						from: index,
						to: newIndex,
						item: item.title || item.id
					});
				}
			}
		},

		triggerImageUpload(fieldKey) {
			const input = document.getElementById('imageInput_' + fieldKey);
			if (input) {
				input.click();
			}
		},

		triggerGalleryUpload(fieldKey) {
			const input = document.getElementById('galleryInput_' + fieldKey);
			if (input) {
				input.click();
			}
		},

		formatText(command) {
			document.execCommand(command, false, null);
		},

		insertLink() {
			const url = prompt('Enter the URL:');
			if (url) {
				document.execCommand('createLink', false, url);
			}
		},

		updateRichTextContent(event, fieldKey) {
			this.formData[fieldKey] = event.target.innerHTML;
		},

		handlePaste(event) {
			// Prevent pasting of rich formatting, keep only text
			event.preventDefault();
			const text = (event.clipboardData || window.clipboardData).getData('text/plain');
			document.execCommand('insertText', false, text);
		},

		initRichTextContent(element, fieldKey) {
			// Set initial content only once when the element is created
			if (this.formData[fieldKey]) {
				element.innerHTML = this.formData[fieldKey];
			}
		},

		handleYouTubeInput(event, fieldKey) {
			const input = event.target.value.trim();
			if (input) {
				const videoId = this.extractYouTubeId(input);
				if (videoId && videoId !== input) {
					// Update the form data with just the ID
					this.formData[fieldKey] = videoId;
				}
			}
		},

		extractYouTubeId(url) {
			// Return as-is if it's already a video ID (11 characters, alphanumeric + _ -)
			if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
				return url;
			}

			// Extract from various YouTube URL formats
			const patterns = [
				/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
				/youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
			];

			for (const pattern of patterns) {
				const match = url.match(pattern);
				if (match && match[1]) {
					return match[1];
				}
			}

			// If no pattern matches, return the original input
			return url;
		},

		isValidYouTubeId(id) {
			// Check if it's a valid YouTube video ID format
			return id && /^[a-zA-Z0-9_-]{11}$/.test(id);
		}
	};
}

// Initialize the editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	// Insert the editor template
	const editorContainer = document.getElementById('editor-container');
	if (editorContainer) {
		editorContainer.innerHTML = editorTemplate;

		// Initialize Alpine.js component
		editorContainer.setAttribute('x-data', 'createDynamicEditor()');
		editorContainer.setAttribute('x-init', 'init()');
	}
});
