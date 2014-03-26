TBD

Compilation is now done using browserify:

```shell
browserify src/index.js -o lib.js
```

This allows me to put different modules in different files and then simply require
them from index.js, potentially allowing for multiple modules.
