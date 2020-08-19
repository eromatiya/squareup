## Squareup

A sleek and modern startpage

## Features

+ Responsive UI
+ Web Search Suggestions
+ Mobile Support
+ Theme Switcher
+ Keyboard navigation
+ Search Engine Selection
+ Animated Background
+ Web Menu with Fuzzy Search
+ Vanilla Javascript!
+ And many bugs!

## Keybindings

+ <kbd>Escape</kbd> - toggles web menu
+ <kbd>Control + Space</kbd> - switches search engine
+ <kbd>Alt + Space</kbd> - switches color scheme

## Quick search

+ `r/` + `subreddit name` will open the subreddit if valid or existing.
	- `r/unixporn`
	- `r/startpages`

+ `w/` + `search query` to search on wikipedia.
	- `w/linux`
	- `w/Javascript`

+ `u/` + `search query` to search for an image/photo in unsplash.
	- `u/nature`
	- `u/technology`

+ `a/` + `search query` to search a product on amazon.
	- `a/intel celeron`

+ `e/` + `search query` to search a product on ebay.
	- `e/pentium 4`

+ `y/` + `search query` to search a video on youtube.
	- `y/how to build a nuclear reactor`
	- `y/strange alien sightings in oregon`

+ `n/` + `comic id` to search a "comic" on a certain "comic" website.
	- `n/177013`

+ `g/` + `search query` to search a for a repo/user on github.
	- `g/manilarome`
	- `g/polyfloat`
	- `g/manilarome/polyfloat`

## Settings and Customization

### Customizing color scheme

Change the color scheme by just clicking a button!

+ Dark - Dark colorscheme. Good for the night.
+ Light - Bright colorscheme. Good for killing the eyes.
+ Auto - Load a colorscheme based on time. Edit light/dark mode hours on `js/config.js` 

#### Customizing panel buttons

To add more web shortcuts/buttons on the dock, you have to edit the `panelSites` array in `js/config.js`. Make sure to put an icon with `svg` format for the shortcut in `assets/webcons/` folder.

```js
// Example
const panelSites = [
	{
		site: 'Reddit',
		icon: 'reddit',
		url: 'https://reddit.com/'
	},
	...
]
```

#### Customizing web menu

Add more items or web shortcuts in the web menu by editing the `webSites` array in `js/config.js`. Make sure to put an icon with `svg` format for the shortcut in `assets/webcons/` folder. 

```js
// Example
const webSites = [
	{
		site: 'Reddit',
		icon: 'reddit',
		url: 'https://reddit.com/',
		category: 'social'
	},
	...
]
```

#### Customizing quick search

Add more quick search shortcuts by editing the `quickSearchData` object in `js/config.js`. Make sure to follow the format below:

```js
// Example
const quickSearchData = {
	'r/': {
		urlPrefix: 'https://reddit.com/r/'
	},
	...
}
```

#### Switch default search engine

Google is the default search engine, if you want to change it to DuckDuckGo or something, just click the switcher button on the panel.

Available search engines:

+ Google
+ Duckduckgo
+ Ecosia
+ Yahoo
+ Bing
+ Qwant

#### Customizing available search engines

Add more search engine by editing the `searchEngines` object in `js/config.js`. Make sure to follow the format below:

```js
// Example
const searchEngines = {
	'duckduckgo': {
		name: 'Duckduckgo',
		prefix: 'https://duckduckgo.com/?q='
	},
	...
}
```

### Important Note

+ Make sure that javascript is enabled in your browser! My first plan was to make a javascript-less and a minimal homepage with just a bunch of CSS. But after adding the clock that requires javascript, I can't stop myself from adding stuff<sup>(bloat)</sup>.
+ Make sure to whitelist the startpage in `NoScript` and `Dark Mode Reader` extensions, if you have them installed/running.
+ Tested only on Firefox and Google Chrome.
