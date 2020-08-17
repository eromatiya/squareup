class PanelButtons {
	
	constructor() {
		this._panel = document.querySelector('#panel-body');
		
		// Retrieve dockSites object from Config instance
		this._dockSites = config.getDockSites();
		
		// Populate dock
		this._populatePanel();
	}

	_buildPanelkButton(id, className, callback = null) {

		const dockButton = document.createElement('div');
		dockButton.id = `button${id}`;
		dockButton.className = className;
		dockButton.onmouseup = callback;

		return dockButton;
	}

	_buildPanelkButtonImage(id, className, background) {

		const buttonImage = document.createElement('div');
		buttonImage.id = id;
		buttonImage.className = className;
		buttonImage.style.backgroundImage = background;
	
		return buttonImage;
	}
	
	_generateFromList() {
		for (let i = 0; i < (this._dockSites.length); i++) {
	
			const site = this._dockSites[parseInt(i, 10)].site;
			const icon = this._dockSites[parseInt(i, 10)].icon;
			const url = this._dockSites[parseInt(i, 10)].url;
	
			// Create a href
			const aDock = document.createElement('a');
			aDock.className = 'panel-link';
			aDock.href = url;
			aDock.tabIndex = '-1';
	
			// Create div container
			const dockButton = this._buildPanelkButton(
				site,
				'panel-button'
			);
	
			// Create div container for button icon
			const buttonImage = this._buildPanelkButtonImage(
				`buttonImage${i}`,
				'panel-button-image',
				`url('assets/webcons/${icon}.svg')`
			);
	
			// Append divs
			dockButton.appendChild(buttonImage);
			aDock.appendChild(dockButton);
			this._panel.appendChild(aDock);
		}
	}

	_populatePanel() {
		
		this._generateFromList();

	}
}
