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

// function to find candidates that can match our `inputWord`.
// we want to find out how we can spell with `inputWord` with lesser number of symbols
function findCandidates(inputWord) {
	var oneLetterSymbols = [];
	var twoLetterSymbols = [];
	// debugger;

	for (let i= 0; i<inputWord.length; i++){
		// collect all one-letter candidates
		// checking if the inputWord[i] is present as a property in the symbols object
		// we can also use `symbols.hasOwnProperty(inputWord[i])` instead of `inputWord[i] in symbols`
		// The main difference between hasOwnProperty() method and `in` operator is that the latter
		// checks within own and inherited properties of the object.
		// Also checking if our oneLetterSymbols array already has the word or not; if it does we don't want to look up again
		if (inputWord[i] in symbols && !oneLetterSymbols.includes(inputWord[i])) {
			// instead of using the two conditions above, we can use the Set data structure
			// that'd ensure we don't have to check the array for uniqueness
			// however the problem with using sets is that we need the order here; whereas Sets aren't ordered
			// using `includes` method of the array is not as efficient as the `has` method of the Set
			// but, we make the trade-off for the ordering as we can only have a max of a handful of dozen of candidates
			oneLetterSymbols.push(inputWord[i]);
		}

		//for two letter candidates we need to ensure we have to stop at the second last letter of the word
		if( i<= (inputWord.length - 2)) {
			let two = inputWord.slice(i, i+2); // slice inputWord with length 2; non-exclusive of the end

			//similarly we do the same for two-letter candidates
			if (two in symbols && !twoLetterSymbols.includes(two)) {
				twoLetterSymbols.push(two);
			}

		}
	}
	// we want the algorithm to prefer two letter symbols to one letter symbols
	return [ ...twoLetterSymbols, ...oneLetterSymbols ];
}


function spellWord(candidates, charsLeft){
	// debugger;
	// since spellWord will be a recursive function, we need to define a base condition
	// if there is no characters left, there is nothing to do for that particular iteration so we can return an empty array
	if(charsLeft.length == 0){
		return [];
	} else {
		// check for two-letter symbols first; and this can only be done if we only have at-least two characters left
		if(charsLeft.length >= 2) {
			let firstTwoChars = charsLeft.slice(0,2);
			let remainingChars = charsLeft.slice(2);

			// found a match?
			if(candidates.includes(firstTwoChars)){
				// do we have more work? - are there remaining characters?
				if(remainingChars.length > 0){
					let result = spellWord(candidates, remainingChars);

					// if the result responds with what we were trying to match; we can return the result
					// joining an empty string
					if(result.join('') === remainingChars) {
						return [ firstTwoChars, ...result ];
					}
				} else {
					// if there are no remaining characters left, return the `firstTwoChars` (or in this case - the last two characters)
					return [ firstTwoChars ];
				}
			}
		}

		// check for one-letter symbols next; and this can only be done if we only have at-least one character left
		if(charsLeft.length >= 1) {
			let firstChar = charsLeft[0];
			let remainingChars = charsLeft.slice(1);

			// found a match?
			if(candidates.includes(firstChar)){
				// do we have more work? - are there remaining characters?
				if(remainingChars.length > 0){
					let result = spellWord(candidates, remainingChars);

					// if the result responds with what we were trying to match; we can return the result
					// joining an empty string
					if(result.join('') === remainingChars) {
						return [ firstChar, ...result ];
					}
				} else {
					// if there are no remaining characters left, return the `firstTwoChars` (or in this case - the last two characters)
					return [ firstChar ];
				}
			}
		}
	}

	// should return an empty array if nothing is found
	return [];
}

function check(inputWord) {
	// debugger;
	var candidates = findCandidates(inputWord);

	// recursive function
	// passing candidates as we don't want to be referencing it as an outer variable always
	// passing it along will be much easier as we are not mutating the candidates array anyhow
	return spellWord(candidates, inputWord);
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
