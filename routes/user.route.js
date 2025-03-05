const userController = require('../controllers/user.controller');

module.exports = (server) => {
    // GET-route för att hämta alla användare
    server.route({
        method: 'GET',
        path: '/users',
        handler: userController.getAllUsers,
        options: {
            auth: false // ingen autentisering
        }
    });

    server.route({
        // Get-route för att hämta en specifik användare med avgivet id
        method: 'GET',
        path: '/users/{id}',
        handler: userController.getUserById,
        options: {
            auth: false // ingen autentisering
        }
    });

    server.route({
        // POST-route för användarinloggning
        method: 'POST',
        path: '/users/login',
        handler: userController.loginUser, // Validering görs i controllern
        options: {
            auth: false // ingen autentisering
        }
    });

    server.route({
        // GET-route för att logga ut en användare
        method: "GET",
        path: "/users/logout",
        handler: userController.logoutUser,
        options: {
            auth: false
        }
    });

    server.route({
        // POST route för att skapa en ny användare
        method: 'POST',
        path: '/users',
        handler: userController.createUser,
        options: {
            auth: false // ingen autentisering
        }
    });

    server.route({
        // PUT-route för att uppdatera användarens info
        method: 'PUT',
        path: '/users/{id}',
        handler: userController.updateUser,
        options: {
            auth: false
        }
    });

    server.route({
        // DELETE-route för att radera en användare
        method: 'DELETE',
        path: '/users/{id}',
        handler: userController.deleteUser,
        options: {
            auth: false
        }
    });

    // kontrollerar inloggad användare 
    server.route({
        method: "GET",
        path: "/checkUser",
        handler: userController.checkUser,
        options: {
            auth: "session"
        }
    });
};