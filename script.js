const gameboard = (function(){
        
    let board = [[],[],[]];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++){
        for (let j = 0; j < columns; j++){
            board[i][j] = Cell();
        }
    }
    
    const printBoard = () => {
        let boardPrinted = [[],[],[]]
        
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < columns; j++){
                boardPrinted[i][j] = board[i][j].getOwner();
            }
            console.log(boardPrinted[i]);
        }
    }

    return {board, printBoard};
})();

const gameflow = (function (){

    let jugadores = [Player("O", 1), Player("X", 2)];

    function checkEndHor(){
        for (let i = 0; i < 3; i++){
            if (gameboard.board[i].every((e) => e.getOwner() === gameboard.board[i][0].getOwner()) &&
                gameboard.board[i][0].getOwner() !== "-"){
                console.log("Fin de la partida por victoria horizontal.");
            } 
        }
    }

    function checkEndVer(){
        let arrVer = [];
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                arrVer.push(gameboard.board[j][i].getOwner());
            }
            if (arrVer.every((e) => e === arrVer[0]) && arrVer[0] !== "-"){
                console.log("Fin de la partida por victoria vertical.");
            }
            else arrVer = [];
        }
    }

    function checkEndDiag(){
        let arrDiag1 = [];
        let arrDiag2 = [];

        for (let i = 0; i < 3; i++){
            arrDiag1.push(gameboard.board[i][i].getOwner())
        }

        let x = 2;
        for (let i = 0; i <= 2; i++){
            arrDiag2.push(gameboard.board[i][x].getOwner());
            x--;
        }

        if  (
            (arrDiag1.every((e) => e === arrDiag1[0]) &&
            arrDiag1[0] !== "-") ||
            (arrDiag2.every((e) => e === arrDiag2[0]) &&
            arrDiag2[0] !== "-")
            ){
                console.log("Fin de la partida por victoria diagonal.")
            }
    }

    const checkEnd = () => {
        checkEndHor();
        checkEndVer();
        checkEndDiag();
    }

    return {checkEnd}

})()

function Cell(){

    let owner = "-";

    const getOwner = () => owner;
    
    const claim = (player) => {
        if (owner !== "-") 
        console.log("Casilla ya ocupada.");
        
        else{
            owner = player;
            gameboard.printBoard();
            gameflow.checkEnd();
        }
    } 

    return {getOwner, claim};

}

function Player(simboloIn, numeroIn){

    let simbolo = simboloIn;
    let numero = numeroIn;
    
    return {simbolo, numero}

}

const DOMcontroller = (function() {

})();