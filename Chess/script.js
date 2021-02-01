let elements = document.querySelectorAll(".cell");
elements.forEach(function(element) {
    
    element.addEventListener("dragover",onDragOver);
    element.addEventListener("drop",onDrop);
});
/////////////////////////////////////////
elements = document.querySelectorAll(".pieces");
elements.forEach(function(element) {
    element.draggable="true";
    element.addEventListener("dragstart",onDragStart);
});

/////////////////////////////////////////

// 0 is continue play; 1= check state; 2=checkmate state
let playState = 0;

/////////////////////////////////////////

function Move(color,sqsource_id,sqtarget_id,piece,capture){
    this.color=color;
    this.piece=piece;
    this.sqsource_id=sqsource_id;
    this.sqtarget_id=sqtarget_id;
    if(capture===undefined){
        this.capture=" ";
    }else{
        this.capture=capture;
    }
    this.showMove = function(){
        return this.piece+" "+this.sqsource_id+this.capture+this.sqtarget_id;
    }
}

let MoveList=[];

/////////////////////////////////////////

function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    // event.currentTarget.style.backgroundColor = 'yellow';
}

function onDragOver(event) {
    // console.log(event.currentTarget);
        event.preventDefault();
    
}



function onDrop(event) {
    let square = event.target;

    if(square.tagName.toLowerCase()==='img'){
        square = square.parentNode;
    }

    const id = event.dataTransfer.getData('text');
    let piece_class = document.getElementById(id).className.replace("pieces ","");
    let sqsource_id = document.getElementById(id).parentNode.id;
    let sqtarget_id = square.id;
    let source_color = document.getElementById(id).id.slice(0,1);

    //checkEnPassant(sqsource_id,sqtarget_id,piece_class);
    //allow to move piece if square is a div with no child and not dropped on a piece (img) 
    if(!square.hasChildNodes()&&!(square.tagName.toLowerCase()==='img')){ 
        if( checkEnPassant(sqsource_id,sqtarget_id,piece_class) ){
            console.log("pawn can enpassant!");
            capture(id,square,"enpassant"); 
        }else if(checkValidMove(sqsource_id,sqtarget_id,piece_class) && !isBlocked(sqsource_id,sqtarget_id) ){
            const draggableElement = document.getElementById(id);
            square.appendChild(draggableElement);
            
            if(playState===1){
                console.log("playstate 1");               
                if(validateCheck() || playState===1){
                    square.innerHTML="";
                    showInvalidMove(square);
                    document.getElementById(sqsource_id).appendChild(draggableElement);

                }else{
                    MoveList.push(new Move(source_color,sqsource_id,sqtarget_id,piece_class));
                }
            }else{
                console.log("playstate 0");
                MoveList.push(new Move(source_color,sqsource_id,sqtarget_id,piece_class));
                event.dataTransfer.clearData();

                if(validateCheck()){
                    alert("CHECK!");
                }
                
            }
        }else if(piece_class==="king" && checkValidCastling(sqsource_id,sqtarget_id,source_color)){    
            console.log("castling conditions met");
            const draggableElement = document.getElementById(id);
            square.appendChild(draggableElement);
            switch(sqtarget_id){
                case "g1":
                    document.getElementById("f1").innerHTML=document.getElementById("h1").innerHTML;
                    document.getElementById("h1").innerHTML=""; break;
                case "b1":
                    document.getElementById("c1").innerHTML=document.getElementById("a1").innerHTML;
                    document.getElementById("a1").innerHTML=""; break;
                case "g8":
                    document.getElementById("f8").innerHTML=document.getElementById("h8").innerHTML;
                    document.getElementById("h8").innerHTML=""; break;
                case "b8":
                    document.getElementById("c8").innerHTML=document.getElementById("a8").innerHTML;
                    document.getElementById("a8").innerHTML=""; break;
            }
        }else{
            showInvalidMove(square);
        }

    }else{ //target square contains a piece
        if(!ValidCapture(piece_class,sqsource_id,square,sqtarget_id)){
            showInvalidMove(square);
        }else{
            console.log("capture");
            capture(id,square);

            if(playState===1){
                console.log("playstate 1");               
                if(validateCheck() || playState===1){
                    // console.log("resetting");
                    document.getElementById(sqsource_id).appendChild(square.firstChild);
                    square.innerHTML="";
                    let captureList = document.getElementById("captured_pieces");
                    console.log(captureList.lastChild);
                    square.appendChild(captureList.lastChild);
                    // console.log("reset done");
                    showInvalidMove(square);
                    
                }else{
                    MoveList.push(new Move(source_color,sqsource_id,sqtarget_id,piece_class,"x"));
                }
            }else{
                console.log("playstate 0");
                MoveList.push(new Move(source_color,sqsource_id,sqtarget_id,piece_class,"x"));
                if(validateCheck()){
                    alert("CHECK!");
                }
            }

            event.dataTransfer.clearData();
            
        }
    }
    
    console.log(MoveList);
}

