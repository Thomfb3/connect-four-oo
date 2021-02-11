//Update to reflect main game variables

const TEST_WIDTH = 7;
const TEST_HEIGHT = 6;
const TEST_PLAYERS = [
    {
        id: "p1",
        color: "red"
    },
    {
        id: "p2",
        color: "blue"
    }
];

const game = new Game(TEST_PLAYERS, TEST_WIDTH, TEST_HEIGHT);


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

    const game = new Game(TEST_PLAYERS, TEST_WIDTH, TEST_HEIGHT);

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


    it("should find the spot for color", function () {
        game.board = testBoard_allNulls;
        expect(game.findSpotForCol(1)).toEqual(5);
    });
    it("should find the spot for color", function () {
        game.board = testBoard_allNulls;
        expect(game.findSpotForCol(3)).toEqual(5);
    });
    it("should find the spot for color", function () {
        game.board = testBoard_someNums;
        expect(game.findSpotForCol(6)).toEqual(3);
    });
    it("should find the spot for color", function () {
        game.board = testBoard_someNums;
        expect(game.findSpotForCol(0)).toEqual(4);
    });
});



describe("#isColor - Check if color input is valid", function () {

    it("should return true for valid color", function () {
        expect(isColor('#fff')).toEqual(true);
    });
    it("should return true for valid color", function () {
        expect(isColor('tomato')).toEqual(true);
    });
    it("should return true for valid color", function () {
        expect(isColor('rgb(200,85,3)')).toEqual(true);
    });

    it("should return true for valid color", function () {
        expect(isColor('rgba(200,85,3,.5)')).toEqual(true);
    });
    it("should return false for invalid color", function () {
        expect(isColor('hello')).toEqual(false);
    });
    it("should return false for invalid color", function () {
        expect(isColor('#afy9b')).toEqual(false);
    });
    it("should return false for invalid color", function () {
        expect(isColor('rgb(red,835,3)')).toEqual(false);
    });


});











