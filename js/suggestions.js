class AutoSuggestion {
	constructor() {
		this._searchBox = document.querySelector('#search-box');
		this._suggestionsUL = document.querySelector('#suggestions');
		this._suggestionsContainer = document.querySelector('#suggestions-container');
	}

	hideSuggestions() {
		// Hide suggestions
		this._suggestionsContainer.classList.remove('suggestion-show');

		// Kill all UL's children
		// Massacre them all
		this._suggestionsUL.querySelectorAll('*').forEach(child => child.remove());
	}

	_showSuggestions() {
		// Show suggestions
		this._suggestionsContainer.classList.add('suggestion-show');
	}

	// Create input events
	_createButtonEvents(button) {

		// Update searchbox on enter key and mouse click
		button.addEventListener(
			'keyup',
			e => {
				if (e.key === 'Enter') {

					this._searchBox.value = button.innerText;
					this._searchBox.focus();

				} else if (e.key === 'Backspace') {

					this._searchBox.focus();

				} else if ((e.key === 'ArrowDown') || e.key === 'ArrowRight') {

					e.preventDefault();

					const suggestionButtons = Array.prototype.slice.call(document.querySelectorAll('button'));
					const suggestionIndex = (suggestionButtons.indexOf(document.activeElement) + 1) % suggestionButtons.length;
					const suggestionButton = suggestionButtons[parseInt(suggestionIndex, 10)];
					suggestionButton.focus();

				} else if ((e.key === 'ArrowUp') || e.key === 'ArrowLeft') {

					e.preventDefault();

					const suggestionButtons = Array.prototype.slice.call(document.querySelectorAll('button'));
					let suggestionIndex = (suggestionButtons.indexOf(document.activeElement) - 1) % suggestionButtons.length;

					if (suggestionIndex < 0) { 
						suggestionIndex = suggestionButtons.length - 1;
					}

					const suggestionButton = suggestionButtons[parseInt(suggestionIndex, 10)];
					suggestionButton.focus();
				}
			}
		);

		button.addEventListener(
			'click',
			e => {
				this._searchBox.value = button.innerText;
				this._searchBox.focus();
			}
		);
	}

	// Generate and parse suggestions
	_autocompleteCallback(phrase) {

		// Filter/parse the object
		const suggestion = phrase.map(i => i.phrase)
						.filter(s => !(s.toLowerCase() === String(this._searchBox.value).toLowerCase()))
						.slice(0, 4);

		// Empty UL on every callback to refresh list
		this._suggestionsUL.querySelectorAll('*').forEach(child => child.remove());

		// Generate list elements
		for (let phrases of suggestion) {

			// Create HTML elements
			const li = document.createElement('li');
			li.className = 'suggestion';

			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'suggestion-button';
			button.innerText = phrases;

			// Create input events
			this._createButtonEvents(button);

			// Appent to ul
			li.appendChild(button);
			this._suggestionsUL.appendChild(li);
		}

		// Don't show if searchbox has no value
		if (this._searchBox.value.length > 1) {
			// Show suggestions
			this._showSuggestions();
		}
	}

	fetchSuggestions() {
		const endpoint = 'https://duckduckgo.com/ac/';
		const callback = 'autocompleteCallback';
		const searchQuery = String(this._searchBox.value);
		window[String(callback)] = res => {
			// Passed the suggestion object to process it
			this._autocompleteCallback(res);
		};

		// Fetch from duckduckgo
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = `${endpoint}?callback=${callback}&q=${searchQuery}`;
		document.querySelector('head').appendChild(script);
	}
}
