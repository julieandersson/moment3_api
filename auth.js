const Cookie = require('@hapi/cookie');
const Jwt = require('@hapi/jwt');
require("dotenv").config();

module.exports = {
    register: async (server) => {
        await server.register([Cookie, Jwt]);

        // Registrera cookie-strategi
        server.auth.strategy('session', 'cookie', {
            cookie: {
                name: 'jwt', 
                password: process.env.COOKIE_PASSWORD,
                isSecure: true, //https
                path: '/',
                ttl: 24 * 60 * 60 * 1000, // 24 timmar
                isSameSite: 'None',
                clearInvalid: true,
                isHttpOnly: true
            },
            // validera HTTP-cookie
            validate: async (request, session) => {
                try {
                    const token = session; // hämta token

                    if (!token) {
                        console.warn("Ingen token hittades.")
                        return { isValid: false };
                    }
                    // decode och verifiering av jwttoken
                    const artifacts = Jwt.token.decode(token);

                    try {
                        Jwt.token.verify(artifacts, {
                            key: process.env.JWT_SECRET_KEY,
                            algorithms: ['HS256']
                        });

                        return {
                            isValid: true,
                            credentials: artifacts.decoded.payload
                        };
                        // fel vid verifiering
                    } catch (err) {
                        console.error('Fel vid token-verifiering:', err.message);
                        return { isValid: false };
                    }
                } catch (err) {
                    // fel vid validering
                    console.error('Valideringsfel:', err.message);
                    return { isValid: false };
                }
            }
        });

        server.auth.default('session');
    }
};