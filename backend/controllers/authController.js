import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/userRepository.js";

export async function register(req, res) {
  try {
    const { username, email, password, nombre, apellidos, telefono, role } =
      req.body;

    if (
      !username ||
      !email ||
      !password ||
      !nombre ||
      !apellidos ||
      !telefono
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const existingEmail = await userRepository.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    const existingUsername = await userRepository.findUserByUsername(username);
    if (existingUsername) {
      return res
        .status(400)
        .json({ error: "El nombre de usuario ya está en uso" });
    }
    const existingTelefono = await userRepository.findUserByTelefono(telefono);
    if (existingTelefono) {
      return res.status(400).json({ error: "El teléfono ya está en uso" });
    }

    const userId = await userRepository.createUser({
      username,
      email,
      password,
      nombre,
      apellidos,
      telefono,
      role,
    });
    res
      .status(201)
      .json({ message: "Usuario registrado con éxito", id: userId });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        nombre: user.nombre,
        apellidos: user.apellidos,
        telefono: user.telefono,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

export async function updatePassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Debes proporcionar la contraseña actual y la nueva contraseña",
      });
    }
    const user = await userRepository.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "La contraseña actual no es correcta" });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({
          error: "La nueva contraseña debe tener al menos 8 caracteres",
        });
    }
    const hashed = await hash(newPassword, 10);
    await userRepository.updateUserPassword(userId, hashed);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la contraseña" });
  }
}
