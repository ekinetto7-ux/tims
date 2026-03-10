let company = localStorage.getItem("selectedCompany");
let line = localStorage.getItem("selectedLine");
let station = localStorage.getItem("selectedStation");
let track = localStorage.getItem("selectedTrack");

document.getElementById("info").innerText = `${company} / ${line} / ${station} / ${track}番線`;

function play(){
  let path = `sounds/${company}/${line}/${station}/${track}.mp3`;
  let audio = new Audio(path);
  audio.play();
}

function favorite(){
  let user = localStorage.getItem("loginUser");
  if(!user){
    alert("お気に入り登録はログインが必要です");
    return;
  }
  let list = JSON.parse(localStorage.getItem(user+"_fav")||"[]");
  let id = `${company}_${line}_${station}_${track}`;
  if(!list.includes(id)) list.push(id);
  localStorage.setItem(user+"_fav", JSON.stringify(list));
  alert("お気に入り登録しました");
}
