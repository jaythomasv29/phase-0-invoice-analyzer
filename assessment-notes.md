Start time: Aug 3 20:42
End time: Aug 3 11:41
I haven't coded in a few years. I needed time to recall, and fix minor mistakes.

Bugs occured on some reference errors
I would improve by not jumping into things too quickly
I felt that the readability and executing of things came back fast, the beginner stuff of JS came back quick. Some little quircks needed googling.

Documentation I used:
Google
Google AI Search
Sometimes Google AI Search popped up automatically
W3 school

Log:

- Used a validate date from Google

- Changed type to module for importing
  This error happens because Node.js defaults to CommonJS syntax (require / module.exports), but your file uses ES Module (ESM) syntax (export).
  Solution 1: Add "type": "module" to package.json (Recommended)
  Open your package.json file in the root of your project and add "type": "module": When you import an array using dynamic import() or certain module systems, JavaScript returns a Promise because module loading is asynchronous. The code must wait for the file to load and run before the data is ready. You need to use await or .then() to read the actual array.

I asked Google, in AI Mode:

- How do I check for undefined and a length:
  To check if an array is defined and contains elements, combine an existence check with a .length check using the logical AND (&&) operator or optional chaining (?.). This prevents "Cannot read properties of undefined" errors.

Googled JS Array Iternation methods found what I needed on w3school

- I did a google of what .flatMap() is, it can basically do a .map() and a .filter() in a single pass.

- I searched how to get rid of duplicate Objects
- What does the [...new Map arr.values()] do?
  This transforms your array of objects into an array of key-value pairs.Input: [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 1, name: 'Alice'}]Output: [[1, {id: 1, name: 'Alice'}], [2, {id: 2, name: 'Bob'}], [1, {id: 1, name: 'Alice'}]]

- reduce through array of objects and only get one

- I don't know how to test, i never written tests before
  -Learned about +.toFixed()
