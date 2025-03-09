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
    let currentPlayer = jugadores[0];
    let fin = false;

    const getFin = () => fin;

    const getCurrentPlayer = () => currentPlayer;

    function changeTurn (){
        currentPlayer === jugadores[0] ? currentPlayer = jugadores[1] :
        currentPlayer = jugadores[0];
    }

    function checkEndHor(){
        for (let i = 0; i < 3; i++){
            if (gameboard.board[i].every((e) => e.getOwner() === gameboard.board[i][0].getOwner()) &&
                gameboard.board[i][0].getOwner() !== "-"){
                console.log("Fin de la partida por victoria horizontal.");
                fin = true;
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
                fin = true;
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
                fin = true;
            }
    }

    const checkEnd = () => {
        checkEndHor();
        if(!fin) checkEndVer();
        if(!fin) checkEndDiag();
        if(!fin) changeTurn();
    }

    return {checkEnd, getFin, getCurrentPlayer}

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

    const divboard = document.getElementById("gameboard");
    const elh2 = document.getElementById("texto");
    const casillasDOM = Array.from(document.querySelectorAll("#gameboard > div"));
    let board = [[], [], []];
    let turno = 0;

    function changeImg (player, div) {
        let img = document.createElement("img");
        player.simbolo === "O" ? img.setAttribute("src", "./images/O.svg") :
        img.setAttribute("src", "./images/X.svg");
        div.appendChild(img);
    }

    const gameStart = (element) => {

        element.remove()
        elh2.textContent = "Es el turno del jugador 1.";

        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                board[i][j] = casillasDOM.shift();
                
                board[i][j].addEventListener("click", function(){
                    if(gameboard.board[i][j].getOwner() === "-" && !gameflow.getFin()){
                        changeImg(gameflow.getCurrentPlayer(), this);
                        gameboard.board[i][j].claim(gameflow.getCurrentPlayer().simbolo);
                        
                        if (gameflow.getFin()){
                            elh2.textContent = `El ganador es... ¡¡EL JUGADOR ${gameflow.getCurrentPlayer().numero}!!`;
                        }
                        else {
                            turno++
                            turno === 9 ? elh2.textContent = "¡Empate!" :
                            elh2.textContent = `Es el turno del jugador ${gameflow.getCurrentPlayer().numero}.`;
                        }
                    }
                })
            }
        }


        

    }

    return {gameStart}
    

})(); 