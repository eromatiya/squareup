class SearchBoxKeyEvents {
	constructor() {
		this._searchBox = document.querySelector('#search-box');
		this._registerSearchBoxOnKeyUpEvent();
	}

	_registerSearchBoxOnKeyUpEvent() {

		this._searchBox.addEventListener(
			'keyup',
			e => {
				e.preventDefault();
				
				// Fail safe device
				if (!this._searchBox) {
					this._searchBox = document.querySelector('#search-box');
				}
				
				if (e.key === 'Tab') return;

				if (e.key.length === 1 || e.key === 'Backspace') {
					if (this._searchBox.value < 1) {
						autoSuggestion.hideSuggestions();
						return;
					}

					// Fetch suggestion
					autoSuggestion.fetchSuggestions();
					return;
				}

				// Search query
				if (e.key === 'Enter') {

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
