function playKimitsu(){
  const audio = document.getElementById("melody");
  audio.src = "kimitsu2.mp3";
  audio.play();
}

function playKimitsu2(){
  const audio = document.getElementById("melody");
  audio.src = "kimitsu3.mp3";
  audio.play();
}

function stopMelody(){
  const audio = document.getElementById("melody");
  audio.pause();
  audio.currentTime = 0;
}
