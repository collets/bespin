## Bespin - A simple carousel project

## Installation

```bash
git clone https://github.com/collets/bespin.git
```

```bash
npm install
```

or

```bash
yarn install
```

## Usage

The project is provided with two scripts: start and build.

### Start

This script is for local run of the project, it uses a webpack webserver to serve the application in the browser.

```bash
npm run start
```

### Build

This script is for building the application in production mode. Is the script used on the CI/CD pipeline to create the artifacts that will be deployed to a Firebase Hosting.

```bash
npm run build
```

## Ready to go prototype

You can find a working prototype on this url: [https://bespin-81fcb.web.app/](https://bespin-81fcb.web.app/)

## Functionality

* Responsive layout of the carousel, works well from desktop to mobile devices
* Manual control with mouse
* Touch and mouse swipe control
* Written in Vanilla JS ES6 and SCSS, transpiled in CSS and boundled with webpack
* Reusable component, able to instantiate many instances
* Fetch function with delay to simulate a REST API call
* Placeholder during the loading
* No use of third party library 

**TODO** 
* Add Babel to extend JS compatibility
* Add better animations, requires a rewriting of the load mechanism

## Compatibility

Manually tested on:
* Chrome (v. 84.0.4147.89)
* Edge (v. 84.0.522.40)
* Firefox (v. 78.0.2)
* Android Chrome (v. 84.0.4147.89)

**TODO** Extend compatibility with all device and major browser