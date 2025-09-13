import * as userRepository from "../repositories/userRepository.js";

// Obtener todos los usuarios (solo admin)
export async function getAllUsers(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Solo el administrador puede ver todos los usuarios" });
    }
    const users = await userRepository.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
}

// Actualizar nombre de usuario y teléfono del perfil
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { username, telefono } = req.body;
    if (!username || !telefono) {
      return res
        .status(400)
        .json({ error: "Nombre de usuario y teléfono son obligatorios" });
    }
    // Comprobar si el username ya está en uso por otro usuario
    const existingUsername = await userRepository.findUserByUsername(username);
    if (existingUsername && existingUsername.id !== userId) {
      return res
        .status(400)
        .json({ error: "El nombre de usuario ya está en uso" });
    }
    // Comprobar si el teléfono ya está en uso por otro usuario
    const existingTelefono = await userRepository.findUserByTelefono(telefono);
    if (existingTelefono && existingTelefono.id !== userId) {
      return res.status(400).json({ error: "El teléfono ya está en uso" });
    }
    const updated = await userRepository.updateUserProfile(userId, {
      username,
      telefono,
    });
    if (!updated) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
}

// Actualizar cualquier usuario (solo admin)
export async function updateUserById(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Solo el administrador puede editar usuarios" });
    }
    const { id } = req.params;
    const { username, email, nombre, apellidos, telefono, role } = req.body;
    if (!username || !email || !nombre || !apellidos || !telefono || !role) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    // Validar unicidad de username, email y telefono (excepto el propio usuario)
    const existingUsername = await userRepository.findUserByUsername(username);
    if (existingUsername && existingUsername.id != id) {
      return res
        .status(400)
        .json({ error: "El nombre de usuario ya está en uso" });
    }
    const existingEmail = await userRepository.findUserByEmail(email);
    if (existingEmail && existingEmail.id != id) {
      return res.status(400).json({ error: "El email ya está en uso" });
    }
    const existingTelefono = await userRepository.findUserByTelefono(telefono);
    if (existingTelefono && existingTelefono.id != id) {
      return res.status(400).json({ error: "El teléfono ya está en uso" });
    }
    const updated = await userRepository.updateUserById(id, {
      username,
      email,
      nombre,
      apellidos,
      telefono,
      role,
    });
    if (!updated) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
}

// Comprobar disponibilidad de nombre de usuario (para validación en tiempo real)
export async function checkUsernameAvailability(req, res) {
  try {
    const { username } = req.query;
    if (!username) {
      return res
        .status(400)
        .json({ error: "El nombre de usuario es obligatorio" });
    }
    const existing = await userRepository.findUserByUsername(username);
    res.json({ available: !existing });
  } catch (error) {
    res.status(500).json({ error: "Error al comprobar disponibilidad" });
  }
}
