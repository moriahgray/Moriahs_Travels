# ---- Build Stage ----
    FROM rust:1.84.0 AS builder

    # Set the working directory
    WORKDIR /usr/src/travels_backend
    
    # Install dependencies for Diesel and MariaDB
    RUN apt-get update && apt-get install -y libmariadb-dev mariadb-client pkg-config curl && rm -rf /var/lib/apt/lists/*
    
    # Install Diesel CLI for migrations
    RUN cargo install diesel_cli --no-default-features --features mysql
    
    # Copy only Cargo files first for better Docker layer caching
    COPY Cargo.toml Cargo.lock ./
    
    # Fetch dependencies separately to optimize caching
    RUN cargo fetch --locked  
    
    # Copy the full project directory
    COPY . .
    
    # Compile in debug mode for development
    RUN cargo build
    
    # ---- Runtime Stage (Used for Deployment) ----
    FROM debian:bookworm-slim AS runtime
    
    # Install required runtime dependencies
    RUN apt-get update && apt-get install -y libmariadb3 mariadb-client ca-certificates && rm -rf /var/lib/apt/lists/*
    
    # Copy the built binary from the builder stage
    COPY --from=builder /usr/src/travels_backend/target/debug/travels_backend /usr/local/bin/travels_backend
    
    # Set working directory
    WORKDIR /usr/src/travels_backend
    
    # Expose API port
    EXPOSE 8000
    
    # Start the server
    CMD ["/usr/local/bin/travels_backend"]    