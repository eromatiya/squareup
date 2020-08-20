class AutoSuggestion {
	constructor() {
		this._searchBox = document.querySelector('#search-box');
		this._suggestionsUL = document.querySelector('#suggestions');
		this._suggestionsContainer = document.querySelector('#suggestions-container');
	}

	hideSuggestions() {
		this._suggestionsContainer.classList.remove('suggestion-show');
		this._suggestionsUL.querySelectorAll('*').forEach(child => child.remove());
	}

	_showSuggestions() {
		this._suggestionsContainer.classList.add('suggestion-show');
	}

	_createButtonEvents(button) {

		const nextSuggestion = () => {
			const suggestionButtons = Array.prototype.slice.call(document.querySelectorAll('button'));
			const suggestionIndex = (suggestionButtons.indexOf(document.activeElement) + 1) % suggestionButtons.length;
			const suggestionButton = suggestionButtons[parseInt(suggestionIndex, 10)];
			suggestionButton.focus();
		}

		const previousSuggestion = () => {
			const suggestionButtons = Array.prototype.slice.call(document.querySelectorAll('button'));
			let suggestionIndex = (suggestionButtons.indexOf(document.activeElement) - 1) % suggestionButtons.length;

			if (suggestionIndex < 0) { 
				suggestionIndex = suggestionButtons.length - 1;
			}

			const suggestionButton = suggestionButtons[parseInt(suggestionIndex, 10)];
			suggestionButton.focus();
		}

		const focusSearchBox = () => {
			this._searchBox.value = this._searchBox.value.slice(0, -1);
			this._searchBox.focus();
		}

		const querySend = () => {
			this._searchBox.value = button.innerText;
			searchQuerySend.sendQuery();
		}

		const keyUpEvents = {
			'Enter': function() {
				querySend();
			},
			'Backspace': function() {
				focusSearchBox();
			},
			'ArrowDown': function() {
				nextSuggestion();
			},
			'ArrowRight': function() {
				nextSuggestion();
			},
			'ArrowUp': function() {
				previousSuggestion();
			},
			'ArrowLeft': function() {
				previousSuggestion();
			}
		};

		button.addEventListener(
			'keyup',
			e => {
				e.preventDefault();
				const callback = keyUpEvents[String(e.key)];
				if (typeof callback === 'function') {
					callback();
				}
			}
		);

		button.addEventListener(
			'click',
			e => {
				querySend();
			}
		);
	}

	_parseSuggestionsObject(phrase) {

		// Filter/parse the object
		const suggestion = phrase.map(i => i.phrase)
						.filter(s => !(s.toLowerCase() === String(this._searchBox.value).toLowerCase()))
						.slice(0, 4);

		// Empty UL
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

		// Show suggestions if searchbox > 1
		if (this._searchBox.value.length > 1) {
			this._showSuggestions();
		}
	}

	fetchSuggestions() {
		const endpoint = 'https://duckduckgo.com/ac/';
		const callback = 'autocompleteCallback';
		const searchQuery = String(this._searchBox.value);
		window[String(callback)] = res => {
			// Pass the suggestion object to process it
			this._parseSuggestionsObject(res);
		};

		// Fetch from duckduckgo
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = `${endpoint}?callback=${callback}&q=${searchQuery}`;
		document.querySelector('head').appendChild(script);
	}
}
