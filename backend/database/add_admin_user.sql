SET NAMES utf8mb4;
USE rehearsal_rooms;

-- Insertar usuario admin
INSERT INTO users (username, email, password, role)
VALUES (
    'admin',
    'admin@example.com',
    '$2b$10$uEhNBPqay2AIPvMUj1eci.Gd6kRcdSeyT5UPQB6tkf6vYkujaYkk.', -- hash de Admin123!
    'admin'
);

-- Insertar usuario normal
INSERT INTO users (username, email, password, role)
VALUES (
    'user',
    'user@example.com',
    '$2b$10$bC3Tv3aw36PFrgfaGSYCE.Q0zIF5zdscoGZtSD2Z.gQBANW/Af9oa', -- hash de User123!
    'user'
);