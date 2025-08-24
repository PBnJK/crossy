/* Crossy
 * Main script
 */

/* For now, this just creates a div
 *
 * Maybe in the future I'll add different types of solid tiles, or maybe add
 * options to change color, dither, pattern, etc.
 */
function createSolidCellOptions() {
	let el = document.createElement("div");
	return el;
}

function createLetterCellOptions() {
	let el = document.createElement("div");
	el.innerHTML = `
<label id="ct-letter-type-label">
	<select id="ct-letter-type">
		<option value="normal">Normal</option>
		<option value="split-left">Split Left (/)</option>
		<option value="split-right">Split Right (\\)</option>
	</select>
</label>
<label id="ct-letter-solutions">
	<textarea></textarea>
</label>
`

	return el;
}

function createClueCellOptions() {
	let el = document.createElement("div");
	el.innerHTML = `
<fieldset>
	<legend>Arrows</legend>

	<label>Up <input type="checkbox" id="ct-clue-arrow-up"/></label>
	<label>Down <input type="checkbox" id="ct-clue-arrow-down"/></label>
	<label>Left <input type="checkbox" id="ct-clue-arrow-left"/></label>
	<label>Right <input type="checkbox" id="ct-clue-arrow-right"/></label>

	<label>Diagonal Up-Left <input type="checkbox" id="ct-clue-arrow-d-ul"/></label>
	<label>Diagonal Up-Right <input type="checkbox" id="ct-clue-arrow-d-ur"/></label>
	<label>Diagonal Down-Left <input type="checkbox" id="ct-clue-arrow-d-dl"/></label>
	<label>Diagonal Down-Right <input type="checkbox" id="ct-clue-arrow-d-dr"/></label>

	<label>Reverse Up <input type="checkbox" id="ct-clue-arrow-ru"/></label>
	<label>Reverse Down <input type="checkbox" id="ct-clue-arrow-rd"/></label>
	<label>Reverse Left <input type="checkbox" id="ct-clue-arrow-rl"/></label>
	<label>Reverse Right <input type="checkbox" id="ct-clue-arrow-rr"/></label>

	<label>Up-Left <input type="checkbox" id="ct-clue-arrow-ul"/></label>
	<label>Up-Right <input type="checkbox" id="ct-clue-arrow-ur"/></label>
	<label>Down-Left <input type="checkbox" id="ct-clue-arrow-dl"/></label>
	<label>Down-Right <input type="checkbox" id="ct-clue-arrow-dr"/></label>
	<label>Left-Up <input type="checkbox" id="ct-clue-arrow-lu"/></label>
	<label>Left-Down <input type="checkbox" id="ct-clue-arrow-ld"/></label>
	<label>Right-Up <input type="checkbox" id="ct-clue-arrow-ru"/></label>
	<label>Right-Down <input type="checkbox" id="ct-clue-arrow-rd"/></label>
</fieldset>
`

	return el;
}

let solidCellOptions = createSolidCellOptions();
let letterCellOptions = createLetterCellOptions();
let clueCellOptions = createClueCellOptions();

function configureLetterCellOptions(cell) { }

function configureClueCellOptions(cell) { }

function addSolidCellOptions(menu) {
	menu.appendChild(solidCellOptions);
}

function addLetterCellOptions(menu, cell) {
	configureLetterCellOptions(cell);
	menu.appendChild(letterCellOptions);
}

function addClueCellOptions(menu, cell) {
	configureClueCellOptions(cell);
	menu.appendChild(clueCellOptions);
}

function updateTileOptions(el) {
	const MENU = document.getElementById("control-tile-options");
	if (MENU.childElementCount > 1) {
		MENU.removeChild(MENU.lastChild);
	}

	let cell = crossword.getCellFromElement(el);

	switch (cell.type) {
		case CellType.Solid:
			addSolidCellOptions(MENU);
			break;
		case CellType.Letter:
			addLetterCellOptions(MENU, cell);
			break;
		case CellType.Clue:
			addClueCellOptions(MENU, cell);
			break;
	}
}

function enterEditingMode() {
	let previousFocus = null;

	document.querySelectorAll(".crossword-cell").forEach(el => {
		el.setAttribute("tabindex", "0");
		el.classList.add("focusable-cell");

		el.onmousedown = () => {
			if (previousFocus) {
				previousFocus.classList.remove("selected-cell");
			}

			updateTileOptions(el)

			el.classList.add("selected-cell");
			previousFocus = el;


			return false;
		};
	});
}

function init() {
	enterEditingMode();
}

init();
