let correctAnswer = "";
let currentLevel = 1;
let userName = "";
let combo = 0;

// 积分
let points = localStorage.getItem("points");
points = points ? parseInt(points) : 0;

// 目标 & 奖励
let goal = localStorage.getItem("goal");
let reward = localStorage.getItem("reward");

// 动态倒数日
function updateCountdown() {
    const today = new Date();
    const target = new Date(today.getFullYear(),4,4); // May 4
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime/(1000*60*60*24));
    document.getElementById("daysLeft").innerText = diffDays>0? diffDays:0;
}
setInterval(updateCountdown,1000);
updateCountdown();

function enterSetup() {
    document.getElementById("homeSection").style.display = "none";
    document.getElementById("setupSection").style.display = "flex";
}

function saveProfile() {
    userName = document.getElementById("nameInput").value;
    goal = document.getElementById("goalInput").value;
    reward = document.getElementById("rewardInput").value;
    if(!userName || !goal || !reward){ alert("Please fill all fields!"); return;}
    localStorage.setItem("goal",goal);
    localStorage.setItem("reward",reward);
    localStorage.setItem("userName",userName);

    document.getElementById("setupSection").style.display="none";
    document.getElementById("chapterSection").style.display="flex";
    updatePoints();
    updateGoal();
}

function updatePoints(){ document.getElementById("pointsDisplay").innerText="Points: "+points; }
function updateGoal(){ document.getElementById("goalDisplay").innerText="Goal: "+goal+" pts | Reward: "+reward; }

function startPractice(level){
    currentLevel = level;
    combo=0;
    document.getElementById("chapterSection").style.display="none";
    document.getElementById("practiceSection").style.display="flex";
    document.getElementById("practiceTitle").innerText="Vectors Practice - "+level+" Star";
    updatePoints(); updateGoal(); generateQuestion();
}

function generateQuestion(){
    const q=document.getElementById("questionBox");
    q.className="question-box";

    let max=5,min=1;
    if(currentLevel===1){min=1;max=5;}
    if(currentLevel===2){min=3;max=10;}
    if(currentLevel===3){min=5;max=15;}

    let x=Math.floor(Math.random()*(max-min+1))+min;
    let y=Math.floor(Math.random()*(max-min+1))+min;
    let z=Math.floor(Math.random()*(max-min+1))+min;
    correctAnswer = Math.sqrt(x*x + y*y + z*z).toFixed(2);

    q.innerText=`Find magnitude of vector (${x}, ${y}, ${z})`;
    document.getElementById("answerInput").value="";
    document.getElementById("comboDisplay").innerText="Combo: "+combo;
}

function submitAnswer(){
    const userAnswer=document.getElementById("answerInput").value;
    const q=document.getElementById("questionBox");
    const pointsEl=document.getElementById("pointsDisplay");

    if(parseFloat(userAnswer).toFixed(2)===correctAnswer){
        combo++;
        let gain=10*combo;
        points+=gain;
        localStorage.setItem("points",points);
        updatePoints();
        document.getElementById("comboDisplay").innerText="Combo: "+combo;

        q.classList.remove("correct","jump"); void q.offsetWidth;
        q.classList.add("correct","jump");
        pointsEl.classList.remove("points-jump"); void pointsEl.offsetWidth;
        pointsEl.classList.add("points-jump");

        if(points>=goal){
            document.body.classList.add("celebrate");
            showCongrats();
        }else{ alert(`Correct! +${gain} points 🎉`); }
        setTimeout(generateQuestion,500);
    }else{
        combo=0;
        document.getElementById("comboDisplay").innerText="Combo: "+combo;
        q.classList.remove("wrong"); void q.offsetWidth;
        q.classList.add("wrong");
        alert("Wrong, try again!");
    }
}

// Modal
function showCongrats(){
    points=0; localStorage.setItem("points",points);
    const modal=document.getElementById("congratsModal");
    document.getElementById("congratsMessage").innerText=`Congratulations, ${userName}! You have done your goals! Let's redeem your award now!`;
    modal.style.display="block";
}

function closeCongrats(){
    document.getElementById("congratsModal").style.display="none";
    document.getElementById("practiceSection").style.display="none";
    document.getElementById("setupSection").style.display="flex";
}