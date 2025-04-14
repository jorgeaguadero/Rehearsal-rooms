USE rehearsal_rooms;

-- Insertar usuario admin
INSERT INTO users (username, email, password, role)
VALUES (
    'admin',
    'admin@example.com',
    '$2b$10$eL5SLumJ5POf1ZJfac4cYukLm8jgTnZbA8WxgBEqcGxej35TLK0f6', -- bcrypt hash de 'admin123'
    'admin'
);

-- Insertar usuario normal
INSERT INTO users (username, email, password, role)
VALUES (
    'user',
    'user@example.com',
    '$2b$10$I4yHX9vHxlhAw0S0hXB4tuL30SN9NYE6i8N1Ww6HLowzp.eV/354.', -- bcrypt hash de 'user123'
    'user'
);