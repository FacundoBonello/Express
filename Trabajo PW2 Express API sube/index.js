const express = require("express");
const app = express();
const csv = require('csv-parser'); // libreria necesaria para parsear csv
const CSVtoJSON = require('csvtojson'); // libreria para dar formato JSON
const port = 7050;
app.use(express.json()); // permite procesar los bodys en JSON




// Ruta del archivo CSV
const csvRuta = './dat-ab-usos-2025.csv';
let datos=[];

// Lee un archivo csv le da formato JSON
CSVtoJSON().fromFile(csvRuta)
    .then(data => {
    datos = data.map((datos, i) => {
      return {
        ...datos,
        id: i + 1, // Agrega una id a cada dato
      };
    });
    })
    .catch(err => {
    console.error('Error al leer el archivo:', err);
    });
  
/////////////////////////// 4 peticiones principales GET,PUT,POST,DELETE
      app.get('/sube', (req, res) => { // ver todos los datos
        res.status(200).json(datos);
        });

      

      
      app.post("/sube", (req, res) => {
        const nuevoDATO = { ...req.body, id: datos.at(-1).id + 1}; // Nuevo dato
        datos.push(nuevoDATO);
        res.send(nuevoDATO);
        });

      

      app.put("/sube/:id", (req, res) => {
        //Extraemos el id de la URL usando req.params.id
        const id = parseInt(req.params.id);
        //Usamos findIndex() para buscar la posición en el array del objeto que tiene ese id.
        const index = datos.findIndex(u => u.id === id);
        //Si no lo encuentra, devuelve -1. si no responde se devuelve error 404
        if (index === -1) return res.status(404).json({ error: "ID no encontrada para actualizar" });
      
        datos[index] = { ...datos[index], ...req.body, id };
        res.status(200).json({ message: "Dato actualizado con éxito", data: datos[index] });
      });

      


      app.delete("/sube/:id", (req, res) => {
        const id = parseInt(req.params.id);
        //Acá usamos .some() para verificar si existe al menos un uso con ese ID.
        const existe = datos.some(u => u.id === id);
        //Si el ID no existe devolvemos un error 404
        if (!existe) return res.status(404).json({ error: "ID no encontrada para eliminar" });
      //filter() crea un nuevo array que contiene todos los usos excepto el que tiene ese ID.
        datos = datos.filter(u => u.id !== id);
        datos = datos.map((datos, i) => {
          return {
            ...datos,
            id: i + 1, // Reacomoda las ids
          };
        });
        res.sendStatus(204); // No devuelve contenido, pero confirma éxito
      });

      // OTRAS PETICIONES

      // Muestra datos de una ID concreta
      app.get('/sube/buscar/:id', (req, res) => { 
        const id = parseInt(req.params.id);
        const encontrado = datos.filter(p => p.id == id);
        if(!encontrado){
          return res.status(404).json({ error: "Dato no encontrado" });
        }
        res.status(200).json(encontrado);
        });
      


      // Muestra los datos entre un rango de IDs

      app.get('/sube/rango', (req, res) => { 
        //const id2 = parseInt(req.params.id2);
        const { id1, id2 } = req.query;
        const encontrado = datos.filter(p =>(p.id >= id1 && p.id  <= id2));
        if (id1> id2) {
          return res.status(400).json({ error: "El valor id1 no puede ser mayor que id2"});
        }
      if(id1>datos.at(-1).id || id2>datos.at(-1).id || id1<=0 || id2<=0 ){
        return res.status(400).json({ error: "fuera de rango"});
      }
      res.status(200).json(encontrado);
      });
  



      // Elimina datos que contengan el nombre de la provincia
      app.delete("/sube/provincia/:provincia", (req, res) => {
        const provincia = req.params.provincia.toLowerCase();
        // Verificamos si existe algún dato con esa provincia
        const existe = datos.some(u => u.PROVINCIA.toLowerCase() === provincia);
        if (!existe) {
          return res.status(404).json({ error: "Provincia no encontrada para eliminar" });
        }
        // Filtramos eliminando los que coinciden con la provincia
        datos = datos.filter(u => u.PROVINCIA.toLowerCase() !== provincia);
        datos = datos.map((datos, i) => {
          return {
            ...datos,
            id: i + 1, // Reacomoda las ids
          };
        });
      
        res.status(200).json({ message: "Datos de la provincia eliminados correctamente" });
      });





      // Muestra solo las provincias
      app.get('/sube/provincia', (req, res) => {
        const provincias = datos.map(p => p.PROVINCIA) // guarda las provincias
        const provinciasUnicas = [...new Set(provincias)]; // elimina el duplicado de provincias
        provinciasUnicas.sort();
        res.status(200).json(provinciasUnicas);
      });






      // Cantidad de viajes en una provincia
      app.get('/sube/viajes/:provincia', (req, res) => {
        let acumulado = 0; // declaramos un acumulador
        const eliPRO = req.params.provincia.toLowerCase();
        datos.forEach(datos => {
          const provincia = datos.PROVINCIA.toLowerCase();
          const viajes = parseInt(datos.CANTIDAD);
      
          if (provincia === eliPRO) 
            acumulado= acumulado + viajes;
        });

        if (acumulado == 0) {
          return res.status(404).json({ error: "Provincia no encontrada" });
        }
        
        res.status(200).json(acumulado);
      });
      
      

    // Escuchar en el puerto 7050
      app.listen(port, () => {
    console.log(`Aplicación escuchando en el puerto ${port}`);
      });
  

