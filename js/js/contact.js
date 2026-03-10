function send(){
  let email = document.getElementById("email").value;
  let nickname = document.getElementById("nickname").value;
  let message = document.getElementById("message").value;
  let check = document.getElementById("robotCheck").value;

  // ロボット確認（ランダム数字の1つに合致するか）
  if(!["209","231","255","235","217","257"].includes(check)){
    alert("ロボット確認が間違っています");
    return;
  }

  alert(`依頼を送信しました！\n受信先: ekinetto7@gmail.com\nメール: ${email}\nニックネーム: ${nickname}`);
}
