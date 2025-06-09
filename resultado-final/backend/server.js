const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors()); // permite solicitudes desde frontend local
app.use(express.json()); // para leer body en JSON

// Ruta POST para login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Cargar usuarios desde archivo
  const users = JSON.parse(fs.readFileSync('users.json'));

  // Buscar usuario válido
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.status(200).json({ message: "Login correcto" });
  } else {
    res.status(401).json({ message: "Credenciales inválidas" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Leer usuarios actuales
  const users = JSON.parse(fs.readFileSync('users.json'));

  // Verificar si ya existe
  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(409).json({ message: "El usuario ya existe." });
  }

  // Agregar nuevo usuario
  users.push({ email, password });

  // Guardar archivo actualizado
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

  res.status(201).json({ message: "Registro exitoso." });
});

