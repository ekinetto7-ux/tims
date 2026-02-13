const melody = document.getElementById("melody");

function playKimitsu() {
    melody.src = "Verde_Rayo_endless.mp3";
    melody.pause();
    melody.currentTime = 10;
    melody.play().catch(()=>{});
}

function stopMelody() {
    melody.pause();
    melody.currentTime = 0;
}
