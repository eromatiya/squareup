class DocumentKeyEvents {
	constructor() {
		this._keysLog = {};
		this._keyUpEvent();
		this._keyDownEvent();
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

				// Switch search engine
				if (this._keysLog['Control'] && e.code === 'Space') {
					e.preventDefault();
					searchEngineSwitcher.searchEngineSwitch();
					return;
				}

				// Switch color scheme
				if (this._keysLog['Alt'] && e.code === 'Space') {
					e.preventDefault();
					themeSwitcher.themeSwitch();
					return;
				}

				delete this._keysLog[e.key];
			}
		);
	}

	_keyDownEvent() {
		document.addEventListener(
			'keydown',
			e => {
				this._keysLog[e.key] = true;
			}
		);
	}
}