function checkValidCastling(sqsource_id,sqtarget_id,source_color){
    console.log("checking valid castling");

    //king is in check
    if( validateCheck() || playState===1 ){
        return false;
    }

    if(source_color==="W"){
        
        if(sqtarget_id==="g1"){     //check kingside castling path

            //check if in right position
            if( !(sqsource_id==="e1" && sqtarget_id==="g1" && document.getElementById("h1").firstChild.id==="WR2") ){
                return false;
            }
            
                //check if there are pieces in between castling path
            if ( document.getElementById("f1").innerHTML!=="" ||
                document.getElementById("g1").innerHTML!=="" ){
                return false;
            }
            
            

            //check if king passes by or lands on square attacked by enemy pieces
            document.getElementById("f1").innerHTML=document.getElementById(sqsource_id).innerHTML;
            if( validateCheck() || playState===1 ){
                return false;
            }
            document.getElementById("g1").innerHTML=document.getElementById(sqsource_id).innerHTML;
            if( validateCheck() || playState===1 ){
                return false;
            }
            document.getElementById("f1").innerHTML="";
            document.getElementById("g1").innerHTML="";
        }else{  //queenside castling
            //check if in right position
            if( !(sqsource_id==="e1" && sqtarget_id==="b1" && document.getElementById("a1").firstChild.id==="WR1") ){
                return false;
            }

            //check if there are pieces in between castling path
            if ( document.getElementById("b1").innerHTML!=="" || document.getElementById("c1").innerHTML!=="" ||
                 document.getElementById("d1").innerHTML!==""){
                return false;
            }

            //check if king passes by or lands on square attacked by enemy pieces
            document.getElementById("d1").innerHTML=document.getElementById(sqsource_id).innerHTML;
            if( validateCheck() || playState===1 ){
                return false;
            }
            document.getElementById("c1").innerHTML=document.getElementById(sqsource_id).innerHTML;
            if( validateCheck() || playState===1 ){
                return false;
            }
            document.getElementById("b1").innerHTML=document.getElementById(sqsource_id).innerHTML;
            if( validateCheck() || playState===1 ){
                return false;
            }
            document.getElementById("d1").innerHTML="";
            document.getElementById("c1").innerHTML="";
            document.getElementById("b1").innerHTML="";
        }

        //code to check if king or rook already moved

        
    }else{

        if(sqtarget_id==="g8"){     //check kingside castling path

            //check if in right position
            if( !(sqsource_id==="e8" && sqtarget_id==="g8" && document.getElementById("h8").firstChild.id==="BR2") ){
                return false;
            }
            
                //check if there are pieces in between castling path
            if ( document.getElementById("f8").innerHTML!=="" || document.getElementById("g8").innerHTML!=="" ){
                return false;
            }
            
            

            //check if king passes by or lands on square attacked by enemy pieces
            document.getElementById("f8").innerHTML=document.getElementById(sqsource_id).innerHTML;
            if( validateCheck() || playState===1 ){
                return false;
            }
            document.getElementById("g8").innerHTML=document.getElementById(sqsource_id).innerHTML;
            if( validateCheck() || playState===1 ){
                return false;
            }
            document.getElementById("f8").innerHTML="";
            document.getElementById("g8").innerHTML="";
        }else{  //queenside castling
            //check if in right position
            if( !(sqsource_id==="e8" && sqtarget_id==="b8" && document.getElementById("a8").firstChild.id==="BR1") ){
                return false;
            }

            //check if there are pieces in between castling path
            if ( document.getElementById("b8").innerHTML!=="" || document.getElementById("c8").innerHTML!=="" ||
                 document.getElementById("d8").innerHTML!==""){
                return false;
            }

            //check if king passes by or lands on square attacked by enemy pieces
            document.getElementById("d8").innerHTML=document.getElementById(sqsource_id).innerHTML;
            if( validateCheck() || playState===1 ){
                return false;
            }
            document.getElementById("c8").innerHTML=document.getElementById(sqsource_id).innerHTML;
            if( validateCheck() || playState===1 ){
                return false;
            }
            document.getElementById("b8").innerHTML=document.getElementById(sqsource_id).innerHTML;
            if( validateCheck() || playState===1 ){
                return false;
            }
            document.getElementById("d8").innerHTML="";
            document.getElementById("c8").innerHTML="";
            document.getElementById("b8").innerHTML="";
        }

        //code to check if king or rook already moved
    }
   
    //pass the conditions return true
    return true;

}

