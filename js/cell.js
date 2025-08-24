/* Crossy
 * A cell in a crossword
 */

/* Enum of cell types */
const CellType = {
  Solid: Symbol("SolidCell"),
  Letter: Symbol("LetterCell"),
  Clue: Symbol("ClueCell"),
};

/* Enum of letter cell types */
const LetterCellType = {
  Normal: Symbol("LetterCellNormal"),
  SplitDiagLeft: Symbol("LetterCellSplitDiagLeft"),
  SplitDiagRight: Symbol("LetterCellSplitDiagRight"),
};

/* Bitfield of clue cell arrows */
const ClueCellArrow = {
  Up: 0x1,
  Down: 0x2,
  Left: 0x4,
  Right: 0x8,

  StraightMask: 0xf,

  DiagUpLeft: 0x10,
  DiagUpRight: 0x20,
  DiagDownLeft: 0x40,
  DiagDownRight: 0x80,

  DiagonalMask: 0xf0,

  UpReverse: 0x100,
  DownReverse: 0x200,
  LeftReverse: 0x400,
  RightReverse: 0x800,

  ReverseMask: 0xf00,

  UpLeft: 0x1000,
  UpRight: 0x2000,
  DownLeft: 0x4000,
  DownRight: 0x8000,
  LeftUp: 0x10000,
  LeftDown: 0x20000,
  RightUp: 0x40000,
  RightDown: 0x80000,

  TurnMask: 0xff000,
};

/* Maps a "straight" arrow to a cell id */
const ClueArrowStraightMap = {
  [ClueCellArrow.Up]: "clue-arrow-up",
  [ClueCellArrow.Down]: "clue-arrow-down",
  [ClueCellArrow.Left]: "clue-arrow-left",
  [ClueCellArrow.Right]: "clue-arrow-right",
};

/* Maps a diagonal arrow to a cell id */
const ClueArrowDiagonalMap = {
  [ClueCellArrow.DiagUpLeft]: "clue-arrow-diag-ul",
  [ClueCellArrow.DiagUpRight]: "clue-arrow-diag-ur",
  [ClueCellArrow.DiagDownLeft]: "clue-arrow-diag-dl",
  [ClueCellArrow.DiagDownRight]: "clue-arrow-diag-dr",
};

/* Maps a reverse arrow to a cell id */
const ClueArrowReverseMap = {
  [ClueCellArrow.UpReverse]: "clue-arrow-up",
  [ClueCellArrow.DownReverse]: "clue-arrow-down",
  [ClueCellArrow.LeftReverse]: "clue-arrow-left",
  [ClueCellArrow.RightReverse]: "clue-arrow-right",
};

/* Maps a "turn" arrow to a cell id */
const ClueArrowTurnMap = {
  [ClueCellArrow.UpLeft]: "clue-arrow-ul",
  [ClueCellArrow.UpRight]: "clue-arrow-up",
  [ClueCellArrow.DownLeft]: "clue-arrow-down",
  [ClueCellArrow.DownRight]: "clue-arrow-dr",
  [ClueCellArrow.LeftUp]: "clue-arrow-left",
  [ClueCellArrow.LeftDown]: "clue-arrow-ld",
  [ClueCellArrow.RightUp]: "clue-arrow-ru",
  [ClueCellArrow.RightDown]: "clue-arrow-right",
};

/* Cell
 * A Cell in a Crossword
 */
class Cell {
  #isEditingMode = false;

  constructor(type, n) {
    this.type = type;
    this.n = n;
    this.element = document.createElement("div");

    switch (type) {
      case CellType.Solid:
        this.data = null;
        break;
      case CellType.Letter:
        this.data = this.createDefaultLetterData();
        break;
      case CellType.Clue:
        this.data = this.createDefaultClueData();
        break;
    }

    this.updateElement();
  }

  focus() {
    const el = this.asElement();
    el.classList.add("selected-cell");
  }

  unfocus() {
    const el = this.asElement();
    el.classList.remove("selected-cell");
  }

