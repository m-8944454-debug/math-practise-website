/* ================= PAGE CONTROL ================= */
function hideAll(){ document.querySelectorAll(".page").forEach(p=>p.style.display="none"); }
function show(id){ hideAll(); document.getElementById(id).style.display="flex"; }

function goLanding(){ show("landingPage"); }
function goProfile(){ show("profilePage"); }
function goRewards(){ show("rewardPage"); renderRewards(); }
function goTopic(){ show("topicPage"); }
function goQuestion(){ show("questionPage"); }
function goData(){ show("dataPage"); showData(); }

/* ================= SIDEBAR ================= */
let sidebarOpen=false;
function toggleSidebar(){
    sidebarOpen = !sidebarOpen;
    document.getElementById("sidebar").style.left = sidebarOpen ? "0" : "-240px";
}

/* ================= DATA ================= */
let profile={}, rewards=[], points=0, combo=0, wrongCount=0;
let currentTopic="", currentLevel="", currentQuestion=null;

// Stats: topic->level->answered
let stats = {
    vector:{beginner:0,intermediate:0,advanced:0},
    integration:{beginner:0,intermediate:0,advanced:0}
};

/* ================= STORAGE ================= */
function save(){
    localStorage.setItem("profile",JSON.stringify(profile));
    localStorage.setItem("rewards",JSON.stringify(rewards));
    localStorage.setItem("points",points);
    localStorage.setItem("stats",JSON.stringify(stats));
}
function load(){
    profile = JSON.parse(localStorage.getItem("profile")||"{}");
    rewards = JSON.parse(localStorage.getItem("rewards")||"[]");
    points = Number(localStorage.getItem("points")||0);
    stats = JSON.parse(localStorage.getItem("stats")||JSON.stringify(stats));
}

/* ================= LANDING ================= */
function landingStart(){
    if(profile.name){ goTopic(); } else { goProfile(); }
}

/* ================= PROFILE ================= */
function saveProfile(){
    profile.name=document.getElementById("profileName").value;
    profile.desc=document.getElementById("profileDesc").value;
    save();
    alert("Profile saved successfully!");
}

/* ================= CLEAR DATA ================= */
function clearProfileData(){
    if(confirm("Clear all data? This will reset profile, points, rewards, and stats.")){
        profile={}; rewards=[]; points=0;
        stats={vector:{beginner:0,intermediate:0,advanced:0}, integration:{beginner:0,intermediate:0,advanced:0}};
        localStorage.clear();
        alert("All data cleared! Reload to start as a new user.");
        goProfile();
    }
}

/* ================= REWARDS ================= */
function addReward(){
    if(rewards.length>=5) return alert("Maximum 5 rewards only");
    rewards.push({name:"New Reward",points:50});
    save(); renderRewards();
}

function renderRewards(){
    document.getElementById("pointsText").innerText=points;
    const box=document.getElementById("rewardStore");
    box.innerHTML="";
    rewards.forEach((r,i)=>{
        box.innerHTML+=`
        <div class="rewardCard">
            <b>${r.name}</b><br>${r.points} pts
            <br><button onclick="redeem(${i})">Redeem</button>
        </div>`;
    });
}

function redeem(i){
    if(points>=rewards[i].points){
        points-=rewards[i].points;
        rewards.splice(i,1);
        save(); renderRewards();
    } else alert("Not enough points");
}

/* ================= QUESTION BANK ================= */
const vectorBank={
    beginner:[{q:"Find |(3,4)|",ans:"5",sol:"√(3²+4²)=5"}],
    intermediate:[{q:"Find a·b if a=(1,2), b=(3,4)",ans:"11",sol:"1*3+2*4=11"}],
    advanced:[{q:"Explain collinearity of vectors",ans:null,sol:"Collinear if one vector is multiple of another"}]
};

const integrationBank={
    beginner:[{q:"∫ 3x² dx",ans:"x^3 + C",sol:"∫ xⁿ dx = xⁿ⁺¹/(n+1)"}],
    intermediate:[{q:"∫ x e^x dx",ans:"(x-1)e^x + C",sol:"Use integration by parts"},{q:"∫ 2x/(x²+1) dx",ans:"ln(x²+1) + C",sol:"Substitution u = x²+1"}],
    advanced:[{q:"Area under y=x² from 0 to 1",ans:"1/3",sol:"∫₀¹ x² dx = 1/3"},{q:"Volume when y=x² rotated x-axis 0 to 1",ans:"π/5",sol:"V=π∫x⁴ dx=π/5"}]
};

/* ================= START TOPIC ================= */
function startTopic(topic,level){
    currentTopic=topic;
    currentLevel=level;
    combo=0; wrongCount=0;
    nextQuestion(); goQuestion();
}

function topicBank(){
    if(currentTopic==="vector") return vectorBank[currentLevel];
    if(currentTopic==="integration") return integrationBank[currentLevel];
    return [];
}

function nextQuestion(){
    let bank=topicBank();
    currentQuestion=bank[Math.floor(Math.random()*bank.length)];
    document.getElementById("questionText").innerText=currentQuestion.q;
    document.getElementById("answerInput").value="";
    document.getElementById("comboText").innerText="";
    document.getElementById("questionPoints").innerText=points;
}

/* ================= SUBMIT ANSWER ================= */
function submitAnswer(){
    const userAns=document.getElementById("answerInput").value.trim();
    if(currentQuestion.ans===null){
        points+=10;
        stats[currentTopic][currentLevel]++;
        save();
        alert("Good explanation!");
        nextQuestion(); return;
    }

    if(userAns===currentQuestion.ans){
        points+=10;
        combo++;
        stats[currentTopic][currentLevel]++;
        wrongCount=0;
        document.getElementById("comboText").innerText=combo>1?`🔥 Combo x${combo}`:"";
        save(); nextQuestion();
    }else{
        combo=0; wrongCount++;
        if(wrongCount>=2){
            const see=confirm("Wrong twice. See answer & solution?");
            if(see){ alert(`Answer: ${currentQuestion.ans}\nSolution: ${currentQuestion.sol}`); }
            wrongCount=0;
        } else { alert("Wrong. Try again."); }
    }
}

/* ================= EXIT QUESTION ================= */
function exitQuestion(){ goTopic(); }

/* ================= DATA PAGE ================= */
function showData(){
    const total=stats.vector.beginner+stats.vector.intermediate+stats.vector.advanced
                +stats.integration.beginner+stats.integration.intermediate+stats.integration.advanced;
    document.getElementById("dataTotal").innerHTML=`<b>Total Questions Answered:</b> ${total}`;
    document.getElementById("dataVector").innerHTML=
        `<b>Vector:</b><br>⭐ Beginner: ${stats.vector.beginner}<br>⭐⭐ Intermediate: ${stats.vector.intermediate}<br>⭐⭐⭐ Advanced: ${stats.vector.advanced}`;
    document.getElementById("dataIntegration").innerHTML=
        `<b>Integration:</b><br>⭐ Beginner: ${stats.integration.beginner}<br>⭐⭐ Intermediate: ${stats.integration.intermediate}<br>⭐⭐⭐ Advanced: ${stats.integration.advanced}`;
}

/* ================= COUNTDOWN ================= */
function countdown(){
    const days=Math.ceil((new Date("2026-05-04")-new Date())/86400000);
    document.getElementById("countdownLanding").innerText=`PSPM SM025\n${days} days`;
    document.getElementById("countdownSidebar").innerText=`PSPM SM025\n${days} days`;
}

/* ================= INIT ================= */
window.onload=()=>{
    load(); goLanding(); countdown();
};