const productController = require("../controllers/product.controller");

module.exports = (server) => {
    // Definierar olika routes för CRUD-operatiner
    server.route([
        // GET-route, hämtar alla produkter från tabellen
        {
            method: "GET",
            path: "/products",
            handler: productController.getAllproducts,
            options: {
                auth: false
            }
        },
        // GET, hämtar en produkt från tabellen med avgivet id
        {
            method: "GET",
            path: "/products/{id}",
            handler: productController.getOneProduct,
            options: {
                auth: false
            }
        },
        // POST-route, lägger till data (produkt) till tabellen
        {
            method: "POST",
            path: "/products",
            handler: productController.postNewProduct
        },
        // PUT-route, uppdaterar data (en produkt) med angivet id
        {
            method: "PUT",
            path: "/products/{id}",
            handler: productController.updateOneProduct
        },
        // DELETE-route, raderar en produkt i tabellen med angivet id
        {
            method: "DELETE",
            path: "/products/{id}",
            handler: productController.deleteOneProduct
        }
    ]);
};