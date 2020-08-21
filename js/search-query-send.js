class SearchQuerySend {
	constructor() {
		this._searchBox = document.querySelector('#search-box');
		this._quickSearchData = config.getQuickSearchData();
	}

	// Is query a valid URL
	_isURL(u) {
		let dummyInput = document.createElement('input');
		dummyInput.setAttribute('type', 'url');
		dummyInput.value = u;
		return dummyInput.validity.valid;
	}

	// Open link
	_openURL(url) {
		window.location.href = encodeURI(url);
	}

	// Quick search
	_quickSearch(query) {
		const prefix = query.substring(0, query.indexOf('/') + 1);

		// Checks if it's a valid quick search
		if (typeof this._quickSearchData[String(prefix)] === 'undefined') {
			return false;
		} else {
			const webSite = this._quickSearchData[String(prefix)].urlPrefix;
			const queryNoSuffix = query.substring(prefix.indexOf('/') + 1);
			this._openURL(webSite + queryNoSuffix);
			return true;
		}
	}

	// Search query
	sendQuery() {
		const searchQuery = this._searchBox.value;

		if (this._isURL(searchQuery)) {
			this._openURL(searchQuery);
			return;
		}

		if (this._quickSearch(searchQuery)) {
			return;
		}
		
		this._openURL(searchEngineSwitcher.getSearchEngineURLPrefix() + searchQuery);
	};
}
