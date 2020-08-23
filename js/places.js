class Places {
	constructor() {
		this._webSites = config.getWebSites();
		this._webMenuScreen = document.querySelector('#web-menu');
		this._webMenuList = document.querySelector('#web-menu-list');
		this._webMenuCategorized = document.querySelector('#web-menu-categorized');
		this._webMenuSearchBox = document.querySelector('#web-menu-searchbox');
		this._webMenuModeSwitcher = document.querySelector('#web-menu-mode-switcher');
		this._webMenuModeSwitcherImage = document.querySelector('#web-menu-mode-switcher-img');

		this._webItemFocus;
		this._webListIndex = 0;
		this._webMenuCategoryLIsArr = [];
		this._webMenuCategoryMode = false;

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

	// Update <li> array
	_getCategoryLIs() {
		const uls = document.querySelectorAll('.category-list');
		for (let z = 0; z < uls.length; z++) {
			let ulCategoryItems = uls[z].getElementsByTagName('li');
			for (let y = 0; y < ulCategoryItems.length; y++) {
				this._webMenuCategoryLIsArr.push(ulCategoryItems[y]);
			}
		}
	}

	_getListLIs() {
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

	_createItemLI(url, siteID, icon, site, categoryID) {
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

		// Get designated list/category for this li then append this to it
		const categoryListULID = document.querySelector(`#category-list-${categoryID}`);
		categoryListULID.appendChild(li);
	}

	_populateCategories() {
		for (let webData of this._webSites) {
			const site = webData.site;
			const category = webData.category;
			const icon = webData.icon;
			const url = webData.url;

			const siteID = this._whiteSpaceToDash(site);
			const categoryID = this._whiteSpaceToDash(category);

			let categoryBodyDivID = document.querySelector(`#category-body-${categoryID}`);
			if (categoryBodyDivID === null) {
				categoryBodyDivID = document.createElement('li');
				categoryBodyDivID.className = `category-body`;
				categoryBodyDivID.id = `category-body-${categoryID}`;

				const categoryNameH3ID = document.createElement('h3');
				categoryNameH3ID.className = `category-name`;
				categoryNameH3ID.id = `category-name-${categoryID}`;
				categoryNameH3ID.innerText = `${this._capitalizeString(category)}`;

				const categoryListULID = document.createElement('ul');
				categoryListULID.className = `category-list`;
				categoryListULID.id = `category-list-${categoryID}`;

				categoryBodyDivID.appendChild(categoryNameH3ID);
				categoryBodyDivID.appendChild(categoryListULID);
				this._webMenuCategorized.appendChild(categoryBodyDivID);

				this._createItemLI(url, siteID, icon, site, categoryID);
			} else {
				this._createItemLI(url, siteID, icon, site, categoryID);
			}
		}

		this._sortCategories();
	}

	_populateList() {

		// Generate a list
		for (let webData of this._webSites) {
			const site = webData.site;
			const icon = webData.icon;
			const url = webData.url;
			const category = webData.category;

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

			// this._createWebItemCallback(li, url);
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
				this._webListIndex = i;
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

	// _navigateWithArrows(key, len) {

	// 	// Assign constant variables to key codes
	// 	const [right, left, down, up] = [39, 37, 40, 38];

	// 	// Calculate screen width - Allows up/down navigation
	// 	const getIndexByWindowWidth = () => {
	// 		if (window.innerWidth <= 580) { return 1; }

	// 		// Width of elements (<li> and scrollbar) in pixels
	// 		const menuItemWidth = 138;
	// 		const scrollBarWidth = 10;

	// 		// Get viewport width
	// 		const vw = unit => window.innerWidth * (unit / 100);
			
	// 		// Gets the number of columns by dividing the 
	// 		// screen width minus the padding, scroll width and 
	// 		// average of menu item width by the menu item width
	// 		const containerWindow = ((window.innerWidth - (menuItemWidth / 2) -
	// 			scrollBarWidth - vw(24)) / menuItemWidth);
	// 		return Math.round(containerWindow);
	// 	};

	// 	// Update focused item element
	// 	const changeItemFocus = (condition, overFlowIndex) => {
	// 		const next = this._webMenuCategoryLIsArr[this._webListIndex];
	// 		if(typeof next !== 'undefined' && condition) {			
	// 			this._webItemFocus = next;
	// 		} else {
	// 			this._webListIndex = overFlowIndex;
	// 			this._webItemFocus = this._webMenuCategoryLIsArr[parseInt(overFlowIndex, 10)];
	// 		}
	// 	};

	// 	const updateItemFocusByKey = () => {
	// 		if (key === right) {
	// 			return changeItemFocus((this._webListIndex <= len), 0);
	// 		} else if (key === left) {
	// 			return changeItemFocus((this._webListIndex >= 0), len);
	// 		} else if (key === up) {
	// 			return changeItemFocus((this._webListIndex >= 0), len);
	// 		} else if (key === down) {
	// 			return changeItemFocus((this._webListIndex <= len), 0);
	// 		}
	// 	};

	// 	// Determine the index position by key
	// 	const updateWebListIndex = () => {
	// 		if (key === right) {
	// 			this._webListIndex++;
	// 		} else if (key === left) {
	// 			this._webListIndex--;
	// 		} else if (key === up) {
	// 			this._webListIndex = this._webListIndex - getIndexByWindowWidth();
	// 		} else if (key === down) {
	// 			this._webListIndex = this._webListIndex + getIndexByWindowWidth();
	// 		} else {
	// 			return;
	// 		}
	// 		this._webMenuSearchBox.value = '';
	// 	};

	// 	// Set focused element
	// 	const updateFocusedElement = () => {
			
	// 		updateWebListIndex();
	// 		if (this._webItemFocus) {
	// 			this._removeFocus(this._webItemFocus, 'web-item-focus');
	// 			updateItemFocusByKey();
	// 			this._addFocus(this._webItemFocus, 'web-item-focus');
	// 		} else {
	// 			this._webListIndex = 0;
	// 			this._webItemFocus = this._webMenuCategoryLIsArr[0];
	// 			console.log(this._webItemFocus);
	// 			this._addFocus(this._webItemFocus, 'web-item-focus');
	// 		}
	// 	}

	// 	updateFocusedElement();
	// }

	_webMenuKeyDownEvent() {
		this._webMenuScreen.addEventListener(
			'keydown',
			e => {
				// const len = this._webMenuCategoryLIsArr.length;
				// this._navigateWithArrows(e.which, len);
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
			let categoryBodyDivID = document.querySelector(`#category-body-${categoryID}`);
			if (categoryBodyDivID) {

				const categoryUL = document.querySelector(`#category-list-${categoryID}`);
				categoryUL.appendChild(this._webMenuCategoryLIsArr[i]);

			} else {

				categoryBodyDivID = document.createElement('li');
				categoryBodyDivID.className = `category-body`;
				categoryBodyDivID.id = `category-body-${categoryID}`;

				const categoryNameH3ID = document.createElement('h3');
				categoryNameH3ID.className = `category-name`;
				categoryNameH3ID.id = `category-name-${categoryID}`;
				categoryNameH3ID.innerText = `${this._capitalizeString(category)}`;

				const categoryListULID = document.createElement('ul');
				categoryListULID.className = `category-list`;
				categoryListULID.id = `category-list-${categoryID}`;
				categoryListULID.appendChild(this._webMenuCategoryLIsArr[i]);

				categoryBodyDivID.appendChild(categoryNameH3ID);
				categoryBodyDivID.appendChild(categoryListULID);
				this._webMenuCategorized.appendChild(categoryBodyDivID);

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
					this._webItemFocus.scrollIntoView();
				} else {
					this._switchToCategoryMode();
					this._webItemFocus.scrollIntoView();
				}
				this._webMenuCategoryMode = !this._webMenuCategoryMode;
			}
		);	
	}

	_init() {
		if (this._webMenuCategoryMode) {
			this._populateCategories();
			this._getFirstCategoryItem();
		} else {
			this._populateList();
			this._getFirstListItem();
		}
		
		// Fuzzy search
		this._fuzzySearch();

		// Register events
		this._webMenuSearchBoxKeyUpEvent();
		this._webMenuKeyDownEvent();
		this._webMenuModeSwitcherClickEvent();
	}
}