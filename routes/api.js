const express = require('express');

// La clase Router permite crear rutas modulares.
const router = express.Router();

// Importamos el archivo del controlador
const layer = require('../controllers/layerController')

// Definimos la ruta para el método GET y añadimos como middleware la función del controlador
// Añadimos al aruta el parámetro layername para ser usado por el controlador
router.get('/layers/:layername', layer.getGeojson)

// Exportamos el código 
module.exports = router;