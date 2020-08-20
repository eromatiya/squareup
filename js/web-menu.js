class WebMenu {
	constructor() {
		this._webSites = config.getWebSites();
		this._webMenuScreen = document.querySelector('#web-menu');
		this._webMenuList = document.querySelector('#web-menu-list');
		this._webMenuListContainer = document.querySelector('#web-menu-list-container');
		this._webMenuSearchBox = document.querySelector('#web-menu-searchbox');
		this._webMenuButton = document.querySelector('#button-web-menu');

		this._webMenuGenerated = false;
		this._webMenuVisibility = false;
		this._webItemFocus;
		this._webListIndex = 0;
		this._init();
	}

	// Return web menu status
	getwebMenuVisibility() {
		return this._webMenuVisibility;
	}

	// Show web menu screen
	_showWebMenu() {

		// Populate only on web menu's first open
		if (!this._webMenuGenerated) {
			console.log('Populating web menu...');
			this._populateWebMenu();
		}

		this._disableWebMenuInputs(false);
		this._webMenuButton.classList.add('active-content');
		this._webMenuScreen.classList.add('web-menu-show');
		this._webMenuVisibility = !this._webMenuVisibility;
		this._webMenuSearchBox.focus();
		centralBody.hideCentralBody();
	}

	// Hide web menu screen
	_hideWebMenu() {
		this._webMenuSearchBox.value = '';
		this._webMenuSearchBox.blur();
		this._filterWebList();
		this._webMenuListContainer.scrollTop = 0;
		this._focusReset();
		this._getFirstItem();
		this._webMenuScreen.classList.remove('web-menu-show');
		this._webMenuButton.classList.remove('active-content');
		this._disableWebMenuInputs(true);
		centralBody.showCentralBody();
		this._webMenuVisibility = !this._webMenuVisibility;
	}

	toggleWebMenu() {
		if (this._webMenuVisibility) {
			this._hideWebMenu();

		} else {
			this._showWebMenu();
		}
	}

	// Disable textboxes	
	_disableWebMenuInputs(status) {
		const elems = this._webMenuScreen.getElementsByTagName('input');
		const len = elems.length;

		for (let i = 0; i < len; i++) {
			elems[parseInt(i, 10)].disabled = status;
		}
	}

	// Create callback property, to be used when enter was pressed while item is focused	
	_createWebItemCallback(li, url) {
		li.callback = () => {
			window.location.href = encodeURI(url);
		};
	}
	
	// Sort list alphabetically
	_sortList() {
		Array.from(this._webMenuList.getElementsByTagName('li'))
			.sort((a, b) => a.textContent.localeCompare(b.textContent))
			.forEach(li => this._webMenuList.appendChild(li));
	}

	// Create/generate web items
	_populateWebMenu() {

		// Generate a list
		for (let webData of this._webSites) {
			const site = webData.site;
			const icon = webData.icon;
			const url = webData.url;
			const li = document.createElement('li');

			// Generate web item/li child
			li.insertAdjacentHTML(
				'afterbegin',
				`
				<a class='web-menu-link' href='${url}' tabindex='-1'>
					<div class='web-item' id='${'id' + site}'>
						<div class='web-item-container'>
							<div class='webItemBody'>
								<div class='web-item-icon-container'>
									<div class='web-item-icon' style='background-image: url("assets/webcons/${icon}.svg");'></div>
								</div>
								<div class='web-item-name'>${site}</div>
							</div>
						</div>
					</div>
				</a>
				`
			);

			this._createWebItemCallback(li, url);
			this._webMenuList.appendChild(li);
		}

		this._sortList();
		this._getFirstItem();
		this._webMenuGenerated = true;
	}

	// Allow fuzzy searching in web menu
	_fuzzySearch() {
		String.prototype.fuzzy = function(term, ratio) {
			const string = this.toLowerCase();
			const compare = term.toLowerCase();
			let matches = 0;
			
			// Coverts basic partial matches
			if (string.indexOf(compare) > -1) return true; 
			
			for (let i = 0; i < compare.length; i++) {
				const ind = string.indexOf(compare[parseInt(i, 10)]);
				if (ind > -1) {
					matches += 1;
				} else {
					matches -=1;
				}
			}
			return ((matches / this.length) >= ratio || term === '');
		};
	}

	// Focus on searched item
	_filterWebList() {

		let input, filter, ul, li, a, i, txtValue;
		
		input = this._webMenuSearchBox;
		filter = input.value.toUpperCase();
		ul = this._webMenuList;
		li = ul.getElementsByTagName('li');
		
		// Loop through all list items, and focus if matches the search query
		for (let i = 0; i < li.length; i++) {

			a = li[parseInt(i, 10)].getElementsByClassName('web-item-name')[0];
			txtValue = a.textContent || a.innerText;

			// if (txtValue.toUpperCase().indexOf(filter) !== -1) {
			if (txtValue.toUpperCase().fuzzy(filter, 1) === true) {
				const oldWebItemFocus = this._webItemFocus;
				const oldWebItemFocusChild = oldWebItemFocus.querySelector('.web-item');
				oldWebItemFocusChild.classList.remove('web-item-focus');
				this._webItemFocus = li[parseInt(i, 10)];
				this._webListIndex = i;
				const webItemFocusChild = this._webItemFocus.querySelector('.web-item');
				webItemFocusChild.classList.add('web-item-focus');
				this._webItemFocus.scrollIntoView();
			}
		}
	}

	// Reset focus/go back to item #1
	_focusReset() {
		const oldWebItemFocus = this._webItemFocus;
		const oldWebItemFocusChild = oldWebItemFocus.querySelector('.web-item');
		
		oldWebItemFocusChild.classList.remove('web-item-focus');
		this._webListIndex = 0;
	}

	// Get item #1
	_getFirstItem() {
		const ul = this._webMenuList;
		const li = ul.getElementsByTagName('li');

		this._webItemFocus = li[0];
		const webItemFocusChildren = this._webItemFocus.querySelector('.web-item');
		webItemFocusChildren.classList.add('web-item-focus');
	}

	// Remove focus class
	_removeFocus(el, className) {
		const oldWebItemFocus = el.querySelector('.web-item');
		oldWebItemFocus.classList.remove('web-item-focus');
	}

	// Add focus class
	_addFocus(el, className) {
		const webItemFocusChild = el.querySelector('.web-item');
		webItemFocusChild.classList.add('web-item-focus');
		webItemFocusChild.scrollIntoView();
	}

	// Arrow key navigation
	_navigateWithArrows(key, len) {

		// Assign constant variables to key codes
		const [right, left, down, up] = [39, 37, 40, 38];

		// Calculate screen width - Allows up/down navigation
		const getIndexByWindowWidth = () => {
			if (window.innerWidth <= 580) { return 1; }

			// Width of elements (<li> and scrollbar) in pixels
			const menuItemWidth = 138;
			const scrollBarWidth = 10;

			// Get viewport width
			const vw = unit => window.innerWidth * (unit / 100);
			
			// Gets the number of columns by dividing the 
			// screen width minus the padding, scroll width and 
			// average of menu item width by the menu item width
			const containerWindow = ((window.innerWidth - (menuItemWidth / 2) -
				scrollBarWidth - vw(24)) / menuItemWidth);
			return Math.round(containerWindow);
		};

		// Update focused item element
		const changeItemFocus = (condition, overFlowIndex) => {
			const next = this._webMenuList.getElementsByTagName('li')[this._webListIndex];
			if(typeof next !== 'undefined' && condition) {			
				this._webItemFocus = next;
			} else {
				this._webListIndex = overFlowIndex;
				this._webItemFocus = this._webMenuList.getElementsByTagName('li')[parseInt(overFlowIndex, 10)];
			}
		};

		const updateItemFocusByKey = () => {
			if (key === right) {
				return changeItemFocus((this._webListIndex <= len), 0);
			} else if (key === left) {
				return changeItemFocus((this._webListIndex >= 0), len);
			} else if (key === up) {
				return changeItemFocus((this._webListIndex >= 0), len);
			} else if (key === down) {
				return changeItemFocus((this._webListIndex <= len), 0);
			}
		};

		// Determine the index position by key
		const updateWebListIndex = () => {
			if (key === right) {
				this._webListIndex++;
			} else if (key === left) {
				this._webListIndex--;
			} else if (key === up) {
				this._webListIndex = this._webListIndex - getIndexByWindowWidth();
			} else if (key === down) {
				this._webListIndex = this._webListIndex + getIndexByWindowWidth();
			} else {
				return;
			}
			this._webMenuSearchBox.value = '';
		};

		// Set focused element
		updateWebListIndex();
		if (this._webItemFocus) {
			this._removeFocus(this._webItemFocus, 'web-item-focus');
			updateItemFocusByKey();
			this._addFocus(this._webItemFocus, 'web-item-focus');
		} else {
			this._webListIndex = 0;
			this._webItemFocus = this._webMenuList.getElementsByTagName('li')[0];
			this._addFocus(this._webItemFocus, 'web-item-focus');
		}
	}

	_webMenuKeyDownEvent() {
		this._webMenuScreen.addEventListener(
			'keydown',
			e => {
				const len = this._webMenuList.getElementsByTagName('li').length - 1;
				this._navigateWithArrows(e.which, len);
			},
			false
		);
	}

	_webMenuSearchBoxKeyDownEvent() {
		this._webMenuSearchBox.addEventListener(
			'keydown',
			e => {
				// Don't hijack keyboard navigation buttons (up, down, left, right)
				if ((e.key === 'ArrowRight') || (e.key === 'ArrowDown') || 
					(e.key === 'ArrowLeft') || (e.key === 'ArrowUp')) return;

				if (e.key === 'Tab') return;

				if (e.key === 'Enter' && this._webItemFocus) {

					// Run the focused li's callback
					this._webItemFocus.callback();
					this.toggleWebMenu();

				} else if (e.key === 'Backspace' && this._webMenuSearchBox.value.length  < 1) {

					// Hide web menu if backspace is pressed and searchbox value is 0
					this.toggleWebMenu();
					return;

				} else if ((e.key === 'Escape') || (e.key === 'Alt')) {
					return;
				}

				// Filter
				this._filterWebList();
			}
		);
	}

	_webMenuButtonClickEvent() {
		this._webMenuButton.addEventListener(
			'click',
			() => {
				this.toggleWebMenu();
			}
		);
	}

	_init() {
		this._fuzzySearch();
		this._disableWebMenuInputs(true);
		this._webMenuSearchBoxKeyDownEvent();
		this._webMenuKeyDownEvent();
		this._webMenuButtonClickEvent();
	}
}
