alter table members
add column address text,
add column emergency_contact text,
add column shoe_size integer,
add column shirt_size text,
add column member_id integer generated always as identity unique;