function checkEnPassant(sqsource_id,sqtarget_id,piece_class){
    let source_color = document.getElementById(sqsource_id).firstChild.id.slice(0,1);
    if(sqtarget_id){

    }
    // let target_color = square.firstChild.id.slice(0,1);
    let sqsource_letter = sqsource_id.slice(0,1);
    let sqsource_letter_digit = getCodeFromLetter(sqsource_letter);
    let sqtarget_letter = sqtarget_id.slice(0,1);
    let sqtarget_letter_digit = getCodeFromLetter(sqtarget_letter);
    let sqsource_num = parseInt(sqsource_id.slice(-1));
    let sqtarget_num = parseInt(sqtarget_id.slice(-1));

    // console.log("EP "+source_color);
    // console.log("EP "+sqsource_letter);
    // console.log("EP "+sqsource_num);

    if( (source_color==="W" && sqsource_num===5 && sqtarget_num===6) || (source_color==="B" && sqsource_num===4 && sqtarget_num===3) ){
        let LastMoveObj = MoveList[MoveList.length-1];
        let LastMoveObj_sourcerow = parseInt(LastMoveObj.sqsource_id.slice(-1));
        let LastMoveObj_targetrow = parseInt(LastMoveObj.sqtarget_id.slice(-1));
        let LastMoveObj_target_letter = LastMoveObj.sqtarget_id.slice(0,1);
        let LastMoveObj_target_letter_digit = getCodeFromLetter(LastMoveObj_target_letter);
        if( (source_color==="W" && LastMoveObj.piece==="bpawn" && 
            LastMoveObj_sourcerow===7 && LastMoveObj_targetrow===5) &&
            (sqtarget_letter_digit===LastMoveObj_target_letter_digit && 
            LastMoveObj_targetrow===sqtarget_num-1) ){
                console.log("En Passant move valid");
                return true;
                
        }else if( (source_color==="B" && LastMoveObj.piece==="wpawn" && 
            LastMoveObj_sourcerow===2 && LastMoveObj_targetrow===4) &&
            (sqtarget_letter_digit===LastMoveObj_target_letter_digit && 
            LastMoveObj_targetrow===sqtarget_num+1) ){
                console.log("En Passant move valid");
                return true;

        }
    }

    return false;
}

