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

// function to return input array in chunks of two
function returnChunksArray(str, chunkSize) {
	var arr = [];
	while(str !== '') {
		// substring mdn -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
		arr.push(str.substring(0, chunkSize));
		str = str.substring(chunkSize);
	}
	return arr;
};

function check(inputWord) {
	// TODO: determine if `inputWord` can be spelled
	// with periodic table symbols; return array with
	// them if so (empty array otherwise)
	const chunkSize = 2;
	const chunksArray = returnChunksArray (inputWord, chunkSize);
	console.log(chunksArray);

	let matchingElements = [];
	// loop through periodic table and check if el exists?

	chunksArray.forEach((chunk) => {
		elements.forEach((element) => {
			// check for matches and push to array
			if (element.symbol.toLowerCase() === chunk) {
				matchingElements.push(element.symbol);
			}
		})
	});
	console.log(`matching elements: ${matchingElements}`);
	return (matchingElements.length === chunksArray.length) ? matchingElements : [];
}


function lookup(elementSymbol) {
	// TODO: return the element entry based on specified
	// symbol (case-insensitive)
	let matchingPeriodicTableElement;
	elements.forEach((element) => {
		if (element.symbol === elementSymbol) {
			console.log(`element symbol: ${element.symbol}, ${elementSymbol}`);
			matchingPeriodicTableElement = element;
		}
	});
	return matchingPeriodicTableElement;
}
