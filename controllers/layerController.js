// layerController.js

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

// Callback que retorna los datos de la consulta

// Almancenamos en una constante la función que realiza la llamada y devuelve el archivo.
const getGeojson = (request, response, next) => {

    // Creamos una variable para almacenar el valro del parámetro con el nombre de la capa
    let layername = request.params.layername;

    // Almacenamos la consulta SQL añadiendo la variable mediante template literals

    let queryLayer = `SELECT  id,  st_x(geom ) as lng, st_y(geom ) as lat, nombre,  tipo,  cod_mun,  municipio,  provincia FROM ${layername};`

    pool.query(queryLayer, (err, res) => {
        if (err) {

            // return console.error('Error ejecutando la consulta. ', err.stack)

            console.error('Error ejecutando la consulta. ', err.stack)

            // Mensaje de aviso si no se ha encontrado al capa con el nombre indicado 
            return response.json({
                mensaje: `La capa ${layername} no existe en la base de datos`
            })
        }
        let geojson = GeoJSON.parse(res.rows, { Point: ['lat', 'lng'] });

        response.json(geojson);
    })
}

// Función para obtener el listado de capas
const getLayersList = (request, response, next) => {

    let queryLayers = `SELECT f_table_name as layername, coord_dimension, srid, type FROM public.geometry_columns;`

    pool.query(queryLayers, (err, res) => {
        if (err) {
            // return console.error('Error ejecutando la consulta. ', err.stack)
            console.error('Error ejecutando la consulta. ', err.stack)
            // Mensaje de aviso si no se ha encontrado al capa con el nombre indicado 
            return response.json({
                mensaje: `No capas geográficas en la base de datos`
            })
        }
        response.json(res.rows);
    })
}

// Exportamos las funciones para ser usadas dentro de la aplicación
module.exports = { 
    getGeojson,
    getLayersList
} 
