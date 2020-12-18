document.getElementById("zero").addEventListener("click",insertNumber);
document.getElementById("one").addEventListener("click",insertNumber);
document.getElementById("two").addEventListener("click",insertNumber);
document.getElementById("three").addEventListener("click",insertNumber);
document.getElementById("four").addEventListener("click",insertNumber);
document.getElementById("five").addEventListener("click",insertNumber);
document.getElementById("six").addEventListener("click",insertNumber);
document.getElementById("seven").addEventListener("click",insertNumber);
document.getElementById("eight").addEventListener("click",insertNumber);
document.getElementById("nine").addEventListener("click",insertNumber);

document.getElementById("multiply").addEventListener("click",insertOp);
document.getElementById("divide").addEventListener("click",insertOp);
document.getElementById("add").addEventListener("click",insertOp);
document.getElementById("subtract").addEventListener("click",insertOp);

document.getElementById("clear").addEventListener("click",clearScreen);
document.getElementById("delete").addEventListener("click",deleteChar);

document.getElementById("decimal").addEventListener("click",insertDecimal);
document.getElementById("equals").addEventListener("click",compute);

function insertNumber(e){
    // alert(document.getElementById(e.target.id).innerText);
    let ScreenValue = document.getElementById("screen").value;

    if(ScreenValue==="0"){
        ScreenValue='';
    }

    ScreenValue+=document.getElementById(e.target.id).innerText;
    document.getElementById("screen").value=ScreenValue;
}

function insertOp(e){
    let ScreenValue;
    if(document.getElementById("screen-top").value===''){ //check if screen-top is empty
        ScreenValue = document.getElementById("screen").value;
    }else{
        ScreenValue = document.getElementById("screen-top").value+document.getElementById("screen").value;
    }
    //check if last char is operand, if it is replace last char
    if(ScreenValue.slice(-1)==="*"||ScreenValue.slice(-1)==="/"||ScreenValue.slice(-1)==="+"||ScreenValue.slice(-1)==="-"){
        ScreenValue=ScreenValue.slice(0,-1)+document.getElementById(e.target.id).innerText;
    }else{ //last char a digit or decimal
        if(ScreenValue.slice(-1)==="."){
            ScreenValue=ScreenValue.slice(0,-1); //remove decimal first
        }
        ScreenValue+=document.getElementById(e.target.id).innerText;
    }
    document.getElementById("screen-top").value=ScreenValue;
    document.getElementById("screen").value='0';
}

function clearScreen(e){
    document.getElementById("screen").value='0';
    document.getElementById("screen-top").value='';
}

function deleteChar(e){
    let ScreenValue = document.getElementById("screen").value;
    let EditedScreenValue = ScreenValue.slice(0,-1);
    document.getElementById("screen").value = EditedScreenValue;
    if(document.getElementById("screen").value===''){
        document.getElementById("screen").value='0';
    }
}

function insertDecimal(e){
    
    let ScreenValue = document.getElementById("screen").value;
    if(!ScreenValue.includes(".")){     //do if there is no existing decimal pt
        ScreenValue+=document.getElementById(e.target.id).innerText;
        document.getElementById("screen").value = ScreenValue;
    }
}

function compute(e){
    ScreenValue = document.getElementById("screen-top").value+document.getElementById("screen").value;

    //check if last char is operand, if it is remove last char
    if(ScreenValue.slice(-1)==="*"||ScreenValue.slice(-1)==="/"||ScreenValue.slice(-1)==="+"||ScreenValue.slice(-1)==="-"){
        ScreenValue=ScreenValue.slice(0,-1);
    }
    console.log(ScreenValue);
    if(ScreenValue.slice(-2)==="/0"){
        document.getElementById("screen").value='cannot divide by zero';
    }else{
        //parseFloat and toString to strip trail 0
        document.getElementById("screen").value = parseFloat(eval(ScreenValue).toFixed(5)).toString(); 
    }
    document.getElementById("screen-top").value='';
}