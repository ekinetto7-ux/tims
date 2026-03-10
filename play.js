let company = localStorage.getItem("selectedCompany");
let line = localStorage.getItem("selectedLine");
let station = localStorage.getItem("selectedStation");
let track = localStorage.getItem("selectedTrack");

document.getElementById("info").innerText = `${company} / ${line} / ${station} / ${track}番線`;

let audio = null;

function play(){
  if(audio){ audio.pause(); audio.currentTime=0; }
  audio = new Audio(`sounds/${company}/${line}/${station}/${track}.mp3`);
  audio.loop = true;
  audio.play();
}

function stop(){
  if(audio){
    audio.pause();
    audio.currentTime=0;
  }
}

function favorite(){
  let user = localStorage.getItem("loginUser");
  if(!user){ alert("ログインしてください"); return; }
  let list = JSON.parse(localStorage.getItem(user+"_fav")||"[]");
  let id = `${company}_${line}_${station}_${track}`;
  if(!list.includes(id)) list.push(id);
  localStorage.setItem(user+"_fav", JSON.stringify(list));
  alert("お気に入り登録しました");
}
