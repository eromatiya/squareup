class SearchEngineSettings {
	constructor() {
		this._localStorage = window.localStorage;
		this._searchBox = document.querySelector('#search-box');
		this._buttonSearchEngine = document.querySelector('#button-search-engine');
		this._buttonImageSearchEngine = document.querySelector('#button-image-search-engine');

		this._searchEngines = config.getSearchEngines();
		this._searchEnginesArr = [];
		this._searchEnginesIndex = 0;

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

	_init() {
		this._createSearchEngineList();
	}

	_buttonSearchEngineClickEvent() {
		this._buttonSearchEngine.addEventListener(
			'click',
			() => {
				let activeSearchEngine = this._searchEnginesArr[String(this._searchEnginesIndex)];
				let searchEngineObject = this._searchEngines[String(activeSearchEngine)];

				let sePrefix = searchEngineObject.prefix;
				let seIcon = searchEngineObject.icon;

				// Create dummy image
				this._buttonImageSearchEngine.style.backgroundImage = `url('assets/search-engines/${seIcon}.svg')`
				this._buttonImageSearchEngine.style.backgroundSize = 'cover';

				// Increment while preventing the index to go off limits
				this._searchEnginesIndex = (this._searchEnginesIndex + 1) % this._searchEnginesArr.length;
			}
		)
	}
}
