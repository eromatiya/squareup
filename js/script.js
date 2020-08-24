// Instantiate all js scripts
// Heirarchy is important here to avoid temporal dead zones

// Instantiate config
const config = new Config();

// Instantiate a clock object
const clock = new Clock();

// Instantiate panel buttons
const panelButtons = new PanelButtons();

// Instantiate central body
const centralBody = new CentralBody();

// Instantiate search box key events
const searchBoxKeyEvents = new SearchBoxKeyEvents();

// Instantiate search query send
const searchQuerySend = new SearchQuerySend();

// Instantiate autosuggestion
const autoSuggestion = new AutoSuggestion();

// Instantiate search engine settings
const searchEngineSwitcher = new SearchEngineSwitcher();

// Instantiate autosuggestion
const paramQuerySend = new ParamQuerySend();

// Instantantiate web menu
const webMenu = new WebMenu();

// Instantiate theme switcher
const themeSwitcher = new ThemeSwitcher();

// Instantiate key events
const documentKeyEvents = new DocumentKeyEvents();

