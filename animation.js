function setStep(step){
  let steps = document.querySelectorAll(".step");
  steps.forEach((el,i)=>{
    if(i<step) el.classList.add("active");
    else el.classList.remove("active");
  });
}

function navigate(url){
  document.body.style.opacity=0;
  setTimeout(()=>{ window.location.href=url; }, 300);
}
