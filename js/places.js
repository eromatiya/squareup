class Places {
	constructor() {
		this._webSites = config.getWebSites();
		this._webMenuCategorized = document.querySelector('#web-menu-categorized');
		this._populateCategories();
	}

	_whiteSpaceToDash(str) {
		return str.replace(/\s+/g, '-').toLowerCase();
	}

	_capitalizeString(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	_sortCategory(obj) {
		Array.from(obj.querySelectorAll('.category-body'))
			.sort((a, b) => a.id.localeCompare(b.id))
			.forEach(li => obj.appendChild(li));
	}

	_createItemLI(url, siteID, icon, site, categoryID) {
		const li = document.createElement('li');

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

		this._sortCategory(this._webMenuCategorized);
	}
}