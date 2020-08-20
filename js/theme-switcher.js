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
		// Increment index while preventing it to go off limits
		this._themeModesArrIndex = (this._themeModesArrIndex + 1) % this._themeModesArr.length;
	}

	_applyThemeColors(themeLightHour, themeLightDark) {

		// Apply CSS Colors based on the active theme
		if (this._activeThemeMode == 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark');
		} else if (this._activeThemeMode == 'light') {
			document.documentElement.setAttribute('data-theme', 'light');
		} else {
			const date = new Date();
			const hour = date.getHours();
			if (hour >= themeLightHour && hour < themeLightDark) {
				document.documentElement.setAttribute('data-theme', 'light');
			} else {
				document.documentElement.setAttribute('data-theme', 'dark');
			}
		}
	}

	_updateThemeMode() {
		this._activeThemeMode = this._themeModesArr[this._themeModesArrIndex];
		let themeObject = this._themeModes[String(this._activeThemeMode)];
		let themeName = themeObject.name;
		let themeIcon = themeObject.icon;
		let themeLightHour = 0;
		let themeLightDark = 0;

		if (this._activeThemeMode === 'auto') {
			themeLightHour = themeObject.lightHour;
			themeLightDark = themeObject.darkHour;
		}

		this._buttonImageThemeSwitch.style.backgroundImage = `url('assets/theme-buttons/${themeIcon}.svg')`;
		this._buttonImageThemeSwitch.style.backgroundSize = 'cover';
		this._applyThemeColors(themeLightHour, themeLightDark);
	}

	themeSwitch() {
		this._updateThemeMode();
		this._localStorage.setItem('themeMode', this._activeThemeMode);
		this._incrementThemeModeIndex();
	}

	_buttonThemeSwitchClickEvent() {
		this._buttonThemeSwitch.addEventListener(
			'click',
			() => {
				this.themeSwitch();
			}
		);
	}

	_init() {
		this._createThemeModeList();
		this._activeThemeMode = this._localStorage.getItem('themeMode') ||
		this._themeModesArr[parseInt(0, 10)];
		this._themeModesArrIndex = this._themeModesArr.indexOf(this._activeThemeMode);
		this._updateThemeMode();
		this._incrementThemeModeIndex();
		this._buttonThemeSwitchClickEvent();
	}
}