function ValidCapture(piece_class,sqsource_id,square,sqtarget_id){
    
    let source_color = document.getElementById(sqsource_id).firstChild.id.slice(0,1);
    let target_color = square.firstChild.id.slice(0,1);

    if( (source_color==="W"&&target_color==="W") || (source_color==="B"&&target_color==="B") ){
        return false;
    }

    let sqsource_letter = sqsource_id.slice(0,1);
    let sqsource_letter_digit = getCodeFromLetter(sqsource_letter);
    let sqsource_num = parseInt(sqsource_id.slice(-1));

    let sqtarget_letter = sqtarget_id.slice(0,1);
    let sqtarget_letter_digit = getCodeFromLetter(sqtarget_letter);
    let sqtarget_num = parseInt(sqtarget_id.slice(-1));

    if(piece_class==="wpawn"){
        if( ((sqsource_letter_digit-sqtarget_letter_digit===-1 && sqsource_num-sqtarget_num===-1 ) ||
            (sqsource_letter_digit-sqtarget_letter_digit===1 && sqsource_num-sqtarget_num===-1)) ){

            return true;
        }
    }else if(piece_class==="bpawn"){
        if( ((sqsource_letter_digit-sqtarget_letter_digit===-1 && sqsource_num-sqtarget_num===1 ) ||
            (sqsource_letter_digit-sqtarget_letter_digit===1 && sqsource_num-sqtarget_num===1)) ){

            return true;
        }
    }else if(piece_class==="knight"){
        if(checkValidMove(sqsource_id,sqtarget_id,piece_class)){
            return true;
        }
    }else if(piece_class==="bishop"){
        if( checkValidMove(sqsource_id,sqtarget_id,piece_class) && !isBlocked(sqsource_id,sqtarget_id) ){
            return true;
        }
    }else if(piece_class==="queen"){
        if( checkValidMove(sqsource_id,sqtarget_id,piece_class) && !isBlocked(sqsource_id,sqtarget_id) ){
            return true;
        }
    }else if(piece_class==="rook"){
        if( checkValidMove(sqsource_id,sqtarget_id,piece_class) && !isBlocked(sqsource_id,sqtarget_id) ){
            return true;
        }
    }else{ //piece is king
        if( checkValidMove(sqsource_id,sqtarget_id,piece_class) && !isBlocked(sqsource_id,sqtarget_id) ){
            return true;
        }
    }
    return false;
}

//added captured_piece_id for enpassant case
function capture(capturing_piece_id,square,type=""){
    
    const draggableElement = document.getElementById(capturing_piece_id);

    let sqtarget_id = square.id
    let sqtarget_letter = sqtarget_id.slice(0,1);
    let sqtarget_letter_digit = getCodeFromLetter(sqtarget_letter);
    let sqtarget_num = parseInt(sqtarget_id.slice(-1));

    if(type==="enpassant"){ //enpassant case
        if(sqtarget_num===6){ //wpawn captures bpawn
            let captured_square = document.getElementById((sqtarget_letter+(sqtarget_num-1)));
            addToCapturedList(captured_square.firstChild);
            captured_square.innerHTML="";
        }else{ //otherwise bpawn captures wpawn
            let captured_square = document.getElementById((sqtarget_letter+(sqtarget_num+1)));
            addToCapturedList(captured_square.firstChild);
            captured_square.innerHTML="";
        }
        
    }else{
        addToCapturedList(square.firstChild);
        
    }

    square.innerHTML="";
    square.appendChild(draggableElement);
}

function addToCapturedList(captured_piece){
    document.getElementById("captured_pieces").appendChild(captured_piece);
}

function showInvalidMove(square){
    if(square.tagName==="IMG"){
        square = square.parentNode;
    }
    let OrigBGColor = square.style.backgroundColor;
    square.style.backgroundColor="#CD5C5C";
    setTimeout(function(){
        square.style.backgroundColor=OrigBGColor;
    },1000);    
}

