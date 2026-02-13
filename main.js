const melody = document.getElementById("melody");

function playKimitsu(){
  melody.src = "Verde_Rayo_endless.mp3";
  melody.currentTime = 10;
  melody.play().catch(()=>{});
}

function playKimitsu2(){
  melody.src = "Verde_Rayo.mp3";
  melody.currentTime = 0;
  melody.play().catch(()=>{});
}

function stopMelody(){
  melody.pause();
  melody.currentTime = 0;
}
