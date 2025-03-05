const Product = require("../models/product.model");
const mongoose = require("mongoose");

// Controller för att hämta alla produkter (böcker)
exports.getAllproducts = async (request, h) => {
    // sökfunktion
    const { search } = request.query;
    let query = {}; // tomt som standard

    if (search) {
        query = { model: { $regex: search, $options: "i" } }; // filtrering
    }

    try {
        const products = await Product.find(query, { _v: 0 }); // Hämtar alla böcker

        if (products.length === 0) {
            return h.response({ message: "Inga böcker hittades." }).code(404);
        }

        return h.response(products).code(200);
    } catch (error) {
        console.error("Fel vid hämtning av böcker.");
        return h.response(error).code(500);
    }
};

// Controller för att hämta en produkt/bok
exports.getOneProduct = async (request, h) => {
    try {
        const { id } = request.params;

        // kontrollera om ID:t är giltigt
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return h.response({ message: "Ogiltigt ID-format" }).code(400);
        }

        const product = await Product.findById(id);

        // kontrollera att produkten finns
        if (!product) {
            return h.response({ message: "Boken med det angivna ID:t hittades inte." }).code(404);
        }

        return h.response(product).code(200);
    } catch (error) {
        console.error("Något gick fel vid hämtning av boken: ", error);
        return h.response({ message: "Internt serverfel." }).code(500);
    }
};

// Controller för att lägga till en ny produkt/bok
exports.postNewProduct = async (request, h) => {
    try {
        // Skapar/lägger till en ny bok
        const product = new Product(request.payload);
        const savedProduct = await product.save(); // Sparar bok

        return h.response({
            message: "En ny bok har lagts till.",
            addedProduct: savedProduct
        }).code(201);
    } catch (error) {
        // vid valideringsfel 
        if (error.name === "ValidationError") {
            // samlar in Mongoose-valideringsfel och returnerar
            const errors = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return h.response({ errors }).code(400);
        }
        console.error("Något gick fel vid skapande av ny bok: ", error);
        return h.response(error).code(500);
    }
};

// Controller för att uppdatera en produkt/bok
exports.updateOneProduct = async (request, h) => {
    try {
        const { id } = request.params;

        // kontrollera om ID är giltigt
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return h.response({ message: "Ogiltigt ID-format." }).code(400);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            request.payload,
            { new: true, runValidators: true } // valideringar körs
        );

        if (!updatedProduct) {
            return h.response({
                message: "Boken med det angivna ID:et hittades inte."
            }).code(404);
        }

        return h.response({
            message: "Boken har uppdaterats.",
            updatedProduct
        }).code(200);
    } catch (error) {
        console.error("Ett oväntat fel inträffade vid uppdatering: ", error);
        return h.response({ message: "Internt serverfel." }).code(500);
    }
};

// Controller för att radera en produkt/bok
exports.deleteOneProduct = async (request, h) => {
    try {
        const { id } = request.params;

        // kontrollera om ID:t är giltigt
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return h.response({ message: "Ogiltigt ID-format" }).code(400);
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return h.response({ message: "Boken med det angivna ID:t hittades inte." }).code(404);
        }

        return h.response({ message: "Boken har raderats." }).code(200);
    } catch (error) {
        console.error("Något gick fel vid radering av bok: ", error);
        return h.response({ message: "Internt serverfel." }).code(500);
    }
};