// --- 初期設定 ---
const API_KEY = 'ここにOpenWeatherMapのAPIキー';
let users = JSON.parse(localStorage.getItem('users')) || {};
let adminPass = '20201002Mana';
let noticeHistory = JSON.parse(localStorage.getItem('noticeHistory')) || [];
let quakeHistory = JSON.parse(localStorage.getItem('quakeHistory')) || [];
let tsunamiHistory = JSON.parse(localStorage.getItem('tsunamiHistory')) || [];
let tsunamiColors = JSON.parse(localStorage.getItem('tsunamiColors')) || {};
let darkMode = localStorage.getItem('darkMode')==='true';
let volcanoText = '現在火山情報はありません';

// --- ダークモード ---
const body = document.body;
if(darkMode) body.classList.add('dark');
document.getElementById('darkModeToggle').onclick = () => {
  body.classList.toggle('dark');
  localStorage.setItem('darkMode', body.classList.contains('dark'));
};

// --- ページ切替 ---
function openPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function home(){openPage('home');}

// --- 通知 ---
function notifyAll(msg){
  if(Notification.permission==='granted'){
    new Notification('防災ナビ通知', {body:msg});
  }else{Notification.requestPermission();}
}

// --- 管理者モード ---
function checkAdmin(){
  const pass = document.getElementById('adminPass').value;
  if(pass===adminPass){
    openPage('admin');
    document.getElementById('admin-msg').innerText='';
    loadHistory(); loadQuakeHistory(); loadTsunamiHistory();
  } else {
    document.getElementById('admin-msg').innerText='パスワードが違います';
  }
}

// --- お知らせ ---
function setNotice(){
  const text = document.getElementById('adminText').value;
  document.getElementById('notice').innerText = text;
  noticeHistory.push({text,date:new Date().toLocaleString()});
  localStorage.setItem('noticeHistory', JSON.stringify(noticeHistory));
  notifyAll(text);
  loadHistory();
}
function loadHistory(){
  const h = document.getElementById('history'); h.innerHTML='';
  noticeHistory.forEach(n=>{
    const div = document.createElement('div'); div.className='history-box';
    div.innerText=`[${n.date}] ${n.text}`;
    h.appendChild(div);
  });
}

// --- アカウント管理 ---
function registerUser(){
  const email=document.getElementById('regEmail').value;
  const pass=document.getElementById('regPass').value;
  if(!email || !pass){document.getElementById('account-msg').innerText='全て入力してください'; return;}
  users[email]=pass;
  localStorage.setItem('users',JSON.stringify(users));
  document.getElementById('account-msg').innerText='登録完了';
}

function loginUser(){
  const email=document.getElementById('regEmail').value;
  const pass=document.getElementById('regPass').value;
  if(users[email] && users[email]===pass){
    document.getElementById('account-msg').innerText='ログイン成功';
  }else{
    document.getElementById('account-msg').innerText='メールまたはパスワードが違います';
  }
}

// --- 全履歴リセット ---
function resetAll(){
  noticeHistory=[]; quakeHistory=[]; tsunamiHistory=[];
  localStorage.setItem('noticeHistory',JSON.stringify(noticeHistory));
  localStorage.setItem('quakeHistory',JSON.stringify(quakeHistory));
  localStorage.setItem('tsunamiHistory',JSON.stringify(tsunamiHistory));
  loadHistory(); loadQuakeHistory(); loadTsunamiHistory();
}

// --- 天気 ---
function getWeather(){
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tokyo,jp&appid=${API_KEY}&lang=ja&units=metric`)
  .then(r=>r.json())
  .then(data=>{
    document
