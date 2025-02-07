# Use the latest stable Rust version to build the project
FROM rust:1.84.0 AS builder

# Set the working directory inside the container
WORKDIR /usr/src/travels_backend

# Install MariaDB development libraries and system dependencies needed for Diesel MySQL
RUN apt-get update && apt-get install -y \
    libmariadb-dev \
    pkg-config \
    build-essential \
    gcc \
    cmake \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Rust toolchain and Diesel CLI
RUN cargo install diesel_cli --no-default-features --features mysql

# Copy only Cargo files first to leverage Docker's caching for dependencies
COPY Cargo.toml Cargo.lock ./

# Pre-fetch dependencies separately to optimize caching
RUN cargo fetch --locked  

# Copy the entire project directory
COPY . .

# Build the Rust project in release mode
RUN cargo build --release

# Create a minimal runtime image from Debian
FROM debian:bookworm-slim

# Install MariaDB runtime libraries, client, and necessary utilities
RUN apt-get update && apt-get install -y \
    libmariadb3 \
    mariadb-client \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the runtime container
WORKDIR /app

# Copy the compiled binary from the build image
COPY --from=builder /usr/src/travels_backend/target/release/travels_backend /usr/local/bin/travels_backend

# Copy Diesel CLI from the builder stage so it's available in the final image
COPY --from=builder /usr/local/cargo/bin/diesel /usr/local/bin/diesel

# Copy the migration files from the build image
COPY --from=builder /usr/src/travels_backend/migrations /app/migrations

# Ensure Diesel CLI is accessible globally
ENV PATH="/usr/local/bin:${PATH}"

# Expose port 8000 to access the backend
EXPOSE 8000

# Command to run the backend
CMD ["/usr/local/bin/travels_backend"]