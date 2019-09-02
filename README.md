# GEOApi

Simple example of developing a RESTful API with Node.js and Express to provide geographic data stored in PostgreSQL / PostGIS.

[http://www.sigdeletras.com/2019/apirest-de-datos-geograficos-con-node-y-express/](http://www.sigdeletras.com/2019/apirest-de-datos-geograficos-con-node-y-express/)

## Requirements.

- Node.js
- A PostgreSQL/PostGIS database with at least one table with point type geometry.


## Clone the repo and install the dependencies.

```
$ git clone https://github.com/sigdeletras/geoapi.git
$ cd geoapi
$ npm install
```

## Update PostgreSQL credentials.

It must necesary update PostgreSQL credentials  in the *config.js* file.

```javascript

const config = {
    db: {
        host: 'yourhost',
        user: 'youruser',
        password: 'yourpassword',
        database: 'yourdatabasename',
        port: 5432,
    }
};
```

## Update layer name.

In the /data directory, you can find a ESRI Shape File named 'alojamientosdera'. This is the layer used in the example. If you want use it, it must necesariy load in the PostgreSQL database.

Otherwise, if you want to use another layer of your own database, you must update the SQL query found in the file *controllers/layerController.js*

```javascript
// Almacenamos la consulta SQL
    let queryLayer = 'SELECT  id,  st_x(geom ) as lng, st_y(geom ) as lat, nombre,  tipo,  cod_mun,  municipio,  provincia FROM alojamientodera;'
```

## Start

To start the express server, run the following

```
$ node server
```

Open http://localhost:3000/api/layers/layer and take a look around.
