class Places {
	constructor() {
		this._webSites = config.getWebSites();
		this._webMenuCategorized = document.querySelector('#web-menu-categorized');
		this._webMenuSearchBox = document.querySelector('#web-menu-searchbox');
		this._webItemFocus;
		this._webListIndex = 0;
		this._populateCategories();
		this._getFirstCategoryItem();
		this._webMenuSearchBoxKeyUpEvent();
	}

	_whiteSpaceToDash(str) {
		return str.replace(/\s+/g, '-').toLowerCase();
	}

	_capitalizeString(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	_sortCategoryItems() {
		const categoryList = document.querySelectorAll('.category-list');
		for (let category of categoryList) {
			Array.from(category.getElementsByTagName('li'))
			.sort((a, b) => a.textContent.localeCompare(b.textContent))
			.forEach(li => category.appendChild(li));
		}
	}

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

	_getFirstCategoryItem() {
		const uls = document.querySelectorAll('.category-list');
		let lis = [];
		for (let z = 0; z < uls.length; z++) {
			let ulCategoryItems = uls[z].getElementsByTagName('li');
			for (let y = 0; y < ulCategoryItems.length; y++) {
				lis.push(ulCategoryItems[y]);
			}
		}

		this._webItemFocus = lis[0];
		const webItemFocusChildren = this._webItemFocus.querySelector('.web-item');
		webItemFocusChildren.classList.add('web-item-focus');
	}

	_filterWebList() {

		let input, filter, uls, lis, a, i, txtValue;
		
		input = this._webMenuSearchBox;
		filter = input.value.toUpperCase();
		uls = document.querySelectorAll('.category-list');
		// lis = uls.querySelectorAll('.category-item');
		// console.log(uls);

		lis = [];

		for (let z = 0; z < uls.length; z++) {
			let ulCategoryItems = uls[z].getElementsByTagName('li');
			for (let y = 0; y < ulCategoryItems.length; y++) {
				lis.push(ulCategoryItems[y]);
			}
		}
		
		// Loop through all list items, and focus if matches the search query
		for (let i = 0; i < lis.length; i++) {

			a = lis[parseInt(i, 10)].getElementsByClassName('web-item-name')[0];
			txtValue = a.textContent || a.innerText;

			if (txtValue.toUpperCase().indexOf(filter) !== -1) {
			// if (txtValue.toUpperCase().fuzzy(filter, 1) === true) {
				const oldWebItemFocus = this._webItemFocus;
				const oldWebItemFocusChild = oldWebItemFocus.querySelector('.web-item');
				oldWebItemFocusChild.classList.remove('web-item-focus');
				this._webItemFocus = lis[parseInt(i, 10)];
				this._webListIndex = i;
				const webItemFocusChild = this._webItemFocus.querySelector('.web-item');
				webItemFocusChild.classList.add('web-item-focus');
				this._webItemFocus.scrollIntoView();
			}
		}
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
}