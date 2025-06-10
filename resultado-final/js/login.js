document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  fetch('../data/users.json')
    .then((res) => res.json())
    .then((data) => {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const user = data.find((u) => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem("auth", "true");
          alert("✅ Login exitoso. Redirigiendo...");
          window.location.href = "index.html";
        } else {
          alert("❌ Credenciales incorrectas");
        }
      });
    })
    .catch((error) => {
      console.error("Error al cargar el archivo JSON:", error);
    });
});
