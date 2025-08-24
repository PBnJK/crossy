/* Crossy
 * Cell in a crossword
 */

const CellType = {
  Solid: Symbol("SolidCell"),
  Letter: Symbol("LetterCell"),
  Clue: Symbol("ClueCell"),
};

const LetterCellType = {
  Normal: Symbol("LetterCellNormal"),
  SplitDiagLeft: Symbol("LetterCellSplitDiagLeft"),
  SplitDiagRight: Symbol("LetterCellSplitDiagRight"),
};

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

const ClueArrowStraightMap = {
  [ClueCellArrow.Up]: "clue-arrow-up",
  [ClueCellArrow.Down]: "clue-arrow-down",
  [ClueCellArrow.Left]: "clue-arrow-left",
  [ClueCellArrow.Right]: "clue-arrow-right",
};

const ClueArrowDiagonalMap = {
  [ClueCellArrow.DiagUpLeft]: "clue-arrow-diag-ul",
  [ClueCellArrow.DiagUpRight]: "clue-arrow-diag-ur",
  [ClueCellArrow.DiagDownLeft]: "clue-arrow-diag-dl",
  [ClueCellArrow.DiagDownRight]: "clue-arrow-diag-dr",
};

const ClueArrowReverseMap = {
  [ClueCellArrow.UpReverse]: "clue-arrow-up",
  [ClueCellArrow.DownReverse]: "clue-arrow-down",
  [ClueCellArrow.LeftReverse]: "clue-arrow-left",
  [ClueCellArrow.RightReverse]: "clue-arrow-right",
};

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

class Cell {
  constructor(type, n) {
    this.type = type;
    this.n = n;

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

  createDefaultLetterData() {
    return this.createLetterData(LetterCellType.Normal, "");
  }

  createLetterData(type, text) {
    return {
      type: type,
      text: text,
    };
  }

  createDefaultClueData() {
    return this.createClueData(["uma grande dica"], 3, []);
  }

  createClueData(text, arrows, dynamic) {
    return {
      text: text,
      arrows: arrows,
      dynamic: dynamic,
    };
  }

  addDynamicClueArrow(clue, type) {
    this.data.dynamic.push({ clue: clue, type: type });
    this.updateElement();
  }

  addClueText(text) {
    this.data.text.add(text);
    this.updateElement();
  }

  updateElement() {
    switch (this.type) {
      case CellType.Solid:
        this.element = this.createSolidElement();
        break;
      case CellType.Letter:
        this.element = this.createLetterElement();
        break;
      case CellType.Clue:
        this.element = this.createClueElement();
        break;
      default:
        throw new Error(`Invalid cell type "${this.type.toString()}"`);
    }
  }

  createSolidElement() {
    let el = this.createBaseElement();
    el.classList.add("solid-cell");

    return el;
  }

  createLetterElement() {
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

    return el;
  }

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

  createSplitLineLeft() {
    let el = document.createElement("div");
    el.classList.add("letter-cell-split");
    el.classList.add("letter-cell-split-dl");

    return el;
  }

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

  createSplitLineRight() {
    let el = document.createElement("div");
    el.classList.add("letter-cell-split");
    el.classList.add("letter-cell-split-dr");

    return el;
  }

  createLetterTextInput() {
    let el = document.createElement("input");
    el.classList.add("letter-cell-input");

    el.type = "text";
    el.maxlength = 1;

    return el;
  }

  createClueElement() {
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

    return el;
  }

  createClueStraightArrows(el) {
    for (const KEY in ClueArrowStraightMap) {
      if (this.data.arrows & KEY) {
        this.createStraightArrow(el, ClueArrowStraightMap[KEY]);
      }
    }
  }

  createStraightArrow(el, arrowClass) {
    this.createClueArrow(el, "assets/svg_arrow_straight.svg", arrowClass);
  }

  createClueDiagonalArrows(el) {
    for (const KEY in ClueArrowDiagonalMap) {
      if (this.data.arrows & KEY) {
        this.createDiagonalArrow(el, ClueArrowDiagonalMap[KEY]);
      }
    }
  }

  createDiagonalArrow(el, arrowClass) {
    this.createClueArrow(el, "assets/svg_arrow_diagonal.svg", arrowClass);
  }

  createClueReverseArrows(el) {
    for (const KEY in ClueArrowReverseMap) {
      if (this.data.arrows & KEY) {
        this.createReverseArrow(el, ClueArrowReverseMap[KEY]);
      }
    }
  }

  createReverseArrow(el, arrowClass) {
    this.createClueArrow(el, "assets/svg_arrow_reverse.svg", arrowClass);
  }

  createClueTurnArrows(el) {
    for (const KEY in ClueArrowTurnMap) {
      if (this.data.arrows & KEY) {
        this.createTurnArrow(el, ClueArrowTurnMap[KEY]);
      }
    }
  }

  createTurnArrow(el, arrowClass) {
    this.createClueArrow(el, "assets/svg_arrow_turn.svg", arrowClass);
  }

  createClueArrow(el, path, arrowClass) {
    let arrow = this.newClueArrow(path);
    arrow.classList.add(arrowClass);

    el.appendChild(arrow);
  }

  newClueArrow(path) {
    let arrow = document.createElement("img");
    arrow.classList.add("clue-arrow");
    arrow.src = path;

    return arrow;
  }

  createClueTextElement(text) {
    let el = document.createElement("div");
    el.classList.add("clue-cell-text");

    let clue = document.createElement("span");
    clue.textContent = text;

    el.appendChild(clue);

    return el;
  }

  createBaseElement() {
    let el = document.createElement("div");

    el.classList.add("crossword-cell");
    el.id = `cell-${this.n}`;

    return el;
  }

  asElement() {
    return this.element;
  }
}

function createSolidCell(n) {
  return new Cell(CellType.Solid, n);
}

function createLetterCell(n) {
  return new Cell(CellType.Letter, n);
}

function createClueCell(n) {
  return new Cell(CellType.Clue, n);
}
