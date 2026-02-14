# Source View Tool

I can make error finding in **Mozilla Firefox** more comfortable :)\
I help you jumping right to the errors you need to fix!

## How to use me?

### Bookmarklet

Be aware to choose the bookmark type you want, a static one or an automatically updating one!\
Go to [this website](https://aquajo.github.io/sourceViewTool/) and drag the bookmarklet into your bookmarklets-list.

### The long way

Copy [this](./inject.js) into a console on a Source-View-Page (Ctrl+U) in firefox and jump right into the errors instead of the need to search for them! ^^\
Currently only button-control is supported.

### Other way

You may also find a way to save a browser snippet in Mozilla, similar to how it's done in Chrome.

## Preview

![](./preview.png)

## Development

To get started, simply run `npm run dev`.\
That will spin up a local server on port 8041.

Open http://localhost:8041 in your browser and drag the provided bookmarklet into your bookmarks bar.

This bookmarklet is automatically reflecting the newest inject.js.

You don't need to build manually; the CI will take care of generating `index.html` and the bundle.

## Todo

- configure auto injection
- improve CI/CD
