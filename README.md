# Coding Session Log

**Start time:** Aug 3, 20:42
**End time:** Aug 3, 11:41
**Start revision** Aug 5, 18:15
**End revision time:** Aug 5, 17:40

## Reflection

I haven't coded in a few years, so I needed time to recall syntax and fix minor mistakes. Bugs mostly came from reference errors. I'd improve by not jumping into things too quickly.

Readability and the general flow of writing/executing code came back fast — the JS basics returned quickly. A few quirks still needed a quick search to jog my memory.

## Documentation Used

- Google
- Google AI Search (sometimes it popped up automatically)
- W3Schools

## Session Log

- Used a `validate date` snippet found via Google.

- **Changed `"type": "module"` for importing.**
  This error happens because Node.js defaults to CommonJS syntax (`require` / `module.exports`), but the file used ES Module (ESM) syntax (`export`).

  **Solution:** Add `"type": "module"` to `package.json` (recommended). When importing an array using dynamic `import()` or certain module systems, JavaScript returns a Promise because module loading is asynchronous — the code has to wait for the file to load and run before the data is ready. You need `await` or `.then()` to read the actual array.

- **Asked Google (AI Mode): How do I check for `undefined` and length?**
  To check if an array is defined and contains elements, combine an existence check with a `.length` check using `&&` or optional chaining (`?.`). This prevents "Cannot read properties of undefined" errors.

- Googled JS array iteration methods — found what I needed on W3Schools.

- Looked up what `.flatMap()` is — it basically does a `.map()` and a `.filter()` in a single pass.

- Searched how to get rid of duplicate objects.

- **What does `[...new Map(arr.values())]` do?**
  It transforms an array of objects into an array of key-value pairs.
  - Input: `[{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 1, name: 'Alice'}]`
  - Output: `[[1, {id: 1, name: 'Alice'}], [2, {id: 2, name: 'Bob'}], [1, {id: 1, name: 'Alice'}]]`

- Used `.reduce()` through an array of objects to only get one result.

- Don't know how to test — never written tests before.

- Learned about `.toFixed()`.

Revision:

- Learned how to test
- Learned how to change code to iterate better, modified function to do it all in one pass, instead of having multiple loops over and over. That became helpful when calculating subtotal, and total
- Learned the proper way of validating input
