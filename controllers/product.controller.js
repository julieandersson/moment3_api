const Product = require("../models/product.model");

// Controller för att hämta alla produkter (böcker)
exports.getAllproducts = async (request, h) => {
    try {
        const products = await Product.find(); // Hämtar alla böcker

        if (products.length === 0) { // Om det inte finns någon data
            return h.response({
                statusCode: 404,
                error: "Not Found",
                message: "Inga böcker hittades.",
            }).code(404);
        }

        return h.response(products).code(200); // Om det finns data, returnera listan med alla böcker
    } catch (error) {
        console.error("Fel vid hämtning av böcker:", error);
        return h.response({
            message: "Kunde inte hämta böcker, försök igen senare.",
            error: error.message,
        }).code(500); // Felmeddelande 500
    }
};

// Controller för att hämta en produkt/bok
exports.getOneProduct = async (request, h) => {
    try {
        const product = await Product.findById(request.params.id);
        return product || h.response("Boken med det angivna ID:et hittades inte").code(404);
    } catch (err) {
        return h.response(err).code(500);
    }
};

// Controller för att lägga till en ny produkt/bok
exports.postNewProduct = async (request, h) => {
    try {
        // Skapar en ny resa
        const product = new Product(request.payload);
        const savedProduct = await product.save(); // Sparar produkt

        // Bekräftelsemeddelande
        return h.response({
            statusCode: 201,
            message: "En ny bok har lagts till.",
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

// Controller för att uppdatera en produkt/bok
exports.updateOneProduct = async (request, h) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            request.params.id, // ID på boken som ska uppdateras
            request.payload, // Den nya datan som skickats
            { new: true } // Returnera den uppdaterade boken
        );

        if (!updatedProduct) {
            return h.response({
                statusCode: 404,
                error: "Not Found",
                message: "Boken med det angivna ID:et hittades inte." // Om boken ej hittas
            }).code(404);
        }

        return h.response({
            statusCode: 200,
            message: "Boken har uppdaterats.", // Bekräftelsemeddelande om uppdateringen lyckas
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

// Controller för att radera en produkt/bok
exports.deleteOneProduct = async (request, h) => {
    try {
        // Tar bort boken baserat på ID
        const product = await Product.findByIdAndDelete(request.params.id);

        // Om boken inte hittas
        if (!product) {
            return h.response({
                statusCode: 404,
                error: "Not Found",
                // Skickar anpassat felmeddelande
                message: "Boken med det angivna ID:et hittades inte."
            }).code(404);
        }

        // Om raderingen lyckades
        return h.response({
            statusCode: 200,
            // Skickar bekräftelsemeddelande
            message: "Boken har raderats.",
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