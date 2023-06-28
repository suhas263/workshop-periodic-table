export default {
	check,
	lookup,
};

var elements;
// creating an index for symbols so that we don't have to loop over elements every single time
// we need to look up something
var symbols = {};

await loadPeriodicTable();


// ****************************

async function loadPeriodicTable() {
	elements = await (await fetch("periodic-table.json")).json();
	// to create an index of symbols we loop over each element and then create a key with
	// the lowercase symbol of that element (e.g: "h" for hydrogen), and within this key save
	// the element object itself (with its name, number and symbol)
	for(let element of elements) {
		symbols[element.symbol.toLowerCase()] = element;
	}
	// we now have a symbols object/index that can do the lookup for us, we don't have to loop
	// over the elements to find a match now. optimise the algorithm
	// big O notation - time complexity & memory complexity an algorithm takes
	// in the worst case, average case and best case. Way of describing the worst possible outcome
	// O(1) is constant time - one operation.
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
	// since we already have a `symbols` index built, we just need to look up the
	// `elementSymbol` from this index; which makes this very quick
	return symbols[elementSymbol];
	// we call this the o(1) operation - single operation; no built-in complexity
	// using JS we do a single unit of operation; unit of cost
	// earlier we were doing an O(n) on a single symbol; so for m symbols we were doing O(n) * m times
	// 	 so from O(n) * m; we went to O(1).
	// https://www.freecodecamp.org/news/my-first-foray-into-technology-c5b6e83fe8f1/
}
