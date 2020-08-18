class ThemeSwitcher {
	constructor() {
		this._localStorage = window.localStorage;

		this._buttonThemeSwitch = document.querySelector('#button-theme-switch');
		this._buttonImageThemeSwitch = document.querySelector('#button-image-theme-switch');

		this._themeModes = config.getThemeMode();
		this._themeModesArr = [];
		this._themeModesArrIndex = 0;
		this._activeThemeMode = '';

		this._init()
	}

	_createThemeModeList() {
		Object.keys(this._themeModes).forEach(
			key => {
				this._themeModesArr.push(key);
			}
		);
	}

	_incrementThemeModeIndex() {
		this._themeModesArrIndex = (this._themeModesArrIndex + 1) % this._themeModesArr.length;
	}

	_updateThemeMode() {
		this._activeThemeMode = this._themeModesArr[this._themeModesArrIndex];
		let themeObject = this._themeModes[String(this._activeThemeMode)];

		let themeName = themeObject.name;
		let themeIcon = themeObject.icon;
		let themeLightHour = 0;
		let themeLightDark = 0;

		if (this._activeThemeMode === 'auto') {
			let themeLightHour = themeObject.lightHour;
			let themeLightDark = themeObject.darkHour;
		}

		this._buttonImageThemeSwitch.style.backgroundImage = `url('assets/theme-buttons/${themeIcon}.svg')`;
		this._buttonImageThemeSwitch.style.backgroundSize = 'cover';
	}

	_buttonThemeSwitchClickEvent() {
		this._buttonThemeSwitch.addEventListener(
			'click',
			() => {
				// Update
				this._updateThemeMode();

				// Save search engine
				this._localStorage.setItem('themeMode', this._activeThemeMode);

				// Increment index
				this._incrementThemeModeIndex();
			}
		);
	}

	_init() {
		// Create theme mode array
		this._createThemeModeList();

		// Load theme mode
		this._activeThemeMode = this._localStorage.getItem('themeMode') ||
		this._themeModesArr[parseInt(0, 10)];

		// Get index of default/saved theme mode
		this._themeModesArrIndex = this._themeModesArr.indexOf(this._activeThemeMode);

		// Update
		this._updateThemeMode();

		// Increment index
		this._incrementThemeModeIndex();

		// Register on click event
		this._buttonThemeSwitchClickEvent();
	}
}
