// layerController.js

// Añadimos el paquete underscore para trabajar con objetos
const _ = require('underscore');

// Mediante la función require llamamos a los módulos que vamos a usar y los almacenamos en variables
const Pool = require('pg').Pool
const GeoJSON = require('geojson');

//  Recuperamos los datos de config.js y los pasamos a variables
const config = require('../config');
const { db: { user, host, database, password, port } } = config;

// Usando el objeto Pool del módulo pg  instanciamos un nuevo objeto que usará las credenciales definidas.
const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
})


// Almancenamos en una constante la función que realiza la llamada y devuelve el archivo.
const getGeojson = (request, response, next) => {

    // Creamos una variable para almacenar el valro del parámetro con el nombre de la capa
    let layername = request.params.layername;

    // Almacenamos la consulta SQL añadiendo la variable mediante template literals
    // La hemos modicado para que sea lo más genérica posible

    let queryLayer = `SELECT  *,  st_x(geom ) as lng, st_y(geom ) as lat FROM ${layername};`

    pool.query(queryLayer, (err, res) => {
        if (err) {

            // return console.error('Error ejecutando la consulta. ', err.stack)
            console.error('Error ejecutando la consulta. ', err.stack)

            // Mensaje de aviso si no se ha encontrado al capa con el nombre indicado 
            return response.json({
                mensaje: `La capa ${layername} no existe en la base de datos`
            })
        }

        // Definimos una nueva variable donde almacenar los datos sin el valor geom
        // Para ellos recorremos el array y usamos omit de undercore para omitirlo.
        let rowNoGeom = [];
        res.rows.forEach(element => {
            let row = _.omit(element, 'geom');
            rowNoGeom.push(row);

        });

        let geojson = GeoJSON.parse(rowNoGeom, { Point: ['lat', 'lng'] });

        response.json(geojson);
    })
}

// Función para obtener metadatos de capas

const getLayersMetadata = (request, response, next) => {

    // Generamos la conuslta añadiendo la función  json_build_object para crear el JSON con las tablas geográficas y sus atributos
    let queryLayers = `SELECT json_build_object(
        'name', t.f_table_name, 
        'coord_dimension', t.coord_dimension, 
        'srid', t.srid, 
        'geom_type', t.type,
        'fields', 
            (SELECT json_agg(json_build_object('field_name', f.column_name, 'field_type', f.udt_name)) 
            FROM information_schema.COLUMNS f WHERE t.f_table_name = f.table_name
            )
        ) as layer FROM geometry_columns t`;

    pool.query(queryLayers, (err, res) => {
        if (err) {
            console.error('Error ejecutando la consulta. ', err.stack)
            return response.json({
                mensaje: `No existe capas geográficas en la base de datos`
            })
        }

        response.json(res.rows);
    })
}

// Exportamos las funciones para ser usadas dentro de la aplicación
module.exports = {
    getGeojson,
    getLayersMetadata,
}