function checkValidMove(sqsource_id,sqtarget_id,piece_class){
    let sqsource_letter = sqsource_id.slice(0,1);
    let sqsource_letter_digit = getCodeFromLetter(sqsource_letter);
    let sqsource_num = parseInt(sqsource_id.slice(-1))

    let sqtarget_letter = sqtarget_id.slice(0,1);
    let sqtarget_letter_digit = getCodeFromLetter(sqtarget_letter);
    let sqtarget_num = parseInt(sqtarget_id.slice(-1));

    // console.log(sqsource_letter_digit);
    // console.log(sqsource_num);
    // console.log(sqtarget_letter_digit);
    // console.log(sqtarget_num);


    if(piece_class==="wpawn"){
        if( (sqsource_letter === sqtarget_letter && (sqsource_letter+(sqsource_num+1)) === sqtarget_id) ||
            (sqtarget_num ===4 && sqsource_num<sqtarget_num)){
            return true;
        }
    }else if(piece_class==="bpawn"){
        if( (sqsource_letter === sqtarget_letter && (sqsource_letter+(sqsource_num-1)) === sqtarget_id) ||
            (sqtarget_num ===5 && sqsource_num>sqtarget_num)){
            return true;
        }
    }else if(piece_class==="rook"){
        if( sqsource_letter === sqtarget_letter || sqsource_num === sqtarget_num ){
            return true;
        }
    }else if(piece_class==="knight"){
        if( (Math.abs(sqsource_letter_digit-sqtarget_letter_digit)===2 && Math.abs(sqsource_num-sqtarget_num)===1 ) ||
        (Math.abs(sqsource_letter_digit-sqtarget_letter_digit)===1 && Math.abs(sqsource_num-sqtarget_num)===2 ) ){
            return true;
        }
    }else if(piece_class==="bishop"){
        if(Math.abs(sqsource_letter_digit-sqtarget_letter_digit)===Math.abs(sqsource_num-sqtarget_num)){
            return true;
        }
    }else if(piece_class==="queen"){
        if( (Math.abs(sqsource_letter_digit-sqtarget_letter_digit)===Math.abs(sqsource_num-sqtarget_num)) || 
            (sqsource_letter === sqtarget_letter || sqsource_num === sqtarget_num) ){
                return true;
        }
    }else if(piece_class==="king"){
        if ( Math.abs(sqsource_num-sqtarget_num)===1 || (Math.abs(sqsource_letter_digit-sqtarget_letter_digit) ===1 &&
             Math.abs(sqsource_num-sqtarget_num)<=1 ) ){

            return true;
        }
    }else{
        return false;
    }
}

function isBlocked(sqsource_id,sqtarget_id){
    let blocked;
    let movement = "";
    let direction="";
    let sqsource_letter = sqsource_id.slice(0,1);
    let sqsource_letter_digit = getCodeFromLetter(sqsource_letter);
    let sqsource_num = parseInt(sqsource_id.slice(-1));

    let sqtarget_letter = sqtarget_id.slice(0,1);
    let sqtarget_letter_digit = getCodeFromLetter(sqtarget_letter);
    let sqtarget_num = parseInt(sqtarget_id.slice(-1));


    //check movement
    if(Math.abs(sqsource_letter_digit-sqtarget_letter_digit)===Math.abs(sqsource_num-sqtarget_num)){
        movement="d"; //diagonal movement
        if((sqsource_letter_digit-sqtarget_letter_digit)<0 && (sqsource_num-sqtarget_num)<0 ){  // - -
            direction="rf"; //right forwards
        }else if((sqsource_letter_digit-sqtarget_letter_digit)<0 && (sqsource_num-sqtarget_num)>0 ){ // - +
            direction="rb"; //right backwards
        }else if((sqsource_letter_digit-sqtarget_letter_digit)>0 && (sqsource_num-sqtarget_num)<0 ){ // + -
            direction="lf"; //left forwards
        }else{ // + +
            direction="lb"; //left backwards
        }
    }else if(sqsource_letter===sqtarget_letter){
        movement = "v"; //same column, vertical movement
        if((sqsource_num-sqtarget_num)>0){
            direction="b";
        }else{
            direction="f";
        }
    }else if(sqsource_num===sqtarget_num){
        movement = "h"; //same row, rowhorizontal movement
        if((sqsource_letter_digit-sqtarget_letter_digit)>0){
            direction="b";
        }else{
            direction="f";
        }
    }else{
        movement="x";
    }

    //loop through squares interchanging src and target if direction is forward or backward
    if(direction==="f"){
        blocked = isBlockedCheck(movement,direction,sqsource_letter_digit,sqsource_num,sqtarget_letter_digit,sqtarget_num);
    }else if(direction==="b"){
        blocked = isBlockedCheck(movement,direction,sqtarget_letter_digit,sqtarget_num,sqsource_letter_digit,sqsource_num);
    }else if( direction==="rf" || direction==="rb" ){ 
        blocked = isBlockedCheck(movement,direction,sqsource_letter_digit,sqsource_num,sqtarget_letter_digit,sqtarget_num);
    }else{ //direction is lf or lb
        blocked = isBlockedCheck(movement,direction,sqtarget_letter_digit,sqtarget_num,sqsource_letter_digit,sqsource_num);
    }

    // if(blocked){
    //     console.log("move not allowed, piece blocked");
    // }else{
    //     console.log("move not blocked");
    // }
    return blocked;



}

