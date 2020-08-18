class SearchBoxKeyEvents {
	constructor() {
		this._searchBox = document.querySelector('#search-box');
		this._registerSearchBoxOnKeyUpEvent();
	}

	_searchBoxOnKeyUpEvent(event) {

		// Fail safe device
		if (!this._searchBox) {
			this._searchBox = document.querySelector('#search-box');
		}

		// Cancel the default action, if needed
		event.preventDefault();
		
		if (event.key === 'Tab') return;

		// Autosuggestion
		if (event.key.length === 1 || event.key === 'Backspace') {
			if (this._searchBox.value < 1) {
				// Hide suggestions
				autoSuggestion.hideSuggestions();
				return;
			}

			// Fetch suggestion/phrases
			autoSuggestion.fetchSuggestions();
			return;
		}

		// Search query
		if (event.key === 'Enter') {

			// Don't accept empty strings
			if (this._searchBox.value < 1) {
				return;
			}

			// Search the web
			searchQuerySend.sendQuery();
		}
	}

	_registerSearchBoxOnKeyUpEvent() {
		this._searchBox.addEventListener('keyup', this._searchBoxOnKeyUpEvent);
	}
}