  enterEditingMode() {
    const el = this.asElement();
    el.setAttribute("tabindex", "0");
    el.classList.add("focusable-cell");

    this.#isEditingMode = true;
  }

  enterSolvingMode() {
    const el = this.asElement();
    el.setAttribute("tabindex", "1");
    el.classList.remove("focusable-cell");

    this.#isEditingMode = false;
  }

  /* Creates the default data for a letter cell */
  createDefaultLetterData() {
    return this.createLetterData(LetterCellType.Normal, "");
  }

  /* Creates the data object for a letter cell */
  createLetterData(type, text) {
    return {
      type: type,
      text: text,
    };
  }

  /* Creates the default data for a clue cell */
  createDefaultClueData() {
    return this.createClueData(["hint text here"], ClueCellArrow.Up, []);
  }

  /* Creates the data object for a clue cell */
  createClueData(text, arrows, dynamic) {
    return {
      text: text,
      arrows: arrows,
      dynamic: dynamic,
    };
  }

  /* Adds a new dynamic arrow */
  addDynamicClueArrow(clue, type) {
    this.data.dynamic.push({ clue: clue, type: type });
    this.updateElement();
  }

  /* Sets the text content of a clue
   * Each line in the text is treated as a separate clue and will be split visually
   */
  setClueText(text) {
    this.data.text = [];
    text.split(/\r?\n/).forEach((line) => {
      this.data.text.push(line);
    });

    this.updateElement();
  }

  /* Appends text to the text array */
  addClueText(text) {
    this.data.text.push(text);
    this.updateElement();
  }

  /* Adds an arrow type */
  addClueArrow(arrow) {
    const old = this.data.arrows;
    this.data.arrows |= arrow;

    if (old !== this.data.arrows) {
      this.updateElement();
    }
  }

  /* Removes an arrow type */
  removeClueArrow(arrow) {
    const old = this.data.arrows;
    this.data.arrows &= ~arrow;

    if (old !== this.data.arrows) {
      this.updateElement();
    }
  }

  /* Updates the HTML element that represents this cell */
  updateElement() {
    const onmousedown =
      this.element.querySelector(".crossword-cell")?.onmousedown;

    while (this.element.firstChild) {
      this.element.removeChild(this.element.lastChild);
    }

    switch (this.type) {
      case CellType.Solid:
        this.createSolidElement(onmousedown);
        break;
      case CellType.Letter:
        this.createLetterElement(onmousedown);
        break;
      case CellType.Clue:
        this.createClueElement(onmousedown);
        break;
      default:
        throw new Error(`Invalid cell type "${this.type.toString()}"`);
    }

    if (this.#isEditingMode) {
      this.enterEditingMode();
    } else {
      this.enterSolvingMode();
    }
  }

  /* Creates a new element representing a solid cell */
  createSolidElement(onmousedown) {
    let el = this.createBaseElement();
    el.classList.add("solid-cell");
    el.onmousedown = onmousedown;

    this.element.appendChild(el);
  }

  /* Creates a new element representing a letter cell */
  createLetterElement(onmousedown) {
    let el = this.createBaseElement();
    el.classList.add("letter-cell");

    switch (this.data.type) {
      case LetterCellType.Normal:
        el.appendChild(this.createLetterTextInput());
        break;
      case LetterCellType.SplitDiagLeft:
        this.createSplitLeft(el);
        break;
      case LetterCellType.SplitDiagRight:
        this.createSplitRight(el);
        break;
    }

    el.onmousedown = onmousedown;
    this.element.appendChild(el);
  }

  /* Creates a left split in a letter cell */
  createSplitLeft(el) {
    let line = this.createSplitLineLeft();
    line.id = `${el.id}-split`;

    let t1 = this.createLetterTextInput();
    t1.classList.add("letter-cell-input-bl");
    t1.id = `${el.id}-0`;

    let t2 = this.createLetterTextInput();
    t2.classList.add("letter-cell-input-tr");
    t2.id = `${el.id}-1`;

    el.appendChild(line);
    el.appendChild(t1);
    el.appendChild(t2);
  }

