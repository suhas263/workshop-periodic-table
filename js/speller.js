export default {
	check,
	lookup,
};

var elements;

await loadPeriodicTable();


// ****************************

async function loadPeriodicTable() {
	elements = await (await fetch("periodic-table.json")).json();
	// console.log(elements);
}

function check(inputWord) {
	// TODO: determine if `inputWord` can be spelled
	// with periodic table symbols; return array with
	// them if so (empty array otherwise)

	// will only check if we have input; in case not we want to return an empty array.
	if(inputWord.length > 0) {
		// I had a tough time figuring this one out
		// elements.forEach((element) => {

		//recursion doesn't work with forEach as there is no way to stop or break a forEach loop
		// when I switched to a for..of loop it started working
		for (let element of elements) {
			let symbol = element.symbol.toLowerCase();
			if(symbol.length <= inputWord.length) {
				// did the symbol match the first one or two characters in `inputWord`
				// depends on the symbol passed in this iteration - can be one letter or two letters
				// e.g:"yucky" - matches the symbol "Y" which is one charac long;
				if (inputWord.slice(0, symbol.length) === symbol) {
					console.log(`sliced input word: ${inputWord.slice(0, symbol.length)}; symbol: ${symbol}`);
					// there will either be a match or no match to the sliced input word.
					// If it matches; then it will check if there are more characters left in the `inputWord`.
					// e.g: "ucky" from the example above ("yucky")

					debugger;
					// does it still have characters left?
					if(inputWord.length > symbol.length) {
						// we now know there are more characters left, so we run a recursion on the remaining characters
						// using recursion here - recursion will not need any state management as the recursed functions are
						// passed with updated parameters e.g: check("ucky") in this case. Whereas when using a loop,
						// we need to manage state by using external states like using "i" for "for loops" and then run it for every
						// character of the `inputWord`
						let res = check(inputWord.slice(symbol.length));
						// the recursive function will keep calling itself until there are no more characters left to match
						// think of recursion always in reverse. New call stacks are added one upon the other and then execution
						// begins and starts returning one after the other to return to the original call stack.
						// Each of the call stack has its own variables and states.

						// matched successfully?
						if (res.length > 0) {
							console.log(`matched successfully: ${[ symbol,  ...res ]}`);
							return [ symbol,  ...res ];
							// check with the call stack while running the application
							// what does res hold? why do we check for its length?
							// res holds the result of the lookup with elements - it returns the matched element / symbol
							// it runs backwards; so this is how it will be returned from the call stack
							// for the very last run, the symbol will be 'y', and since are no more characters left,
							// we will jump to the else block and return the last symbol we found which is 'y'
							// this will be the return of the last check recursion call stack and this will be passed
							// to the next call stack below
							// res = ['y']
							// for the next recursion call stack we will have symbol: 'k'; and the res from the call
							// stack above which is res = ['y']; so the return will be ['k','y']
							// res = ['k','y']
							// next -> symbol: 'c', res: ['k', 'y'] => return ['c','k','y']
							// res = ['c','k','y']
							// next -> symbol: 'u', res: ['c','k', 'y'] => return ['u','c','k','y']
							// res = ['u','c','k','y']
							// next -> symbol: 'y', res: ['u','c','k', 'y'] => return ['y','u','c','k','y']
							// res = ['y','u','c','k','y']
							// and this will be the returned from the check function finally
						}
					}
					else { // case for no characters left
						console.log(`no more characters left, completely matched, symbols are: ${[ symbol ]}`);
						return [ symbol ];
					}
				}

			}
		}
	}
	return [];
}


function lookup(elementSymbol) {
	// TODO: return the element entry based on specified
	// symbol (case-insensitive)
	for (let element of elements) {
		if (element.symbol.toLowerCase() === elementSymbol) {
			return element;
		}
	};
}
