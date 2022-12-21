<p align="center">
  <img alt="Wooting Macro App* – Create macros to use with any keyboard and any mouse" src=".github/assets/app-hero-banner.svg">
</p>

<p align="left">
  <a href="https://twitter.com/intent/follow?screen_name=WootingKB">
    <img alt="Follow us on Twitter" src="https://img.shields.io/twitter/follow/WootingKB?style=social">
  </a>
</p>

## Features

- **Create Macros:** perform keystrokes, open applications, folders, and websites, paste text with emojis, and more.
- **Organize your macros:** group macros into specific collections, allowing you to toggle the entire collection on/off.
- **Any Keyboard, Any Mouse:** you can bind the macros to be activated by any keyboard key or mouse button.
- **Open Source:** want to help out? See below on how to get started.
- **Windows & Linux:** Support for Windows 10/11 and most Linux distros*. MacOS support is definitely on our radar.

*Linux is supported, but may be unstable with Wayland. Different DEs and distributions may result in various bugs - please report them. Some input latency may be introduced on Linux due to the scheduler. You can increase the niceness of the process manually to eliminate it.

## Warnings

**Please do be aware that this application does grab and analyze keystrokes. While you are able to disable this temporarily using an appropriate function, you should still not use this application with anti-cheat heavy games (use at your own risk!) such as: Dota 2, CS:GO, Rainbow Six: Siege, Valorant, League of Legends, Tower Unite. Please doublecheck if a game is using an anti-cheat software!**

## Table of Contents

- Installing the App
- Documentation
- Contributing
- Building

## Installing the App
Download the [Latest Release here](https://github.com/WootingKb/wooting-macros/releases/latest)

For MS Windows, download the MSI and then run it to install the application.

For Linux, download the AppImage or .deb and install the application.

## Documentation

Additional documentation for compiling and making your own plugins will be available soon.

## Contributing

The project runs with a Rust backend and React frontend (TS), with Tauri connecting the two. The backend is split into flexible modules. To make your own module, please follow the documentation to set up your environment.

### Dependencies

- Rust
- Node.js
- Yarn
- [Tauri's prequisites](https://tauri.app/v1/guides/getting-started/prerequisites/)

What we'd like the community to focus on is implementing plugins that allow a user to add specific actions to their macro sequences. E.g. Controlling smart lights brightness, colour, etc.

This entails adding to both the backend and frontend. In the backend, you would add the logic required for the actions to work. In the frontend, you would simply update the necessary UI and maps that would render for a user.

You can always open an issue if you encounter any problems. Looking to add something you created? If it's a small change (i.e. text change or bug fix) feel free to open a PR anytime. If you want to add a feature, please open an issue to discuss with the community first.

## Building

First, run yarn to install all the necessary dependencies.

```
yarn
```

### Devving

To start the development server, run:

```
yarn tauri dev
```

### Deploying

To make a production build, run:

```
yarn tauri build
```