  /* Creates a left line split in a letter cell */
  createSplitLineLeft() {
    let el = document.createElement("div");
    el.classList.add("letter-cell-split");
    el.classList.add("letter-cell-split-dl");

    return el;
  }

  /* Creates a right split in a letter cell */
  createSplitRight(el) {
    let line = this.createSplitLineRight();
    line.id = `${el.id}-split`;

    let t1 = this.createLetterTextInput();
    t1.classList.add("letter-cell-input-tl");
    t1.id = `${el.id}-0`;

    let t2 = this.createLetterTextInput();
    t2.classList.add("letter-cell-input-br");
    t2.id = `${el.id}-1`;

    el.appendChild(line);
    el.appendChild(t1);
    el.appendChild(t2);
  }

  /* Creates a right line split in a letter cell */
  createSplitLineRight() {
    let el = document.createElement("div");
    el.classList.add("letter-cell-split");
    el.classList.add("letter-cell-split-dr");

    return el;
  }

  /* Creates the input field for a letter */
  createLetterTextInput() {
    let el = document.createElement("input");
    el.classList.add("letter-cell-input");

    el.type = "text";
    el.maxlength = 1;

    return el;
  }

  /* Creates a new element representing a clue cell */
  createClueElement(onmousedown) {
    let el = this.createBaseElement();
    el.classList.add("clue-cell");

    if (this.data.arrows & ClueCellArrow.StraightMask) {
      this.createClueStraightArrows(el);
    }

    if (this.data.arrows & ClueCellArrow.DiagonalMask) {
      this.createClueDiagonalArrows(el);
    }

    if (this.data.arrows & ClueCellArrow.ReverseMask) {
      this.createClueReverseArrows(el);
    }

    if (this.data.arrows & ClueCellArrow.TurnMask) {
      this.createClueTurnArrows(el);
    }

    for (const DICT of this.data.dynamic.values()) {
      let clue = DICT.clue;
      let parent = clue.parentNode;

      const DIFF = clue.offsetTop - parent.offsetTop - 48;
      const MIDDLE = clue.offsetHeight / 2;

      const OFFSET = DIFF + MIDDLE;

      let arrow = null;
      switch (DICT.type) {
        case ClueCellArrow.Left:
          arrow = this.newClueArrow("assets/svg_arrow_straight.svg");
          arrow.style.transform = `translate(var(--ncw-size), ${OFFSET}px)`;
          break;
        case ClueCellArrow.LeftReverse:
          arrow = this.newClueArrow("assets/svg_arrow_reverse.svg");
          arrow.style.transform = `translate(var(--ncw-size), ${OFFSET}px)`;
          break;
        case ClueCellArrow.LeftUp:
          arrow = this.newClueArrow("assets/svg_arrow_turn.svg");
          arrow.style.transform = `translate(var(--ncw-size), ${OFFSET}px)`;
          break;
        case ClueCellArrow.LeftDown:
          arrow = this.newClueArrow("assets/svg_arrow_turn.svg");
          arrow.style.transform = `scaleY(-1) translate(var(--ncw-size), ${-OFFSET}px)`;
          break;
        case ClueCellArrow.Right:
          arrow = this.newClueArrow("assets/svg_arrow_straight.svg");
          arrow.style.transform = `rotate(180deg) translate(var(--ncw-size), ${-OFFSET}px)`;
          break;
        case ClueCellArrow.RightReverse:
          arrow = this.newClueArrow("assets/svg_arrow_reverse.svg");
          arrow.style.transform = `rotate(180deg) translate(var(--ncw-size), ${-OFFSET}px)`;
          break;
        case ClueCellArrow.RightUp:
          arrow = this.newClueArrow("assets/svg_arrow_turn.svg");
          arrow.style.transform = `rotate(180deg) translate(var(--ncw-size), ${-OFFSET}px)`;
          break;
        case ClueCellArrow.RightDown:
          arrow = this.newClueArrow("assets/svg_arrow_turn.svg");
          arrow.style.transform = `scaleY(-1) rotate(180deg)  translate(var(--ncw-size), ${OFFSET}px)`;
          break;
      }

      el.appendChild(arrow);
    }

    let t = this.data.text;

    el.style.setProperty("font-size", `${13 - t.length}pt`);
    for (let i = 0; i < t.length; i++) {
      let clue = this.createClueTextElement(t[i]);
      clue.id = `${el.id}-${i}`;

      el.appendChild(clue);
    }

    el.onmousedown = onmousedown;
    this.element.appendChild(el);
  }

