# Watcher
Watcher is a standalone 2KB micro-library, written in ES6. Watcher tracks all happening changes on your website, or any specific element on it.

## Features
 - Track any changes happening inside your DOM.
 - Track specific elements or the whole website
 - Option to add new custom trackers
 - Detect and minimize browser reflow

## Manual installation
Ensure you're using the files from the `dist` directory (contains compiled production-ready code).
  
```html
<body>
  <!-- html above -->
  <script src="dist/watcher.min.js"></script>
  <script>
  // your script
  </script>
</body>
```

#### new Watcher()
Use `new Watcher()` to create a new Watcher instance.
```js
/**
 * 1. Element to track on
 * 2. Options
 * 3. Gets fired, when a change inside your DOM was detected
 */
new Watcher(element, {}, (e) => console.log(e));
```

#### Watcher.start()
Use `Watcher.start()` to start tracking on the given element.
```js

let watch = new Watcher(element, {}, (e) => console.log(e));
watch.start();
```

#### Watcher.stop()
Use `Watcher.stop()` to stop/pause tracking on the given element.
```js
let watch = new Watcher(element, {}, (e) => console.log(e));
watch.start();
// Do something
watch.stop();
// Do something, but won't get tracked
watch.start();
// Tracking enabled again
```

#### Watcher.register()
Use `Watcher.register()` to add a new tracking rule, which has to get logged, from now.
Watcher.register is static, so you can add new rules globally or locally (into a specific Watcher instance).</br>
Both rule and action property, receive a *mutation* object as parameter, which contains the tracked changes of your element.
```js
// Globally
Watcher.register(
  // The rule to pass
  rule: (m) => {
    return (m.type === "attributes");
  },
  // Rule has returned true, perform the given action
  action: (m) => {
    console.log(`Changed ${ m.attributeName } of`, m.target);
  }
);

// Locally
let watch = new Watcher(element, {}, (e) => console.log(e));
watch.register(
//blabla
);
```
