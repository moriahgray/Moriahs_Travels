use keyring::Entry;
use std::io::{self, Write};

const SERVICE_NAME: &str = "moriahsTravels";
const USERNAME: &str = "root";

// Function to store the database password securely
pub fn store_password() {
    print!("Enter your database password: ");
    io::stdout().flush().unwrap();
    let mut password = String::new();
    io::stdin().read_line(&mut password).unwrap();
    let password = password.trim();

    let entry = Entry::new(SERVICE_NAME, USERNAME).expect("Failed to create keyring entry");
    entry.set_password(password).expect("Failed to store password");

    println!("Password stored securely.");
}

// Function to retrieve the stored database password
pub fn get_password() -> String {
    let entry = Entry::new(SERVICE_NAME, USERNAME).expect("Failed to create keyring entry");
    entry.get_password().expect("Failed to retrieve password")
}

// Function to remove the stored password (if needed)
pub fn delete_password() {
    let entry = Entry::new(SERVICE_NAME, USERNAME).expect("Failed to create keyring entry");
    entry.delete_password().expect("Failed to delete password");
    println!("Password deleted successfully.");
}