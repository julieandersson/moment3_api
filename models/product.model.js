const Mongoose = require("mongoose"); // Importerar mongoose för databasen

// mongoose-schema med validering för produkter (bokhandel)
const productSchema = Mongoose.Schema(
    {
    // titel
    title: {
        type: String,
        required: [true, "Du måste ange bokens titel."]
    },
    // författare
    author: {
        type: String,
        required: [true, "Du måste ange bokens författare."]
    },
    // beskrivning av boken
    description: {
        type: String,
        required: [true, "Du måste ange en beskrivning av boken."]
    },
    // pris på boken
    price: {
        type: Number,
        required: [true, "Du måste ange ett pris på boken."],
        min: [0, "Priset kan inte vara mindre än 0."]
    },
    // Utgivningsår
    releaseYear: {
        type: Number,
        required: [true, "Du måste ange utgivningsåret."],
        min: [1440, "Utgivningsåret måste vara 1440 eller senare."],
        max: [new Date().getFullYear(), "Utgivningsåret kan inte vara i framtiden."]
    },
    // antal i lager
    amountInStock: {
        type: Number,
        required: [true, "Du måste ange hur många antal som finns i lager."],
        min: [0, "Du kan inte ange ett längre antal än 0."]
    }
});

// skapar mongoose-modell för produkter baserat på det definierade schemat
const Product = Mongoose.model("Product", productSchema);

// Exporterar modellen för användning i andra filer
module.exports = Product;