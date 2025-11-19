# Publishing to NPM

## Prerequisites
1.  Create an account on [npmjs.com](https://www.npmjs.com/).
2.  Login to npm in your terminal:
    ```bash
    npm login
    ```

## Publishing Steps

1.  **Update Version**:
    Increment the version number in `package.json`. You can use `npm version`:
    ```bash
    npm version patch # 0.0.1 -> 0.0.2
    # or
    npm version minor # 0.1.0 -> 0.2.0
    # or
    npm version major # 1.0.0 -> 2.0.0
    ```

2.  **Build and Publish**:
    Run the publish command. This will automatically run the `build` script first (due to `prepublishOnly`).
    ```bash
    npm publish --access public
    ```
    *Note: Remove `--access public` if you are publishing a scoped package privately.*

## Testing Locally
To test the package locally before publishing:
1.  Run `npm pack` to create a `.tgz` file.
2.  Install it in another project:
    ```bash
    npm install /path/to/zero-chart-0.0.1.tgz
    ```
