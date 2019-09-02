// Creamos un objeto con los parámetros de conexión.
const config = {
    db: {
        host: '172.22.0.2',
        user: 'postgres',
        password: 'postgres',
        database: 'data',
        port: 5432,
    }
};

// Usamos este objeto para que el código sea accesible desde cualquier parte de nuestra aplicación
module.exports = config;