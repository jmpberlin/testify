CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    hashed_password text NOT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT now(),
    active boolean NOT NULL DEFAULT true,
    role text NOT NULL DEFAULT 'employee'::text
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX users_pkey ON users(id int8_ops);
CREATE UNIQUE INDEX email_unique ON users(email text_ops);