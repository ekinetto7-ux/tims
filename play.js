let company = localStorage.getItem("selectedCompany");
let line = localStorage.getItem("selectedLine");
let station = localStorage.getItem("selectedStation");
let track = localStorage.getItem("selectedTrack");

document.getElementById("info").innerText = `${company} / ${line} / ${station} / ${track}番線`;

function play(){
  let audio = new Audio(`sounds/${company}/${line}/${station}/${track}.mp3`);
  audio.play();

  // 簡易波形アニメーション
  let btn = document.querySelector("button");
  btn.style.transform="scale(1.2)";
  setTimeout(()=>{ btn.style.transform="scale(1)"; }, 500);
}
