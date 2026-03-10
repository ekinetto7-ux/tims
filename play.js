let company = localStorage.getItem("selectedCompany");
let line = localStorage.getItem("selectedLine");
let station = localStorage.getItem("selectedStation");
let track = localStorage.getItem("selectedTrack");

document.getElementById("info").innerText = `${company} / ${line} / ${station} / ${track}番線`;

let audio = null;

function play(){
  if(audio){ audio.pause(); audio.currentTime=0; } // 以前の音をリセット
  audio = new Audio(`sounds/${company}/${line}/${station}/${track}.mp3`);
  audio.loop = true; // ループON
  audio.play();

  // 簡易再生エフェクト
  let btn = document.querySelector("button");
  btn.style.transform="scale(1.2)";
  setTimeout(()=>{ btn.style.transform="scale(1)"; }, 500);
}

function stop(){
  if(audio){
    audio.pause();
    audio.currentTime = 0;
  }
}

function favorite(){
  let user = localStorage.getItem("loginUser");
  if(!user){ alert("お気に入り登録はログインが必要です"); return; }
  let list = JSON.parse(localStorage.getItem(user+"_fav")||"[]");
  let id = `${company}_${line}_${station}_${track}`;
  if(!list.includes(id)) list.push(id);
  localStorage.setItem(user+"_fav", JSON.stringify(list));
  alert("お気に入り登録しました");
}
