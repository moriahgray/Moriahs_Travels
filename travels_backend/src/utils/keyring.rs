use keyring::Entry;
use std::io::{self, Write};

const SERVICE_NAME: &str = "moriahsTravels";
const USERNAME: &str = "root";

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

pub fn get_password() -> String {
    match Entry::new(SERVICE_NAME, USERNAME) {
        Ok(entry) => match entry.get_password() {
            Ok(password) => password,
            Err(_) => {
                eprintln!("Failed to retrieve password from keyring.");
                std::process::exit(1);
            }
        },
        Err(_) => {
            eprintln!("Failed to create keyring entry.");
            std::process::exit(1);
        }
    }
}

pub fn delete_password() {
    let entry = Entry::new(SERVICE_NAME, USERNAME).expect("Failed to create keyring entry");
    entry.delete_password().expect("Failed to delete password");
    println!("Password deleted successfully.");
}