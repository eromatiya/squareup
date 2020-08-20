class SearchBoxKeyEvents {
	constructor() {
		this._searchBox = document.querySelector('#search-box');
		this._registerSearchBoxOnKeyUpEvent();
	}

	_registerSearchBoxOnKeyUpEvent(event) {

		this._searchBox.addEventListener(
			'keyup',
			e => {
				event.preventDefault();
				
				// Fail safe device
				if (!this._searchBox) {
					this._searchBox = document.querySelector('#search-box');
				}
				
				if (event.key === 'Tab') return;

				if (event.key.length === 1 || event.key === 'Backspace') {
					if (this._searchBox.value < 1) {
						autoSuggestion.hideSuggestions();
						return;
					}

					// Fetch suggestion
					autoSuggestion.fetchSuggestions();
					return;
				}

				// Search query
				if (event.key === 'Enter') {

					// Don't accept empty strings
					if (this._searchBox.value < 1) {
						return;
					}

					searchQuerySend.sendQuery();
				}
			}
		);
	}
}
