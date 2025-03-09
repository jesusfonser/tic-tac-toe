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

    let jugadores = [];
    let fin = false;
    let currentPlayer = undefined;

    const getFin = () => fin;

    const getCurrentPlayer = () => currentPlayer;

    const setCurrentPlayer = () => currentPlayer = jugadores[0];

    const addPlayer = (player) => jugadores.push(player);

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

    return {checkEnd, getFin, getCurrentPlayer, setCurrentPlayer, addPlayer}

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

function Player(simboloIn, nombreIn){

    let simbolo = simboloIn;
    let nombre = nombreIn;

    return {simbolo, nombre}

}


const DOMcontroller = (function() {

    const body = document.querySelector("body");
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

    const validateInputs = () => {
        let names = []
        const inputs = Array.from(document.querySelectorAll("input"));
        const buttonAccept = document.getElementById("names");
        const divInputs = document.getElementById("inputs");

        for (input of inputs){
            if (!input.value){
                input.setAttribute("style", "border-color: red;");
            } 

            else{
                input.setAttribute("style", "border-color: black");
                names.push(input.value);
            }
        }
    
        if (names.length === 2){
            gameflow.addPlayer(Player("O", names[0]));
            gameflow.addPlayer(Player("X", names[1]));
            gameflow.setCurrentPlayer();
            buttonAccept.remove();
            divInputs.remove();
            gameStart();
        }
    }


    const nombres = () => {

        document.getElementById("start").remove();
        elh2.textContent = "¡Poned vuestros nombres!"

        let input1 = document.createElement("input");
        let input2 = document.createElement("input");
        let aceptar = document.createElement("button");

        let divInput = document.createElement("div");
        divInput.setAttribute("id", "inputs");

        aceptar.textContent = "Comenzar";
        aceptar.setAttribute("onclick", "DOMcontroller.validateInputs()");
        aceptar.setAttribute("id", "names");

        divInput.appendChild(input1);
        divInput.appendChild(input2);
        body.appendChild(divInput);
        body.appendChild(aceptar);
    }

    function gameStart() {

        elh2.textContent = `Es el turno de ${gameflow.getCurrentPlayer().nombre}.`;

        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                board[i][j] = casillasDOM.shift();
                
                board[i][j].addEventListener("click", function(){
                    if(gameboard.board[i][j].getOwner() === "-" && !gameflow.getFin()){
                        changeImg(gameflow.getCurrentPlayer(), this);
                        gameboard.board[i][j].claim(gameflow.getCurrentPlayer().simbolo);
                        
                        if (gameflow.getFin()){
                            elh2.textContent = `El ganador es... ¡¡${gameflow.getCurrentPlayer().nombre}!!`;
                        }
                        else {
                            turno++
                            turno === 9 ? elh2.textContent = "¡Empate!" :
                            elh2.textContent = `Es el turno de ${gameflow.getCurrentPlayer().nombre}.`;
                        }
                    }
                })
            }
        }


        

    }

    return {nombres, validateInputs}
    

})(); 