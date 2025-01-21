# Use the latest stable Rust version
FROM rust:1.84.0 as builder

# Set the working directory inside the container
WORKDIR /usr/src/travels_backend

# Copy only Cargo files first to leverage Docker's caching for dependencies
COPY Cargo.toml Cargo.lock ./

# Pre-fetch dependencies separately to optimize caching
RUN cargo fetch --locked  

# Copy the entire project directory
COPY . .

# Build the Rust project in release mode
RUN cargo build --release

# Create a minimal runtime image from Debian
FROM debian:bullseye-slim

# Copy the compiled binary from the build image
COPY --from=builder /usr/src/travels_backend/target/release/travels_backend /usr/local/bin/travels_backend

# Expose port 8080 to access the backend
EXPOSE 8080

# Command to run the backend
CMD ["/usr/local/bin/travels_backend"]