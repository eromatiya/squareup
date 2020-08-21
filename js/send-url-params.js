class ParamQuerySend {
	constructor() {
		this._searchBox = document.querySelector('#search-box');
		this._loadQueryParam();
	}

	_loadQueryParam() {
		// Accepts URL query
		let paramString = window.location.search;
		let queryString = new URLSearchParams(String(paramString));
		let q = queryString.has('q');
		if (q) this._paramSendQuery(queryString.get('q'));
    }

    _paramSendQuery(param) {
    	this._searchBox.value = String(param);
    	searchQuerySend.sendQuery();
    }
}
