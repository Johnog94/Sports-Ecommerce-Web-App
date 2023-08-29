// Initialize an array to store user data
const users = [];

// Function to create a new user and store it in the users array
function createUser(username, password){
    users.push({ username, password});
    console.log(users); // Log the current state of the users array
}

// Function to authenticate a user based on their username and password
function authenticateUser(username, password){
    // Find the user with the given username in the users array
    const user = users.find(user => user.username === username);

    // If the user is not found or the provided password does not match, return false
    if(!user || user.password !== password ) {
        return false;
    }
    // If the username and password match, return true
    return true;
}

// Export the createUser and authenticateUser functions for use in other modules
module.exports = { createUser, authenticateUser };