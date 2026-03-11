// --- 設定 ---
const API_KEY = 'ここにOpenWeatherMapのAPIキー';
let users = JSON.parse(localStorage.getItem('users')) || {};
let adminPass = '20201002Mana';
let noticeHistory = JSON.parse(localStorage.getItem('noticeHistory')) || [];
let quakeHistory = JSON.parse(localStorage.getItem('quakeHistory')) || [];
let tsunamiColors = JSON.parse(localStorage.getItem('tsunamiColors')) || {};
let darkMode = localStorage.getItem('darkMode')==='true';

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

// --- 管理者モード ---
function checkAdmin(){
  const pass = document.getElementById('adminPass').value;
  if(pass===adminPass){openPage('admin');document.getElementById('admin-msg').innerText='';loadHistory();loadQuakeHistory();}
  else{document.getElementById('admin-msg').innerText='パスワードが違います';}
}

function setNotice(){
  const text = document.getElementById('adminText').value;
  document.getElementById('notice').innerText=text;
  noticeHistory.push({text,date:new Date().toLocaleString()});
  localStorage.setItem('noticeHistory',JSON.stringify(noticeHistory));
  notifyAll(text);
  loadHistory();
}

function resetHistory(){
  noticeHistory=[]; quakeHistory=[];
  localStorage.setItem('noticeHistory',JSON.stringify(noticeHistory));
  localStorage.setItem('quakeHistory',JSON.stringify(quakeHistory));
  loadHistory();
  loadQuakeHistory();
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
  }else{document.getElementById('account-msg').innerText='メールまたはパスワードが違います';}
}

// --- 通知 ---
function notifyAll(msg){
  if(Notification.permission==='granted'){
    new Notification('防災ナビ通知', {body:msg});
  }else{Notification.requestPermission();}
}

// --- 天気 ---
function getWeather(){
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tokyo,jp&appid=${API_KEY}&lang=ja&units=metric`)
  .then(r=>r.json())
  .then(data=>{
    document.getElementById('weather-text').innerText=`東京: ${data.weather[0].description}, ${data.main.temp}℃`;
  });
}
getWeather();

// --- 雨雲レーダー ---
function updateRadar(){
  document.getElementById('radar-img').src=`https://tile.openweathermap.org/map/precipitation_new/0/0/0.png?appid=${API_KEY}`;
}
updateRadar();

// --- 津波色設定 ---
function setTsunamiColor(){
  const region = document.getElementById('region-select').value;
  const color = document.getElementById('color-select').value;
  tsunamiColors[region]=color;
  localStorage.setItem('tsunamiColors',JSON.stringify(tsunamiColors));
  updateTsunamiMap();
}
function updateTsunamiMap(){
  for(const region in tsunamiColors){
    const el = document.getElementById(region);
    el.className='map-region '+tsunamiColors[region];
  }
}
updateTsunamiMap();

// --- 地震設定 ---
function setQuake(){
  const loc=document.getElementById('quake-loc').value;
  const shindo=document.getElementById('quake-shindo').value;
  const mag=document.getElementById('quake-mag').value;
  const tsunami=document.getElementById('quake-tsunami').value;
  const q={loc,shindo,mag,tsunami,date:new Date().toLocaleString()};
  quakeHistory.push(q);
  localStorage.setItem('quakeHistory',JSON.stringify(quakeHistory));
  notifyAll(`[地震情報] ${loc} 震度:${shindo} M:${mag} 津波:${tsunami}`);
  loadQuakeHistory();
}
function loadQuakeHistory(){
  const h = document.getElementById('quake-history'); h.innerHTML='';
  quakeHistory.forEach(q=>{
    const div=document.createElement('div'); div.className='history-box';
    div.innerText=`[${q.date}] ${q.loc} 震度:${q.shindo} M:${q.mag} 津波:${q.tsunami}`;
    h.appendChild(div);
  });
}
loadQuakeHistory();

// --- 火山情報取得（デモ） ---
document.getElementById('volcano-info').innerText='現在噴火情報なし（デモ表示）';

// --- 避難所マップ（デモ） ---
const shelterMap = document.getElementById('shelter-map');
shelterMap.innerText = '地図表示（デモ）';
// LeafletやGoogleMaps APIと連携可能
