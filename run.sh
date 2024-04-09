#!/bin/bash

# Start PostgreSQL database (adjust as needed)
# You can start your PostgreSQL server using Docker or any other method you prefer
# Example using Docker:
# docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres:latest

# Start Rust backend
cd backend
cargo build
cargo run &

# Start Next.js frontend
cd ../frontend
pnpm install
pnpm run dev

