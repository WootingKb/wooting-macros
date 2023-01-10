We welcome contributions to our project! Here's a few guidelines on how to expand this project.

## What can you do?
There are a couple things you can focus on:
1. Implementing new functionality (actions)
2. Reporting Bugs
3. Fixing Bugs

## Reporting bugs
If you notice some unexpected behaviour occurring in the application:
- First check the dedicated channel on the discord to see if anyone else has mentioned the issue
- If it has been mentioned, but hasn't been addressed yet, and does not have an Issue on this repository, then create an Issue for it.
- If it hasn't been mentioned yet, then mention it. If it is not resolved in a timely manner, create an Issue for it on this repository.
- Please include clear steps to reproduce the situation, and provide a code example.

One of the core contributors will review the Issue, and may comment asking for more information if what you've provided is not enough.

## For fixing bugs and implementing new functionality
1. Start by forking the repository (click the <kbd>Fork</kbd> button at the top right of
   [this page](https://github.com/WootingKb/wooting-macros/)) and create a new branch based on the main branch for your changes.
2. Make your changes and ensure the application works as expected, and that it can successfully build.
3. Submit a Pull Request to the main repository, with a clear description of your changes and summarize what they do.

Once you submit a pull request, one of our core contributors will review it.
- If any changes are needed, they will provide feedback in the pull request.
- Once the changes are made, and everything runs well, the pull request will be merged.

### Dependencies

- [Rust](https://www.rust-lang.org/)
- [Node.js](https://nodejs.org/en/)
- [Yarn (latest)](https://yarnpkg.com/getting-started)
- [ReactJS](https://reactjs.org/)
- [Chakra-UI](https://chakra-ui.com/getting-started)
- [Tauri's prequisites](https://tauri.app/v1/guides/getting-started/prerequisites/)

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

## Additional details for adding a new functionality
Adding new functionality requires work in both the backend and frontend. There are two types of functionality that can be added:
1. Plugins - Plugins are planned to be groups of actions related to a specific program, e.g. OBS. When rendered in the UI, they would all appear under the same accordion collapsible.
2. System Events - Anything that is related to the system itself (Windows, Linux, Mac) or anything that isn't related to another application (i.e. plugin) is a system event

### Backend

### Frontend
The frontend is all about converting the backend actions into frontend structs, rendering out components to allow the user to add the new plugin-related actions to their macros.
You will find the frontend files inside the ```/src``` folder.

Files to edit:
- ```/types.d.ts```: If you are adding a new system event, simply extend the SystemAction type. If you are adding a plugin, you will need to expand the ActionEventType type to include your new plugin type. You may also need to introduce new types for data related to your plugin actions. They can be added at the bottom of the file.
- ```/constants/enums.ts```: You may want to add new enums to use in your newly added types.
- ```/constants/PluginsEventMap.ts```: If you are adding a plugin, you will need to add your actions to this map so that the related PluginsSection.tsx can render out buttons for the user to press to add your actions.
- ```/constants/SystemEventMap.ts```: If you are adding a new system event, you will need to extend this file.

## License
By contributing your code to the Wootomations GitHub repository, you agree to license your contribution under the --- license.
