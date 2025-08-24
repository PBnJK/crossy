/* Crossy
 * Crossword puzzle
 */

const DEFAULT_SIZE = 4;

class Crossword {
	constructor() {
		this.crossword = document.getElementById("crossword");
		if (this.crossword === null) {
			throw new Error("could not find crossword element");
		}

		this.width = DEFAULT_SIZE;
		this.height = DEFAULT_SIZE;

		this.cells = this.initializeGrid();
		this.redraw();
	}

	initializeGrid() {
		this.clearAllCells();

		let cells = [];
		for (let n = 0; n < this.width * this.height; n++) {
			let cell;
			if (n == 5) {
				cell = createClueCell(n);
			} else {
				cell = createLetterCell(n);
			}

			this.crossword.appendChild(cell.asElement());
			cells.push(cell);
		}

		return cells;
	}

	redraw() {
		this.clearAllCells();

		for (let i in this.cells) {
			let el = this.cells[i].asElement();
			this.crossword.appendChild(el);
		}
	}

	clearAllCells() {
		let cw = this.crossword;
		while (cw.firstChild) {
			cw.removeChild(cw.lastChild);
		}
	}

	getCellFromElement(el) {
		const ID = el.id;
		const MATCH = ID.match(/cell-(\d+)/);

		const IDX = Number(MATCH[1]);
		return this.cells[IDX];
	}
}

let crossword = new Crossword();
