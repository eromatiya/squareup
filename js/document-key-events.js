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

				// Toggle web menu on escape button
				if (e.key === 'Escape') {
					webMenu.toggleWebMenu();
					return;
				}
			}
		);
	}
}