//returns true it finds any piece in between src and target
function isBlockedCheck(movement,direction,sqsource_letter_digit,sqsource_num,sqtarget_letter_digit,sqtarget_num){
    // console.log(sqsource_letter_digit);
    // console.log(sqsource_num);
    // console.log(sqtarget_letter_digit);
    // console.log(sqtarget_num);

    if(movement==="d"){
        console.log("movement d");
        for(i=1;sqsource_letter_digit+i<sqtarget_letter_digit;i++){
            let square;
            if(direction==="rb" || direction==="lf"){
                square = getLetterFromCode(sqsource_letter_digit+i) + (sqsource_num-i).toString();
            }else{ //direction === rf or lb
                square = getLetterFromCode(sqsource_letter_digit+i) + (sqsource_num+i).toString();
            }
            // console.log(square);
            if(document.getElementById(square).hasChildNodes()){
                return true; //existing piece bet src and target
            }
        }
        return false;
    }else if(movement==="v"){ 
        console.log("movement v");
        for(i=1;sqsource_num+i<sqtarget_num;i++){
            let square = getLetterFromCode(sqsource_letter_digit) + (sqsource_num+i).toString();
            if(document.getElementById(square).hasChildNodes()){
                return true; //existing piece bet src and target
            }
        }
        return false;
    }else if(movement==="h"){ //movement === h
        console.log("movement h");
        for(i=1;sqsource_letter_digit+i<sqtarget_letter_digit;i++){
            let square = getLetterFromCode(sqsource_letter_digit+i) + sqsource_num.toString();
            if(document.getElementById(square).hasChildNodes()){
                return true; //existing piece bet src and target
            }
        }
        return false;
    }else{ //movement === x
        return false;
    }
}

function validateCheck(){
    //Get length of Move list if div by 2 or is 0 color is white
    if(MoveList[MoveList.length-1].color==="W"){
        currPlayer_color="W";
        lastPlayer_color="B";
    }else{
        currPlayer_color="B";
        lastPlayer_color="W";
        
    }
    // console.log(MoveList.length-1);
    // console.log(currPlayer_color);
    // console.log(lastPlayer_color);

    // check if last player can capture enemy king next turn
    let query= "div.cell>img[id^='"+currPlayer_color+"']";
    currPlayer_pieces = document.querySelectorAll(query);
    for ( x of currPlayer_pieces ){
        let piece_class = x.className.replace("pieces ","");
        let sqsource_id = x.parentNode.id;
        let square = document.getElementById(lastPlayer_color+"K").parentNode;
        let sqtarget_id = square.id;
        

        if(ValidCapture(piece_class,sqsource_id,square,sqtarget_id)){
        // console.log(piece_class);
        // console.log(sqsource_id);
        // console.log(square);
        // console.log(sqtarget_id);
        // console.log("---------");
            playState=1;
            return true;
        }
    }
    playState=0;
    return false;
}

//returns an integer, get corresponding ascii code for letter
function getCodeFromLetter(str){
    return str.charCodeAt(0)-96;
}

//returns a string, get corresponding letter for ascii code
function getLetterFromCode(num){
    return String.fromCharCode(num+96);
}