document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  fetch('../data/users.json')
    .then((res) => res.json())
    .then((data) => {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const msgDiv = document.getElementById("loginMessage");

        const user = data.find((u) => u.email === email && u.password === password);

        if (user) {
          localStorage.setItem("auth", "true");

          msgDiv.textContent = "✅ Login exitoso. Redirigiendo...";
          msgDiv.style.display = "block";
          msgDiv.style.color = "green";

          setTimeout(() => {
            window.location.href = "index.html";
          }, 1500);
        } else {
          msgDiv.textContent = "❌ Credenciales incorrectas";
          msgDiv.style.display = "block";
          msgDiv.style.color = "red";

          document.getElementById("password").value = "";
          document.getElementById("email").value=""; 

          setTimeout(() => {
            msgDiv.style.display = "none";
          }, 3000);
        }
      });
    })
    .catch((error) => {
      console.error("Error al cargar el archivo JSON:", error);
    });
});
