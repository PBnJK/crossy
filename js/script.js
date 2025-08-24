/* Crossy
 * Main script
 */

const ArrowCheckboxMap = {
  "ct-clue-arrow-up": ClueCellArrow.Up,
  "ct-clue-arrow-down": ClueCellArrow.Down,
  "ct-clue-arrow-left": ClueCellArrow.Left,
  "ct-clue-arrow-right": ClueCellArrow.Right,

  "ct-clue-arrow-d-ul": ClueCellArrow.DiagUpLeft,
  "ct-clue-arrow-d-ur": ClueCellArrow.DiagUpRight,
  "ct-clue-arrow-d-dl": ClueCellArrow.DiagDownLeft,
  "ct-clue-arrow-d-dr": ClueCellArrow.DiagDownRight,

  "ct-clue-arrow-rev-u": ClueCellArrow.UpReverse,
  "ct-clue-arrow-rev-d": ClueCellArrow.DownReverse,
  "ct-clue-arrow-rev-l": ClueCellArrow.LeftReverse,
  "ct-clue-arrow-rev-r": ClueCellArrow.RightReverse,

  "ct-clue-arrow-ul": ClueCellArrow.UpLeft,
  "ct-clue-arrow-ur": ClueCellArrow.UpRight,
  "ct-clue-arrow-dl": ClueCellArrow.DownLeft,
  "ct-clue-arrow-dr": ClueCellArrow.DownRight,
  "ct-clue-arrow-lu": ClueCellArrow.LeftUp,
  "ct-clue-arrow-ru": ClueCellArrow.RightUp,
  "ct-clue-arrow-ld": ClueCellArrow.LeftDown,
  "ct-clue-arrow-rd": ClueCellArrow.RightDown,
};

/* Creates the options for a solid cell
 *
 * For now, this just creates a div
 *
 * Maybe in the future I'll add different types of solid tiles, or maybe add
 * options to change color, dither, pattern, etc.
 */
function createSolidCellOptions() {
  let el = document.createElement("div");
  return el;
}

/* Creates the options for a letter cell */
function createLetterCellOptions() {
  let el = document.createElement("div");
  el.innerHTML = `
<label id="ct-letter-type-label">
  Letter Type
	<select id="ct-letter-type">
		<option value="normal">Normal</option>
		<option value="split-left">Split Left (/)</option>
		<option value="split-right">Split Right (\\)</option>
	</select>
</label>
<label id="ct-letter-solutions">
  Solution
	<input type="text" placeholder="Correct letter(s)"/>
</label>
`;

  return el;
}

/* Creates the options for a clue cell */
function createClueCellOptions() {
  let el = document.createElement("div");
  el.innerHTML = `
<fieldset>
	<legend>Arrows</legend>

	<label>Up <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-up"/></label>
	<label>Down <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-down"/></label>
	<label>Left <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-left"/></label>
	<label>Right <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-right"/></label>

	<label>Diagonal Up-Left <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-d-ul"/></label>
	<label>Diagonal Up-Right <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-d-ur"/></label>
	<label>Diagonal Down-Left <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-d-dl"/></label>
	<label>Diagonal Down-Right <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-d-dr"/></label>

	<label>Reverse Up <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-rev-u"/></label>
	<label>Reverse Down <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-rev-d"/></label>
	<label>Reverse Left <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-rev-l"/></label>
	<label>Reverse Right <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-rev-r"/></label>

	<label>Up-Left <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-ul"/></label>
	<label>Up-Right <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-ur"/></label>
	<label>Down-Left <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-dl"/></label>
	<label>Down-Right <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-dr"/></label>
	<label>Left-Up <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-lu"/></label>
	<label>Left-Down <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-ld"/></label>
	<label>Right-Up <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-ru"/></label>
	<label>Right-Down <input class="ct-clue-arrow-checkbox" type="checkbox" id="ct-clue-arrow-rd"/></label>
</fieldset>
<label id="ct-clue-text-label">
  Solution
	<textarea id="ct-clue-text" placeholder="Clue goes here" ></textarea>
</label>
`;

  return el;
}

let solidCellOptions = createSolidCellOptions();
let letterCellOptions = createLetterCellOptions();
let clueCellOptions = createClueCellOptions();

function configureLetterCellOptions(_cell) {}

function configureClueCellOptions(cell) {
  let text = document.getElementById("ct-clue-text");
  let data = cell.getData();

  text.value = data.text.join("\n");
  text.oninput = () => {
    cell.setClueText(text.value);
  };

  document.querySelectorAll(".ct-clue-arrow-checkbox").forEach((el) => {
    el.onclick = () => {
      const arrow = ArrowCheckboxMap[el.id];
      if (el.checked) {
        cell.addClueArrow(arrow);
      } else {
        cell.removeClueArrow(arrow);
      }
    };
  });
}

function addSolidCellOptions(menu) {
  menu.appendChild(solidCellOptions);
}

function addLetterCellOptions(menu, cell) {
  menu.appendChild(letterCellOptions);
  configureLetterCellOptions(cell);
}

function addClueCellOptions(menu, cell) {
  menu.appendChild(clueCellOptions);
  configureClueCellOptions(cell);
}

function updateTileOptions(el) {
  const MENU = document.getElementById("control-tile-options");
  if (MENU.childElementCount > 1) {
    MENU.removeChild(MENU.lastChild);
  }

  let cell = crossword.getCellFromElement(el);
  let type = document.getElementById("ct-type");

  switch (cell.type) {
    case CellType.Solid:
      type.value = "solid-cell";
      addSolidCellOptions(MENU);
      break;
    case CellType.Letter:
      type.value = "letter-cell";
      addLetterCellOptions(MENU, cell);
      break;
    case CellType.Clue:
      type.value = "clue-cell";
      addClueCellOptions(MENU, cell);
      break;
  }
}

function enterEditingMode() {
  let previousFocus = null;

  const cells = document.querySelectorAll(".crossword-cell");
  cells.forEach((el) => {
    el.setAttribute("tabindex", "0");
    el.classList.add("focusable-cell");

    el.onmousedown = () => {
      if (previousFocus) {
        previousFocus.classList.remove("selected-cell");
      }

      updateTileOptions(el);

      el.classList.add("selected-cell");
      previousFocus = el;

      return false;
    };
  });

  const firstElement = cells[0];
  firstElement.onmousedown();
}

function enterSolvingMode() {
  document.querySelectorAll(".crossword-cell").forEach((el) => {
    el.setAttribute("tabindex", "1");
    el.classList.remove("focusable-cell");

    el.onmousedown = () => {};
  });
}

function init() {
  enterEditingMode();
  // enterSolvingMode();
}

init();
