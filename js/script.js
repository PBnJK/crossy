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

  <div id="ct-clue-arrow-grid">
    <label><img class="ct-clue-img ct-clue-img-up" src="assets/svg_arrow_straight.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-up"/></label>
    <label><img class="ct-clue-img ct-clue-img-down" src="assets/svg_arrow_straight.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-down"/></label>
    <label><img class="ct-clue-img ct-clue-img-left" src="assets/svg_arrow_straight.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-left"/></label>
    <label><img class="ct-clue-img ct-clue-img-right" src="assets/svg_arrow_straight.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-right"/></label>

    <label><img class="ct-clue-img ct-clue-img-d" src="assets/svg_arrow_diagonal.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-d-ul"/></label>
    <label><img class="ct-clue-img ct-clue-img-d ct-clue-img-up" src="assets/svg_arrow_diagonal.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-d-ur"/></label>
    <label><img class="ct-clue-img ct-clue-img-d ct-clue-img-down" src="assets/svg_arrow_diagonal.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-d-dl"/></label>
    <label><img class="ct-clue-img ct-clue-img-d ct-clue-img-right" src="assets/svg_arrow_diagonal.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-d-dr"/></label>

    <label><img class="ct-clue-img ct-clue-img-up" src="assets/svg_arrow_reverse.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-rev-u"/></label>
    <label><img class="ct-clue-img ct-clue-img-down" src="assets/svg_arrow_reverse.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-rev-d"/></label>
    <label><img class="ct-clue-img ct-clue-img-left" src="assets/svg_arrow_reverse.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-rev-l"/></label>
    <label><img class="ct-clue-img ct-clue-img-right" src="assets/svg_arrow_reverse.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-rev-r"/></label>

    <label><img class="ct-clue-img ct-clue-img-flip-up" src="assets/svg_arrow_turn.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-ul"/></label>
    <label><img class="ct-clue-img ct-clue-img-up" src="assets/svg_arrow_turn.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-ur"/></label>
    <label><img class="ct-clue-img ct-clue-img-down" src="assets/svg_arrow_turn.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-dl"/></label>
    <label><img class="ct-clue-img ct-clue-img-flip-down" src="assets/svg_arrow_turn.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-dr"/></label>

    <label><img class="ct-clue-img" src="assets/svg_arrow_turn.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-lu"/></label>
    <label><img class="ct-clue-img ct-clue-img-flip-left" src="assets/svg_arrow_turn.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-ld"/></label>
    <label><img class="ct-clue-img ct-clue-img-flip-right" src="assets/svg_arrow_turn.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-ru"/></label>
    <label><img class="ct-clue-img ct-clue-img-right" src="assets/svg_arrow_turn.svg" /><input type="checkbox" class="ct-clue-arrow-checkbox" id="ct-clue-arrow-rd"/></label>
  </div>
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

function init() {
  crossword.enterEditingMode();
  // enterSolvingMode();
}

init();
