-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Create organizations table
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create parishes table
create table parishes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  location geometry(Point, 4326),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
