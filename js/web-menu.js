class WebMenu {
	constructor() {
		this._localStorage = window.localStorage;
		this._webSites = config.getWebSites();
		this._webMenuScreen = document.querySelector('#web-menu');
		this._webMenuList = document.querySelector('#web-menu-list');
		this._webMenuListContainer = document.querySelector('#web-menu-list-container');
		this._webMenuCategorized = document.querySelector('#web-menu-categorized');
		this._webMenuSearchBox = document.querySelector('#web-menu-searchbox');
		this._webMenuModeSwitcher = document.querySelector('#web-menu-mode-switcher');
		this._webMenuModeSwitcherImage = document.querySelector('#web-menu-mode-switcher-img');
		this._webMenuButton = document.querySelector('#button-web-menu');

		this._webMenuVisibility = false;
		this._webItemFocus;
		this._webMenuItemIndex = 0;
		this._webMenuCategoryLIsArr = [];
		this._webMenuCategoryMode = false;
		this._webMenuItemPopulated = false;

		this._init();
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

	_whiteSpaceToDash(str) {
		return str.replace(/\s+/g, '-').toLowerCase();
	}

	_capitalizeString(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	// Update <li> array while in category mode
	_getCategoryLIs() {
		this._webMenuCategoryLIsArr = [];
		const uls = document.querySelectorAll('.category-list');
		for (let z = 0; z < uls.length; z++) {
			let ulCategoryItems = uls[z].getElementsByTagName('li');
			for (let y = 0; y < ulCategoryItems.length; y++) {
				this._webMenuCategoryLIsArr.push(ulCategoryItems[y]);
			}
		}
	}

	// Update <li> array while in alphabetical list mode
	_getListLIs() {
		this._webMenuCategoryLIsArr = [];
		const ul = this._webMenuList;
		const lis = ul.getElementsByTagName('li');
		for (let z = 0; z < lis.length; z++) {
			this._webMenuCategoryLIsArr.push(lis[z]);
		}
	}

	// Sort category's items
	_sortCategoryItems() {
		const categoryList = document.querySelectorAll('.category-list');
		for (let category of categoryList) {
			Array.from(category.getElementsByTagName('li'))
			.sort((a, b) => a.textContent.localeCompare(b.textContent))
			.forEach(li => category.appendChild(li));
		}
		this._getCategoryLIs();
	}

	// Sort categories alphabetically
	_sortCategories() {
		Array.from(this._webMenuCategorized.querySelectorAll('.category-body'))
			.sort((a, b) => a.id.localeCompare(b.id))
			.forEach(li => this._webMenuCategorized.appendChild(li));
		this._sortCategoryItems();
	}

	// Create callback property, to be used when enter was pressed while item is focused	
	_createWebItemCallback(li, url) {
		li.url = url;
		li.openURL = function() {
			window.location.href = encodeURI(this.url);
		};
	}

	// Create LI
	_createItemCategoryLI(url, siteID, icon, site, categoryID, categoryUL) {
		const li = document.createElement('li');
		li.className = `web-menu-list-item web-menu-categorized`;
		li.id = `web-menu-category-${categoryID}`;

		// Generate web item/li child
		li.insertAdjacentHTML(
			'afterbegin',
			`
			<a class='web-menu-link' href='${url}' tabindex='-1'>
				<div class='web-item' id='${'id-' + siteID}'>
					<div class='web-item-container'>
						<div class='web-item-body'>
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
		categoryUL.appendChild(li);
	}

	_createCatregories(category, categoryID) {
		const categoryBodyDivID = document.createElement('li');
		categoryBodyDivID.className = `category-body`;
		categoryBodyDivID.id = `category-body-${categoryID}`;

		const categoryNameH3ID = document.createElement('h3');
		categoryNameH3ID.className = `category-name`;
		categoryNameH3ID.id = `category-name-${categoryID}`;
		categoryNameH3ID.innerText = `${this._capitalizeString(category)}`;

		const categoryUL = document.createElement('ul');
		categoryUL.className = `category-list`;
		categoryUL.id = `category-list-${categoryID}`;

		categoryBodyDivID.appendChild(categoryNameH3ID);
		categoryBodyDivID.appendChild(categoryUL);
		this._webMenuCategorized.appendChild(categoryBodyDivID);
	}

	_populateCategories() {
		for (let webData of this._webSites) {
			const site = webData.site;
			const category = webData.category || 'others';
			const icon = webData.icon;
			const url = webData.url;

			const siteID = this._whiteSpaceToDash(site);
			const categoryID = this._whiteSpaceToDash(category);

			if (!document.querySelector(`#category-body-${categoryID}`)) {
				this._createCatregories(category, categoryID);
				let categoryUL = document.querySelector(`#category-list-${categoryID}`);
				this._createItemCategoryLI(url, siteID, icon, site, categoryID, categoryUL);
			} else {
				let categoryUL = document.querySelector(`#category-list-${categoryID}`);
				this._createItemCategoryLI(url, siteID, icon, site, categoryID, categoryUL);
			}
		}

		this._sortCategories();
	}

	// Populate list item for list mode
	_populateList() {
		for (let webData of this._webSites) {
			const site = webData.site;
			const icon = webData.icon;
			const url = webData.url;
			const category = webData.category || 'others';

			const siteID = this._whiteSpaceToDash(site);
			const categoryID = this._whiteSpaceToDash(category);

			const li = document.createElement('li');
			li.className = `web-menu-list-item web-menu-categorized`;
			li.id = `web-menu-category-${categoryID}`;

			// Generate web item/li child
			li.insertAdjacentHTML(
				'afterbegin',
				`
				<a class='web-menu-link' href='${url}' tabindex='-1'>
					<div class='web-item' id='id-${siteID}'>
						<div class='web-item-container'>
							<div class='web-item-body'>
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

			// Create 'Enter' key callback to open its url
			this._createWebItemCallback(li, url);
			this._webMenuList.appendChild(li);
		}

		this._sortList();
	}

	_getFirstCategoryItem() {
		this._webItemFocus = this._webMenuCategoryLIsArr[0];
		const webItemFocusChildren = this._webItemFocus.querySelector('.web-item');
		webItemFocusChildren.classList.add('web-item-focus');
	}

	_getFirstListItem() {
		const ul = this._webMenuList;
		const li = ul.getElementsByTagName('li');

		this._webItemFocus = li[0];
		const webItemFocusChildren = this._webItemFocus.querySelector('.web-item');
		webItemFocusChildren.classList.add('web-item-focus');
	}

	// Filter search
	_filterWebList() {
		let input, filter, uls, li, a, i, txtValue;
		input = this._webMenuSearchBox;
		filter = input.value.toUpperCase();
		li = this._webMenuCategoryLIsArr;
		
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
				this._webMenuItemIndex = i;
				const webItemFocusChild = this._webItemFocus.querySelector('.web-item');
				webItemFocusChild.classList.add('web-item-focus');
				this._webItemFocus.scrollIntoView();
			}
		}
	}

	// Remove focus class
	_removeFocus(el, className) {
		const oldWebItemFocus = el.querySelector('.web-item');
		oldWebItemFocus.classList.remove(className);
	}

	// Add focus class
	_addFocus(el, className) {
		const webItemFocusChild = el.querySelector('.web-item');
		webItemFocusChild.classList.add(className);
		webItemFocusChild.scrollIntoView();
	}

	// Reset focus
	_resetFocus() {
		this._removeFocus(this._webItemFocus, 'web-item-focus');
		this._webMenuItemIndex = 0;
		if (this._webMenuCategoryMode) {
			this._getFirstCategoryItem();
		} else {
			this._getFirstListItem();
		}
		// Scroll to top
		this._webMenuListContainer.scrollTo(0, 0);
	}

	// Keboard navigation
	_keyNavigation(key) {
		const itemLength = this._webMenuCategoryLIsArr.length - 1;
		const [up, down, left, right] =
			['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

		// Up/Down navigation - a bit clunky on category mode
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

		const updateItemFocus = (condition, overFlowIndex) => {
			const nextItem = this._webMenuCategoryLIsArr[parseInt(this._webMenuItemIndex, 0)];
			if(typeof nextItem !== 'undefined' && condition) {			
				this._webItemFocus = nextItem;
			} else {
				this._webMenuItemIndex = overFlowIndex;
				this._webItemFocus = this._webMenuCategoryLIsArr[parseInt(overFlowIndex, 10)];
			}
		};

		const updateItemFocusByKey = () => {
			if (key === right) {
				updateItemFocus((this._webMenuItemIndex <= itemLength), 0);
			} else if (key === left) {
				updateItemFocus((this._webMenuItemIndex >= 0), itemLength);
			} else if (key === up) {
				return updateItemFocus((this._webMenuItemIndex >= 0), itemLength);
			} else if (key === down) {
				return updateItemFocus((this._webMenuItemIndex <= itemLength), 0);
			}
		};

		const updateWebMenuItemIndex = () => {
			if (key === right) {
				this._webMenuItemIndex++;
			} else if (key === left) {
				this._webMenuItemIndex--;
			} else if (key === up) {
				this._webMenuItemIndex = this._webMenuItemIndex - getIndexByWindowWidth();
			} else if (key === down) {
				this._webMenuItemIndex = this._webMenuItemIndex + getIndexByWindowWidth();
			} else {
				return;
			}
			this._webMenuSearchBox.value = '';
		}

		const startNavigation = () => {
			updateWebMenuItemIndex();
			if (this._webItemFocus) {
				this._removeFocus(this._webItemFocus, 'web-item-focus');
				updateItemFocusByKey();
				this._addFocus(this._webItemFocus, 'web-item-focus');
			} else {
				this._webMenuItemIndex = 0;
				this._webItemFocus = this._webMenuCategoryLIsArr[parseInt(this._webMenuItemIndex, 0)];
				this._addFocus(this._webItemFocus, 'web-item-focus');
			}
		}

		startNavigation();
	}

	// Sort list alphabetically (Note that this is not the category mode)
	_sortList() {
		Array.from(this._webMenuList.getElementsByTagName('li'))
			.sort((a, b) => a.textContent.localeCompare(b.textContent))
			.forEach(li => this._webMenuList.appendChild(li));
		this._getListLIs();
	}

	// Switch to list mode
	_switchToListMode() {
		for (let i = 0; i < this._webMenuCategoryLIsArr.length; i++) {
			this._webMenuList.appendChild(this._webMenuCategoryLIsArr[i]);
		}
		
		this._sortList();
		this._webMenuList.classList.remove('web-menu-list-hide');
		this._webMenuCategorized.classList.add('web-menu-categorized-hide');
		this._webMenuModeSwitcherImage.classList.remove('category-mode');
	}

	// Switch to category mode
	_switchToCategoryMode() {

		// Transfer all web items(LIs) to category mode
		for (let i = 0; i < this._webMenuCategoryLIsArr.length; i++) {
			const itemID = this._webMenuCategoryLIsArr[i].id;
			const category = itemID.replace('web-menu-category-', '');
			const categoryID = this._whiteSpaceToDash(category);
			
			// Check if the LI's parent, the category-body-{category-name}, exists
			if (document.querySelector(`#category-body-${categoryID}`)) {
				const categoryUL = document.querySelector(`#category-list-${categoryID}`);
				categoryUL.appendChild(this._webMenuCategoryLIsArr[i]);
			} else {
				// Create categories
				this._createCatregories(category, categoryID);
				const categoryUL = document.querySelector(`#category-list-${categoryID}`);
				categoryUL.appendChild(this._webMenuCategoryLIsArr[i]);
			}
		}

		this._sortCategories();
		this._webMenuList.classList.add('web-menu-list-hide');
		this._webMenuCategorized.classList.remove('web-menu-categorized-hide');
		this._webMenuModeSwitcherImage.classList.add('category-mode');
	}

	_webMenuModeSwitcherClickEvent() {
		this._webMenuModeSwitcher.addEventListener(
			'click',
			e => {
				if (this._webMenuCategoryMode) {
					this._switchToListMode();
					this._webMenuSearchBox.value = '';
					this._webItemFocus.scrollIntoView();
				} else {
					this._switchToCategoryMode();
					this._webMenuSearchBox.value = '';
					this._webItemFocus.scrollIntoView();
				}
				this._webMenuCategoryMode = !this._webMenuCategoryMode;
				this._localStorage.setItem('categoryMode', JSON.stringify(this._webMenuCategoryMode));
				this._resetFocus();
				this._webMenuSearchBox.focus();
			}
		);	
	}

	_webMenuKeyDownEvent() {
		this._webMenuScreen.addEventListener(
			'keydown',
			e => {
				this._keyNavigation(e.key);
			}
		);
	}

	_webMenuSearchBoxKeyDownEvent() {
		this._webMenuSearchBox.addEventListener(
			'keydown',
			e => {
				const ignoreKeys = [
					'ArrowRight',
					'ArrowDown',
					'ArrowLeft',
					'ArrowUp',
					'Tab',
					'Escape'
				];

				this._webMenuScreen.addEventListener(
					'keydown',
					e => {
						// Ignore these keys
						if (ignoreKeys[String(e.key)]) return;
						if (e.key === 'Enter' && this._webItemFocus) {

							// Run the focused li's openURL() function
							this._webItemFocus.openURL();
						} else if (e.key === 'Backspace' && this._webMenuSearchBox.value.length  < 1) {

							// Hide web menu if backspace is pressed and searchbox value is 0
							this.toggleWebMenu();
							return;
						}
					}
				);
			}
		);
	}

	_webMenuSearchBoxKeyUpEvent() {
		this._webMenuSearchBox.addEventListener(
			'keyup',
			e => {
				if (e.key.length > 1) return;
				this._filterWebList();
			}
		);
	}

	_startPopulating() {
		if (this._webMenuCategoryMode) {
			this._populateCategories();
			this._getFirstCategoryItem();
			this._webMenuList.classList.add('web-menu-list-hide');
			this._webMenuCategorized.classList.remove('web-menu-categorized-hide');
			this._webMenuModeSwitcherImage.classList.add('category-mode');
		} else {
			this._populateList();
			this._getFirstListItem();
			this._webMenuList.classList.remove('web-menu-list-hide');
			this._webMenuCategorized.classList.add('web-menu-categorized-hide');
			this._webMenuModeSwitcherImage.classList.remove('category-mode');
		}
	}
	
	_disableWebMenuInputs(status) {
		const elems = this._webMenuScreen.getElementsByTagName('input');
		const len = elems.length;

		for (let i = 0; i < len; i++) {
			elems[parseInt(i, 10)].disabled = status;
		}
	}

	_showWebMenu() {
		if (!this._webMenuItemPopulated) {
			// Populate web menu
			this._startPopulating();
			this._webMenuItemPopulated = true;
		}
		this._disableWebMenuInputs(false);
		this._webMenuButton.classList.add('active-content');
		this._webMenuScreen.classList.add('web-menu-show');
		this._webMenuVisibility = !this._webMenuVisibility;
		this._webMenuSearchBox.focus();
		centralBody.hideCentralBody();
	}

	_hideWebMenu() {
		this._webMenuSearchBox.value = '';
		this._webMenuSearchBox.blur();
		this._filterWebList();
		this._webMenuListContainer.scrollTop = 0;
		this._resetFocus();
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

	_webMenuButtonClickEvent() {
		this._webMenuButton.addEventListener(
			'click',
			() => {
				this.toggleWebMenu();
			}
		);
	}

	_init() {
		this._webMenuCategoryMode = JSON.parse(this._localStorage.getItem('categoryMode')) || false;
		this._fuzzySearch();
		this._disableWebMenuInputs(true);
		this._webMenuSearchBoxKeyUpEvent();
		this._webMenuSearchBoxKeyDownEvent();
		this._webMenuKeyDownEvent();
		this._webMenuModeSwitcherClickEvent();
		this._webMenuButtonClickEvent();
	}
}