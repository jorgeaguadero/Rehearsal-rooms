SET NAMES utf8mb4;
USE rehearsal_rooms;

-- Insertar salas de prueba
INSERT INTO rooms (name, description, capacity, price_per_hour, image) VALUES
    ('Sala 1', 'Sala con equipo de sonido profesional', 10, 20.00, 'rooms/arcane6.jpg'),
    ('Sala 2', 'Sala con batería y amplificadores', 8, 15.00, 'rooms/bunker1.jpg'),
    ('Sala 3', 'Sala para ensayos acústicos', 6, 12.00, 'rooms/cotton1.jpg');

-- Insertar reservas de prueba (requiere usuario admin o usuarios existentes)
INSERT INTO bookings (user_id, room_id, start_time, end_time, status)
VALUES
    (1, 1, '2025-04-14 10:00:00', '2025-04-14 12:00:00', 'confirmed'),
    (1, 2, '2025-04-15 14:00:00', '2025-04-15 16:00:00', 'pending');