class CentralBody {
	constructor() {
		this._centralBody = document.querySelector('#central-body');
	}

	hideCentralBody() {
		this._centralBody.classList.add('central-body-hide');
	}

	showCentralBody() {
		this._centralBody.classList.remove('central-body-hide');
	}
}
