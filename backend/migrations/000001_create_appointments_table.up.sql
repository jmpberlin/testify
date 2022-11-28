CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    duration integer NOT NULL DEFAULT 5,
    service text NOT NULL DEFAULT 'Schnelltest'::text,
    result boolean NOT NULL DEFAULT false,
    address_name text NOT NULL,
    street_name text NOT NULL,
    street_number text NOT NULL,
    zip_code text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT now(),
    updated_at timestamp(0) with time zone NOT NULL DEFAULT now(),
    start_time timestamp(0) with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX appointments_pkey ON appointments(id int8_ops);
