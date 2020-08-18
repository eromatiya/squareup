class SearchEngineSettings {
	constructor() {
		this._localStorage = window.localStorage;
		this._searchBox = document.querySelector('#search-box');
		this._buttonSearchEngine = document.querySelector('#button-search-engine');
		this._buttonImageSearchEngine = document.querySelector('#button-image-search-engine');

		this._searchEngines = config.getSearchEngines();
		this._searchEnginesArr = [];
		this._searchEnginesIndex = 0;
		this._activeSearchEngine = '';
		this._activeSearchEnginePrefix = '';

		this._init()
	}

	_createSearchEngineList() {
		Object.keys(this._searchEngines).forEach(
			key => {
				this._searchEnginesArr.push(key);
			}
		);
		this._buttonSearchEngineClickEvent();
	}

	getSearchEngineURLPrefix() {
		return this._activeSearchEnginePrefix;
	}

	_updateSearchEngine() {
		this._activeSearchEngine = this._searchEnginesArr[String(this._searchEnginesIndex)];
		let searchEngineObject = this._searchEngines[String(this._activeSearchEngine)];

		this._activeSearchEnginePrefix = searchEngineObject.prefix;
		let searchEngineIcon = searchEngineObject.icon;

		// Update search engine icon
		this._buttonImageSearchEngine.style.backgroundImage = `url('assets/search-engines/${searchEngineIcon}.svg')`
		this._buttonImageSearchEngine.style.backgroundSize = 'cover';
	}

	_incrementSearchEngineIndex() {
		// Increment index while preventing the it to go off limits
		this._searchEnginesIndex = (this._searchEnginesIndex + 1) % this._searchEnginesArr.length;
	}

	_buttonSearchEngineClickEvent() {
		this._buttonSearchEngine.addEventListener(
			'click',
			() => {
				// Update
				this._updateSearchEngine();
				
				// Save search engine
				this._localStorage.setItem('searchEngine', this._activeSearchEngine);

				// Increment index
				this._incrementSearchEngineIndex();
			}
		)
	}

	_init() {
		// Create an array of search engine
		this._createSearchEngineList();

		// Load search engine
		this._activeSearchEngine = this._localStorage.getItem('searchEngine') || 'duckduckgo';

		// Get index of default/saved search engine
		this._searchEnginesIndex = this._searchEnginesArr.indexOf(this._activeSearchEngine);

		// Update
		this._updateSearchEngine();

		// Increment index
		this._incrementSearchEngineIndex();
	}
}
