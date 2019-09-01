// Creamos un objeto con los parámetros de conexión.
const config = {
    db: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'postgres',
        database: 'data',
        port: 5432,
    }
};

// Usamos este objeto para que el código sea accesible desde cualquier parte de nuestra aplicación
module.exports = config;