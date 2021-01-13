let Quiz_default=[new Question("What does HTML stand for?","1) Hyper Text Markup Language","2) Hot Mail","3) How to make Lasagna",1),
        new Question("How many tags are in a regular element?","1) 2","2) 1","3) 3",1),
        new Question("what is the difference in an opening tag and a closing tag?","1) Opening tag has a / in front","2) Closing tag has a / in front","3) There is no difference",2),
        new Question("< br  / > What type of tag is this?","1) Break tag","2) A broken one","3) An opening tag",1),
        new Question("< body > Is this an opening tag or a closing tag?","1) Opening","2) Closing",undefined,1),
        new Question("< / body > Is this an opening tag or a closing tag?","1) Opening","2) Closing",undefined,2),
        new Question("where is the meta tag only found?","1) The Last page","2) The home page","3) The second page",2),
        new Question("which is the correct way to tag an image?","1)  src=”image.jpg/gif” alt=”type some text” ","2) Src=”image.jpg/gif” alt=”type some text” ","3) src=”image.jpg” alt=”type some text” ",3),
        new Question("What is an element that does not have a closing tag called?","1) Tag","2) Empty Element","3) Closed Element",2),
        new Question("Which of the following is an example of an empty element?","1) < img / >","2) < img > < / img >","3) < / img>",1),
        new Question("What should values always be enclosed in?","1) Quotation marks","2) Commas","3) Parenthesis",1),
        new Question("Where do all items for the same web site need to be saved?","1) In the same folder","2) Where ever is fine","3) In different folders",1),
        new Question('What does < a  href= "http://www.google.com"  title="Link to Google" target= "_blank"> Google  </a> do?',"1) Adds a link to google on the page","2) Adds a search engine to the page","3) Nothing",1),
        new Question("What is always a welcome page, and explains the purpose or topic of the site?","1) Page 4","2) Home page","3) Table of Contents",2),
        new Question("What does View Source do?","1) Nothing","2) Brings up a note pad with the HTML code already used for the site.","3) Opens a new website",2)];

let Quiz= Quiz_default.slice(0);

let score=0;
let streak=0;


function Question(question,ans1,ans2,ans3,correct){
    this.question=question;
    this.ans1=ans1;
    this.ans2=ans2;
    this.ans3=ans3;
    this.correct=correct;
}

function askQuestion(question_no){
    
    document.getElementById("question").innerHTML="Question: "+Quiz[question_no].question;
    if(Quiz[question_no].ans1 !== undefined){
        document.getElementById("ans1").innerHTML=Quiz[question_no].ans1;
    }
    if(Quiz[question_no].ans2 !== undefined){
        document.getElementById("ans2").innerHTML=Quiz[question_no].ans2;
    }
    if(Quiz[question_no].ans3 !== undefined){
        document.getElementById("ans3").innerHTML=Quiz[question_no].ans3;
    }
    
}

//returns true if correct
function getAnswer(question_no){
    let user_ans;
    
        // user_ans = prompt("Enter number of correct answer");
    user_ans = document.getElementById("user_ans").value;
    
    if(user_ans===null){
        throw new Error('Prompt canceled, terminating Quiz');
    }
    if(user_ans!=="exit"){
        user_ans=parseInt(user_ans);
    }
    console.log("User Answer: "+user_ans);
    // console.log("user_ans type: "+typeof(user_ans));
    // console.log("q_no: "+question_no);
    // console.log("q_no correct ans: "+Quiz[question_no].correct);
    if(user_ans===Quiz[question_no].correct){
        return "correct";
    }else if(user_ans==="exit"){
        return "exit";
    }else{
        return "incorrect"
    }
    
}

function checkStreak(streak){
    if(streak%5===0 && streak!==0){
        return true;
    }
}

async function startQuiz(){
    document.getElementById("start").disabled=true;
    let question_no = Math.floor(Math.random() * (Quiz.length-1));
    askQuestion(question_no);
    document.getElementById("user_ans").disabled=false;
    document.getElementById("submit").disabled=false;
    document.getElementById("question_no").innerHTML=question_no;
}

function submit(){

    let answer="";
    let question_no=parseInt(document.getElementById("question_no").innerHTML);
    answer= getAnswer(question_no);
    // while(answer===""){
    //     await new Promise(r => setTimeout(r, 5000));
    // }
    
    if(answer==="correct"){
        console.log("correct answer");
        alert("correct answer");
        // setTimeout(function(){
        //     document.getElementById("ans_status").innerHTML="Correct answer!";
        //     document.getElementById("ans_status").style.backgroundColor="green";
        // },1000);  
        
        score++;
        console.log("score: "+score);
        streak++;
        console.log("streak: "+streak);
        if(checkStreak(streak)){
            // console.log(streak+" in a row!");
            alert(streak+" in a row!");
        }
        document.getElementById("user_ans").value="";
        startQuiz();
    }else if(answer==="incorrect"){
        console.log("incorrect answer");
        alert("incorrect answer");
        console.log("score: "+score);
        streak=0;
        console.log("streak: "+streak);
        if(checkStreak(streak)){
            // console.log(streak+" in a row!");
            alert(streak+" in a row!");
        }
        document.getElementById("user_ans").value="";
        startQuiz();

    }else{
        console.log("terminating run");
        alert("terminating run, score and streak is reset");
        reset();
        
    }
    
    

    
}

function reset(){
    Quiz=Quiz_default;
    score=0;
    streak=0;
    document.getElementById("start").disabled=false;
    document.getElementById("question").innerHTML="Press Start Quiz to start";
    document.getElementById("user_ans").value="";
    document.getElementById("ans1").innerHTML="";
    document.getElementById("ans2").innerHTML="";
    document.getElementById("ans3").innerHTML="";
    
    document.getElementById("user_ans").disabled=true;
    document.getElementById("submit").disabled=true;
}