  /* Adds all "straight" arrows (if any) to the cell */
  createClueStraightArrows(el) {
    for (const KEY in ClueArrowStraightMap) {
      if (this.data.arrows & KEY) {
        this.createStraightArrow(el, ClueArrowStraightMap[KEY]);
      }
    }
  }

  /* Creates a "straight" arrow */
  createStraightArrow(el, arrowClass) {
    this.createClueArrow(el, "assets/svg_arrow_straight.svg", arrowClass);
  }

  /* Adds all diagonal arrows (if any) to the cell */
  createClueDiagonalArrows(el) {
    for (const KEY in ClueArrowDiagonalMap) {
      if (this.data.arrows & KEY) {
        this.createDiagonalArrow(el, ClueArrowDiagonalMap[KEY]);
      }
    }
  }

  /* Creates a diagonal arrow */
  createDiagonalArrow(el, arrowClass) {
    this.createClueArrow(el, "assets/svg_arrow_diagonal.svg", arrowClass);
  }

  /* Adds all reverse arrows (if any) to the cell */
  createClueReverseArrows(el) {
    for (const KEY in ClueArrowReverseMap) {
      if (this.data.arrows & KEY) {
        this.createReverseArrow(el, ClueArrowReverseMap[KEY]);
      }
    }
  }

  /* Creates a reverse arrow */
  createReverseArrow(el, arrowClass) {
    this.createClueArrow(el, "assets/svg_arrow_reverse.svg", arrowClass);
  }

  /* Adds all "turn" arrows (if any) to the cell */
  createClueTurnArrows(el) {
    for (const KEY in ClueArrowTurnMap) {
      if (this.data.arrows & KEY) {
        this.createTurnArrow(el, ClueArrowTurnMap[KEY]);
      }
    }
  }

  /* Creates a turn arrow */
  createTurnArrow(el, arrowClass) {
    this.createClueArrow(el, "assets/svg_arrow_turn.svg", arrowClass);
  }

  /* Creates a clue arrow */
  createClueArrow(el, path, arrowClass) {
    let arrow = this.newClueArrow(path);
    arrow.classList.add(arrowClass);

    el.appendChild(arrow);
  }

  /* Creates a new clue arrow element */
  newClueArrow(path) {
    let arrow = document.createElement("img");
    arrow.classList.add("clue-arrow");
    arrow.src = path;

    return arrow;
  }

  /* Creates the element containing the clue text */
  createClueTextElement(text) {
    let el = document.createElement("div");
    el.classList.add("clue-cell-text");

    let clue = document.createElement("span");
    clue.textContent = text;

    el.appendChild(clue);

    return el;
  }

  /* Creates the base cell element */
  createBaseElement() {
    let el = document.createElement("div");

    el.classList.add("crossword-cell");
    el.id = `cell-${this.n}`;

    return el;
  }

  /* Returns the cell HTML element */
  asElement() {
    return this.element;
  }

  /* Returns the cell data */
  getData() {
    return this.data;
  }
}

/* Creates a new solid cell */
function createSolidCell(n) {
  return new Cell(CellType.Solid, n);
}

/* Creates a new cell containing a letter */
function createLetterCell(n) {
  return new Cell(CellType.Letter, n);
}

/* Creates a new cell containing a clue */
function createClueCell(n) {
  return new Cell(CellType.Clue, n);
}
