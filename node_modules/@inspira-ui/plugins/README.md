<h1 style="text-align: center">@inspira-ui/plugins</h1>

<p style="text-align: center">
A collection of custom Tailwind CSS plugins to enhance your project's UI with dynamic backgrounds and color variables. This package serves as a supporting package for <a href="https://inspira-ui.com">Inspira UI</a> but can also be used independently with any Tailwind CSS project.
</p>

<br />

<p align="center">
  <a href="https://github.com/rahulv-official/inspira-ui-plugins/stargazers">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/rahulv-official/inspira-ui-plugins?style=social">
  </a>
  <a href="https://github.com/rahulv-official/inspira-ui-plugins/blob/main/LICENSE.md">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>  
</p>

## Features

-   **Dynamic Backgrounds**: Add grid and dot pattern backgrounds with customizable colors.
-   **Color Variables**: Automatically generate CSS variables for all Tailwind colors.

## Installation

Install the package via npm:

```bash
npm install @inspira-ui/plugins
```

## Usage

To use the plugins in your Tailwind CSS configuration, simply import the `setupInspiraUI` function and add it to your plugins array:

```js
// tailwind.config.js
const { setupInspiraUI } = require("@inspira-ui/plugins");

module.exports = {
    // Your Tailwind configuration...
    plugins: [setupInspiraUI],
};
```

or if using `tailwind.config.ts`

```ts
// tailwind.config.ts
import { setupInspiraUI } from "@inspira-ui/plugins";

export default {
    // Your Tailwind configuration...
    plugins: [setupInspiraUI],
};
```

This setup will automatically include all the custom plugins provided by this package.

## About

### Supporting Package for Inspira UI

`@inspira-ui/plugins` is designed to work seamlessly with [Inspira UI](https://inspira-ui.com), a modern UI component library for Vue.js. While it enhances the capabilities of Inspira UI, this package is also fully compatible with any Tailwind CSS project, offering flexibility for developers who want to use the plugins independently.

## Available Plugins

### 1. `addBackgrounds`

Adds dynamic background utilities such as grid and dot patterns with customizable colors.

-   **Classes Generated**:
    -   `.bg-grid`
    -   `.bg-grid-small`
    -   `.bg-dot`

### 2. `addVariablesForColors`

Generates CSS variables for all colors defined in your Tailwind configuration.

-   **CSS Variables**: Creates variables like `--primary`, `--secondary`, etc., based on your Tailwind color palette.

## License

This project is licensed under the [MIT License](./LICENSE).

## Contact

-   Author: Rahul Vashishtha
-   Website: [rahulv.dev](https://rahulv.dev)
-   Repository: [GitHub](https://github.com/rahulv-official/inspira-ui-plugins)

For any bugs or issues, please open a new issue on the [GitHub Issues](https://github.com/rahulv-official/inspira-ui-plugins/issues) page.
