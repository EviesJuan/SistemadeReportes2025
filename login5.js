document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error");

  if (username === "desarrollo" && password === "030303") {
    localStorage.setItem("loggedIn5", "true");
    window.location.href = "form5.html";
  } else {
    errorMsg.style.display = "block";
  }
});

