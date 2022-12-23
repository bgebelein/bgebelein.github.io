# MyWeather weather app

Custom weather app using the OpenWeatherMap OneCall API and Geocoding API.

## HTML

`<header>` and `<footer>` elements are non-dynamic and include some basic info and actions.

Add location and Settings dialogs have a fixed markup. Their content is generated dynamically.

`<main>` will be filled dynamically.

## Templates

- **Add Location List Item Template**: Will be used when searching for a location to generate a resuklt list of found locations.
- **Settings List Item Template**: Will be used to generate the location list in the settings dialog. It includes the delete and drag and drop functionality.
- **Toast Template**: Will be filled with extended information, depending on the card, that was clicked/tapped. A copy of it will be added to the DOM and removed after 3.5s.
- **Weather Template**: Will be filled with weather information of a specific location. Subsequently a copy of it will be attached to the `<main>` element.
