# Use the official Rust image to build the project
FROM rust:1.56 as builder

# Set the working directory inside the container
WORKDIR /usr/src/travels_backend

# Copy the source code into the container
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
CMD ["travels_backend"]