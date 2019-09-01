//server.js

// Llamamos al módulo Express y lo asignamos a la reasignamos a app
const express = require("express");
const app = express();


// Para las solicitudes (request) de tipo GET a la url raiz (/), la aplicación responde con “Hola Geo API!”. Para cada vía de acceso diferente, responderá con un error 404 Not Found.
app.get('/', function (req, res) {
  res.send('Hola Geo API!');
});

// Importamos el archivo de rutas
const layerRouter = require('./routes/api');

//Mediante la función use añadimos las nuevas rutas a la que le hemos añadido /api
app.use('/api', layerRouter); 

// La aplicación inicia un servidor y escucha las conexiones en el puerto 3000. 
app.listen(3000, () => {
 console.log("API de datos geográficos. El servidor está inicializado en el puerto 3000");
});