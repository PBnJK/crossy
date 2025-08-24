/* Crossy
 * Crossword puzzle
 */

const DEFAULT_SIZE = 4;

/* Crossword
 * Contains and manages a group of cells
 */
class Crossword {
  constructor() {
    this.crossword = document.getElementById("crossword");
    if (this.crossword === null) {
      throw new Error("Could not find crossword element!");
    }

    this.width = DEFAULT_SIZE;
    this.height = DEFAULT_SIZE;

    this.cells = this.initializeGrid();
    this.redraw();
  }

  /* Initializes the cell grid */
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

  /* Redraws the entire crossword */
  redraw() {
    this.clearAllCells();

    for (let i in this.cells) {
      let el = this.cells[i].asElement();
      this.crossword.appendChild(el);
    }
  }

  /* Removes all cells */
  clearAllCells() {
    let cw = this.crossword;
    while (cw.firstChild) {
      cw.removeChild(cw.lastChild);
    }
  }

  /* Gets the cell that matches the element id */
  getCellFromElement(el) {
    const ID = el.id;
    const MATCH = ID.match(/cell-(\d+)/);

    const IDX = Number(MATCH[1]);
    return this.cells[IDX];
  }
}

let crossword = new Crossword();
