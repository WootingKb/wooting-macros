We welcome contributions to our project! Here's a few guidelines on how to expand this project.

Please note that the project currently only works on MS Windows and Linux, macOS is only available as an experimental backend-only application you can run on your own - see the backend section.

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

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/en/) (Recommended >=16.10)
- [Yarn (latest)](https://yarnpkg.com/getting-started)
- [Tauri's prequisites](https://tauri.app/v1/guides/getting-started/prerequisites/)
- For windows installations, you will need to have C++ build tools - see the information on the Rust link above on how to install them.

## Building

First, make sure you have corepack enabled

```
corepack enable
```

Then run yarn to install all the necessary dependencies using either of the following commands:

```
yarn
yarn install
```

When you have the setup ready there is additional dependencies you must install on Linux to make the grabbing work, namely the ``xserver-xorg-input-evdev`` and ``libevdev2`` libraries. You might also need to add yourself to the ``input`` group. For more information, please look at the https://github.com/Narsil/rdev library instructions.

### Good practices

For development we recommend using Visual Studio Code with the ``rust-analyzer`` addon as well as using the ``clippy`` linter. Please, use ``cargo clippy`` and ``cargo check`` before you submit your code as we do treat warnings as hard errors on builds. 

Please use the ``info!``, ``error!``, ``warn!`` and alike macros by the ``log`` library on the backend to log information, instead of ``println!`` macros. Don't forget to setup your env variables to see the logging output in stdout as menitoned in [Devving](#devving).

For frontend, we recommend having ESlint and Prettier, and using the command

```
yarn lint
```

This will ensure that any contribution is consistent with the rest of the codebase.

### Devving

To start the development server, run:

```
yarn tauri dev
```

Note: The development server might take a long time to initialize the frontend - this will not be the case when the application is built in release mode.

In order to see the logging in the terminal, you should set your environmental variables like so:

```
RUST_LOG = info
```

### Deploying

To make a production build, run:

```
yarn tauri build
```

Note that you might be required to sign the application on MS Windows. If this is the case and the build fails, you can remove the ``"windows"`` certificate section in the ``"tauri"`` part of the ``tauri.conf.json``. Note that distributing the unsigned application is not recommended as it might be problematic for anti-virus and anti-cheat software.

## Additional details for adding a new functionality
Adding new functionality requires work in both the backend and frontend. There are two types of functionality that can be added:
1. Plugins - Plugins are planned to be groups of actions related to a specific program, e.g. OBS. When rendered in the UI, they would all appear under the same accordion collapsible.
2. System Events - Anything that is related to the system itself (Windows, Linux, Mac) or anything that isn't related to another application (i.e. plugin) is a system event

### Backend
The backend can be run on macOS but it will not work with frontend running. The split nature of the backend allows you to develop and prototype on macOS but the full stack is not yet supported.

The backend is about making the application do what it should do. Many features are done via different libraries. The entire backend is async and using the Tokio executor for achieving good performance. Communication via the frontend is done using Rust's enums/structs serialized into JSON format via serde.

There are 2 main types of actions: Trigger event types and Action event types. When you make a macro you can assign a trigger - this is handled by the Trigger event type enum and represents the possible triggers of a macro. 

Action event types represent all the actions that can happen - be it a keypress or some OBS action. The required data is then represented and handled by the specific module file that you can link to. When an action gets executed, the executor starts reading the macro according to the sequence of actions and queuing sequence of actions to execute. Some need to be normalized and handled by a single executor (key presses) in order to preserve the OS required delays between actions, others can happen instantly when their turn is up. 

The entire backend that handles actions is in ``wooting-macro-backend``. The backend that handles close communication and initialization with the frontend is in ``src-tauri``. Both cooperate, but are intentionally designed to be split from each other. This is an important thing to think about when extending the tauri function calls in ``src-tauri``'s ``main``. 

In order to add a new action, you should create a new plugin file, make all the required functions and datastructures there (including adding libraries), then add the module to ``mod.rs``. After that, go to the ``lib.rs`` and expand the enums to cover the new plugin. After that you need to implement the ``execute`` method on the enums and then you are basically finished - only thing remaining is to do the frontend and update the data structures there to save the data in a proper format.

There might be some scalability issues involved in how we handle the passing of data to the executors of macros, some data may be required to pass without of which you cannot meaningfully extend the backend. Feel free to suggest changes that can make the entire process of expanding the functionality easier. Currently, we do not have a modular "enable-disable" plugin system in place, though it could be implemented. Feel free to experiment in these areas too.

### Frontend
The frontend is all about converting the backend actions into frontend structs, rendering out components to allow the user to add the new plugin-related actions to their macros.
You will find the frontend files inside the ```/src``` folder.

Files to edit:
- ```/types.d.ts```: If you are adding a new system event, simply extend the SystemAction type. If you are adding a plugin, you will need to expand the ActionEventType type to include your new plugin type. You may also need to introduce new types for data related to your plugin actions. They can be added at the bottom of the file.
- ```/constants/enums.ts```: You may want to add new enums to use in your newly added types.
- ```/constants/PluginsEventMap.ts```: If you are adding a plugin, you will need to add your actions to this map so that the related PluginsSection.tsx can render out buttons for the user to press to add your actions.
- ```/constants/SystemEventMap.ts```: If you are adding a new system event, you will need to extend this file.
- ```/constants/utils.ts```: If you are adding a new system event or plugin, you will need to extend the checkIfElementIsEditable and getElementDisplayString functions.

## License
By contributing your code to the Wootomation GitHub repository, you agree to license your contribution under the --- license.
