import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/index.js";

export async function register(req, res) {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const userId = await userRepository.createUser({
      username,
      email,
      password,
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

    const isMatch = await compare(password, user.passwordHash);
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
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}
