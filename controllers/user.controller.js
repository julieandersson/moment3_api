const User = require("../models/user.model");
const mongoose = require("mongoose");
const Jwt = require("@hapi/jwt");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Skapar en ny användare (registering)
exports.createUser = async (request, h) => {
    try {
        const { email, password } = request.payload;

        // kontrollera om e-post redan finns
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return h.response({ message: "E-post används redan" }).code(400);
        }

        // skapar en ny instans av User
        const user = new User({ email, password });

        // validerar användaren innan den sparas
        await user.validate();

        // om valideringen lyckas, spara användaren
        const savedUser = await user.save();

        return h.response({
            message: "Användare skapad",
            user: { email: savedUser.email }
        }).code(201);

    } catch (error) {
        if (error.name === "ValidationError") {
            // samlar in Mongoose-valideringsfel och returnerar
            const errors = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return h.response({ errors }).code(400);
        }

        console.error("Fel vid skapande av användare: ", error);
        return h.response({
            message: "Internt serverfel.",
            error: error.message
        }).code(500);
    }
};

// Hämta alla användare
exports.getAllUsers = async (request, h) => {
    try {
        const users = await User.find();

        if (users.length === 0) {
            return h.response({ message: "Inga användare hittades." }).code(404);
        }

        return h.response(users).code(200);
    } catch (error) {
        console.error("Något gick fel vid hämtning av användare: ", error);
        return h.response(error).code(500);
    }
};


// Hämta en specifik användare baserat på ID
exports.getUserById = async (request, h) => {
    try {
        const { id } = request.params;

        // kontrollera om ID:t är giltigt
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return h.response({ message: "Ogiltigt ID-format" }).code(400);
        }

        const user = await User.findById(id);

        // kontrollera om användaren finns
        if (!user) {
            return h.response({ message: "Användaren hittades inte" }).code(404);
        }

        return h.response(user).code(200);
    } catch (error) {
        console.error("Fel vid hämtning av användare: ", error);
        return h.response({ message: "Internt serverfel." }).code(500);
    }
};

// Uppdatera en användare (utan att tillåta ändring av lösenord)
exports.updateUser = async (request, h) => {
    try {
        const { id } = request.params;

        // kontrollerar om ID:t är giltigt
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return h.response({ message: "Ogiltigt ID-format." }).code(400);
        }

        // tar bort lösenord från payload
        if ("password" in request.payload) {
            delete request.payload.password;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            request.payload,
            {
                new: true,
                runValidators: true,
                context: "query",
                select: "-password"
            }
        );

        if (!updatedUser) {
            return h.response({ message: "Användare hittades inte" }).code(404);
        }

        return h.response({
            message: "Användare har uppdaterats.",
            user: updatedUser
        }).code(200);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return h.response({ errors }).code(400);
        }

        console.error("Fel vid uppdatering av användare: ", error);
        return h.response({ message: "Internt serverfel." }).code(500);
    }
};

// Radera en användare
exports.deleteUser = async (request, h) => {
    try {
        const { id } = request.params;

        // kontrollera om ID är giltigt
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return h.response({ message: "Ogiltigt ID-format" }).code(400);
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return h.response({ message: "Användare hittades inte" }).code(404);
        }

        return h.response({ message: "Användare har raderats" }).code(200);
    } catch (error) {
        console.error("Något gick fel vid radering av användare: ", error);
        return h.response({ message: "Internt serverfel." }).code(500);
    }
};

// Logga in användare och skapa JWT-token
exports.loginUser = async (request, h) => {
    try {
        // hämtar användare
        const { email, password } = request.payload;
        const user = await User.findOne({ email }).select("+password");

        // kontroll så att användare finns
        if (!user) return h.response({ message: "Fel e-post eller lösenord" }).code(401);

        // kontrollera om lösenord är korrekt och jämför med det hashade lösenordet i databasen
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return h.response({ message: "Fel e-post eller lösenord" }).code(401);
        }

        // genererar token
        const token = generateToken({
            _id: user._id,
            email: user.email
        });        

        return h.response({
            message: "Inloggning lyckades!",
            user: { email: user.email }
        }).state("jwt", token); // skapar cookie
    } catch (error) {
        console.error("Inloggning misslyckades: ", error);
        return h.response({ message: error.message }).code(500);
    }
};

// Logga ut användare och ta bort JWT-token från cookie
exports.logoutUser = async (request, h) => {
    try {
        h.unstate("jwt"); // Tar bort cookie
        return h.response({ message: "Du är nu utloggad." }).code(200);
    } catch (error) {
        return h.response({ message: "Utloggning misslyckades" }).code(500);
    }
};

// Kontrollera om användare är inloggad
exports.checkUser = async (request, h) => {
    try {
        if (!request.auth.isAuthenticated) {
            return h.response({ message: "Användare är inte inloggad." }).code(401);
        }

       
        const { user } = request.auth.credentials;

        // returnera användaren direkt
        return h.response({ user }).code(200);
    } catch (error) {
        console.error("Fel vid kontroll av inloggning: ", error);
        return h.response({ message: error.message }).code(500);
    }
};

// Funktion för att generera JWT-token 
const generateToken = userPayload => {
    const token = Jwt.token.generate(
        { user: userPayload },
        { key: process.env.JWT_SECRET_KEY, algorithm: 'HS256' },
        { ttlSec: 24 * 60 * 60 }
    );
    return token;
};