# fwb
We create friends with benefits.

### Commands
`lerna bootstap`
Bootstrap the packages in the current Lerna repo. Installing all their dependencies and linking any cross-dependencies.

This command is crucial, as it allows you to use your package names in `require()` as if the packages were already existing and available in your `node_modules` folder.
