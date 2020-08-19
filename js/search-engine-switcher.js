class SearchEngineSwitcher {
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
	}

	getSearchEngineURLPrefix() {
		return this._activeSearchEnginePrefix;
	}

	_updateSearchEngine() {
		this._activeSearchEngine = this._searchEnginesArr[String(this._searchEnginesIndex)];
		let searchEngineObject = this._searchEngines[String(this._activeSearchEngine)];

		this._activeSearchEnginePrefix = searchEngineObject.prefix;
		let searchEngineName = searchEngineObject.name;
		let searchEngineIcon = searchEngineObject.icon;

		// Update search engine icon
		this._buttonImageSearchEngine.style.backgroundImage = `url('assets/search-engines/${searchEngineIcon}.svg')`
		this._buttonImageSearchEngine.style.backgroundSize = 'cover';

		// Update search box placeholder
		this._searchBox.placeholder = `Search with ${searchEngineName}`;
	}

	_incrementSearchEngineIndex() {
		// Increment index while preventing it to go off limits
		this._searchEnginesIndex = (this._searchEnginesIndex + 1) % this._searchEnginesArr.length;
	}

	searchEngineSwitch() {
		// Update
		this._updateSearchEngine();
				
		// Save search engine
		this._localStorage.setItem('searchEngine', this._activeSearchEngine);

		// Increment index
		this._incrementSearchEngineIndex();
	}

	_buttonSearchEngineClickEvent() {
		this._buttonSearchEngine.addEventListener(
			'click',
			() => {
				// Switch search engine
				this.searchEngineSwitch();
			}
		)
	}

	_init() {
		// Create an array of search engine
		this._createSearchEngineList();

		// Load search engine
		this._activeSearchEngine = this._localStorage.getItem('searchEngine') ||
		this._searchEnginesArr[parseInt(0, 10)];

		// Get index of default/saved search engine
		this._searchEnginesIndex = this._searchEnginesArr.indexOf(this._activeSearchEngine);

		// Update
		this._updateSearchEngine();

		// Increment index
		this._incrementSearchEngineIndex();

		// Register on click events
		this._buttonSearchEngineClickEvent();
	}
}
