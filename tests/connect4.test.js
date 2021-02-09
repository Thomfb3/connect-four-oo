//Update to reflect main game variables
let p1 = new Player("red");
let p2 = new Player("blue");
const game = new Game(p1, p2, 7, 6);


describe("#makeBoard - Game method", function () {
    //update this const to reflect the main game variables
    let completeBoard_7x6 = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null]
    ];///This array works for width = 7 and height = 6;

    it("should return board - an array of arrays containing nulls based on height and width variables", function () {
        expect(game.board).toEqual(completeBoard_7x6);
    });
});


describe("#makeHtmlBoard - Game method", function () {
    const tds = document.querySelectorAll("td");
    const tdArray = [...tds];
    const topRow = document.querySelector("tr");
    const topId = topRow.getAttribute("id");
    const lastCellId = `${game.height - 1}-${game.width - 1}`;

    it("should find the top column id", function () {
        expect(topId).toEqual("column-top");
    });

    it("should return the right number of board cells", function () {
        expect(tdArray.length).toEqual((game.height + 1) * game.width);
    });

    it("should return the right id for the first cell", function () {
        expect(tdArray[0].getAttribute("id")).toEqual("0");
    });

    it("should return the right id for the last", function () {
        expect(tdArray[tdArray.length - 1].getAttribute("id")).toEqual(lastCellId);
    });
});


describe("#placeInTable - Game method", function () {
    const x = 6;
    const y = 5;
    const cell = document.getElementById(`${y}-${x}`);
    game.placeInTable(y, x);

    it("should detect childNode in appropriate cell", function () {
        expect(cell.childNodes.length).toEqual(1);
    });
});



describe("#findSpotForCol - Game Method", function () {
    let testBoard_allNulls = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null]
    ];
    let testBoard_someNums = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, 1, null, 2],
        [2, null, 1, null, 2, 1, 1]
    ];
    //// Test version of findSpotForCol
    function test_findSpotForCol(x, array) {
        for (let y = game.height - 1; y >= 0; y--) {
          if (!array[y][x]) {
            return y;
          }
        }
        return null;
      }

    
    it("should detect childNode in appropriate cell", function () {
        expect(test_findSpotForCol(1, testBoard_allNulls)).toEqual(5);
    });
    it("should detect childNode in appropriate cell", function () {
        expect(test_findSpotForCol(3, testBoard_allNulls)).toEqual(5);
    });
    it("should detect childNode in appropriate cell", function () {
        expect(test_findSpotForCol(6, testBoard_someNums)).toEqual(3);
    });
    it("should detect childNode in appropriate cell", function () {
        expect(test_findSpotForCol(0, testBoard_someNums)).toEqual(4);
    });
});














