const Product = require("../models/product.model");

// Controller för att hämta alla produkter
exports.getAllproducts = async (request, h) => {
    try {
        const products = await Product.find(); // Hämtar alla produkter

        if (products.length === 0) { // Om det inte finns någon data
            return h.response({
                statusCode: 404,
                error: "Not Found",
                message: "Inga produkter hittades.",
            }).code(404);
        }

        return h.response(products).code(200); // Om det finns data, returnera listan med alla produkter
    } catch (error) {
        console.error("Fel vid hämtning av produkter:", error);
        return h.response({
            message: "Kunde inte hämta produkter, försök igen senare.",
            error: error.message,
        }).code(500); // Felmeddelande 500
    }
};

// Controller för att hämta en produkt
exports.getOneProduct = async (request, h) => {
    try {
        const product = await Product.findById(request.params.id);
        return product || h.response("Produkten med det angivna ID:et hittades inte").code(404);
    } catch (err) {
        return h.response(err).code(500);
    }
};

// Controller för att lägga till en ny produkt
exports.postNewProduct = async (request, h) => {
    try {
        // Skapar en ny resa
        const product = new Product(request.payload);
        const savedProduct = await product.save(); // Sparar produkt

        // Bekräftelsemeddelande
        return h.response({
            statusCode: 201,
            message: "En ny produkt har lagts till.",
            addedProduct: savedProduct // Returnerar den nya produkten
        }).code(201);
    } catch (err) {
        // Oväntade fel
        return h.response({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Ett oväntat fel inträffade."
        }).code(500);
    } 
};

// Controller för att uppdatera en produkt
exports.updateOneProduct = async (request, h) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            request.params.id, // ID på produkten som ska uppdateras
            request.payload, // Den nya datan som skickats
            { new: true } // Returnera den uppdaterade produkten
        );

        if (!updatedProduct) {
            return h.response({
                statusCode: 404,
                error: "Not Found",
                message: "Produkten med det angivna ID:et hittades inte." // Om produkten ej hittas
            }).code(404);
        }

        return h.response({
            statusCode: 200,
            message: "Produkten har uppdaterats.", // Bekräftelsemeddelande om uppdateringen lyckas
            updatedProduct
        }).code(200);
    } catch (err) {
        return h.response({
            // Oväntade fel
            statusCode: 500,
            error: "Internal Server Error",
            message: "Ett oväntat fel inträffade vid uppdatering."
        }).code(500);
    }
};

// Controller för att radera en produkt
exports.deleteOneProduct = async (request, h) => {
    try {
        // Tar bort produkten baserat på ID
        const product = await Product.findByIdAndDelete(request.params.id);

        // Om produkten inte hittas
        if (!product) {
            return h.response({
                statusCode: 404,
                error: "Not Found",
                // Skickar anpassat felmeddelande
                message: "Produkten med det angivna ID:et hittades inte."
            }).code(404);
        }

        // Om raderingen lyckades
        return h.response({
            statusCode: 200,
            // Skickar bekräftelsemeddelande
            message: "Produkten har raderats.",
            deletedProduct: product
        }).code(200);

    } catch (err) {
        // Kontrollerar om felet beror på ett ogiltigt ID
        if (err.name === 'CastError' || err.kind === 'ObjectId') {
            return h.response({
                statusCode: 400,
                error: "Bad Request",
                message: "ID:et är ogiltigt och kunde inte hittas."
            }).code(400);
        }

        // Oväntade fel
        return h.response({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Ett oväntat fel inträffade vid radering."
        }).code(500);
    }
};