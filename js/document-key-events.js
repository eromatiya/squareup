class DocumentKeyEvents {
	constructor() {
		this._keyUpEvent();
	}

	_keyUpEvent() {
		document.addEventListener(
			'keyup',
			e => {

				// Prevent default escape key function
				e.preventDefault();

				if (e.key === 'Escape') {
					webMenu.toggleWebMenu();
				}
			}
		);
	}
}
