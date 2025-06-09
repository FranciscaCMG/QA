document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("auth", "true"); // <- Aquí
          alert("✅ Login exitoso. Redirigiendo... hols");
          window.location.href = "index.html";
        } else {
          alert("❌ Credenciales incorrectas");
        }
      })
      .catch((error) => {
        console.error("Error al conectar con el servidor:", error);
        alert("Ocurrió un error de conexión.");
      });
  });
});
