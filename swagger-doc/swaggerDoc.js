const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    swaggerDefinition: {
        info: {
            title: "RAVI Node JS Task Project",
            version: "1.0.0",
            description: "RAVi Node JS Task Project"
        },
        basePath: "/",
    },
    apis: ["routes/routes.js"],
}

const specs = swaggerJsDoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
}