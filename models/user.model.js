const Mongoose = require("mongoose"); // Importerar mongoose för databasen
const bcrypt = require("bcrypt"); // importerar bcrypt för att hasha lösenord

// mongoose-schema för användare
const userSchema = new Mongoose.Schema({
    email: {
        type: String,
        required: [true, "Du måste ange en e-postadress."],
        unique: true, // säkerställer att ingen annan användare har samma epost
        lowercase: true, // konverterar epost automatiskt till små bokstäver
        match: [/.+@.+\..+/, "Du måste ange en giltig e-postadress."] // validerar att epost är i korrekt format
    },
    password: {
        type: String,
        required: [true, "Du måste ange ett lösenord."],
        minlength: [8, "Lösenordet måste bestå utav minst 8 tecken."], // minst 8 tecken långt
        match: [/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Lösenordet måste bestå utav minst en bokstav och en siffra."] // validerar att lösenordet innehåller minst en bokstav å en siffra
    }
}, { timestamps: true });

// hashar lösenord före sparning
userSchema.pre("save", async function(next) {
    // om lösenord inte har ändrats, gå vidare utan att hasha igen
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); // hashar lösenord
        next();
    } catch (error) {
        next(error); // om något går fel
    }
});

// metod för att jämföra lösenord
userSchema.methods.comparePassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password); // returnerar true om lösenorden matchar
    } catch(error) {
        throw error; // kastar fel om något blir fel
    }
}

// skapar och exporterar modellen baserat på user-schemat
const User = Mongoose.model("User", userSchema)

module.exports = User;