const Mongoose = require("mongoose"); // Importerar mongoose för databasen

// mongoose-schema med validering för produkter (hudvårdsprodukter)
const productSchema = Mongoose.Schema(
    {
        // namn på produkten
        name: {
          type: String,
          required: [true, "Du måste ange produktens namn."]
        },
        // kategori (endast tillåtna: ansiktskräm, rengöring, serum)
        category: {
          type: String,
          required: [true, "Du måste ange en kategori för produkten."],
          enum: {
            values: ["ansiktskräm", "rengöring", "serum"],
            message: "Kategorin måste vara 'ansiktskräm', 'rengöring' eller 'serum'."
          },
          set: value => value.toLowerCase() // konverterar till små bokstäver
        },
        // märke (brand)
        brand: {
          type: String,
          required: [true, "Du måste ange produktens märke."]
        },
        // pris på produkten
        price: {
          type: Number,
          required: [true, "Du måste ange ett pris på produkten."],
          min: [1, "Priset kan inte vara mindre än 1."]
        },
        // antal i lager
        amountInStock: {
          type: Number,
          required: [true, "Du måste ange hur många produkter som finns i lager."],
          min: [0, "Antalet i lager kan inte vara mindre än 0."]
        }
      }
    );

// skapar mongoose-modell för produkter baserat på det definierade schemat
const Product = Mongoose.model("Product", productSchema);

// Exporterar modellen för användning i andra filer
module.exports = Product;