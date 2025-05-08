// Importamos los módulos necesarios
const express = require("express");         // Framework para crear servidores web
const csv = require("csvtojson");           // Convierte CSV a JSON automáticamente
const path = require("path");               // Maneja rutas de archivos correctamente según el sistema operativo

// Creamos la aplicación Express
const app = express();
const PORT = 7050;                          // Puerto solicitado por la consigna

// Middleware para que Express entienda datos en formato JSON en POST y PUT
app.use(express.json());

// Variable donde se almacenarán los datos del CSV una vez convertidos
let usos = [];

// Armamos la ruta al archivo CSV
const archivoCSV = path.join(__dirname, "dat-ab-usos-2025.csv");

// Cargamos el CSV apenas arranca el servidor
csv()
  .fromFile(archivoCSV)
  .then((json) => {
    usos = json.map((item, index) => ({
      ...item,
      id: index + 1,                                 // Agregamos ID a cada entrada
      cantidad: parseFloat(item.cantidad) || 0       // Nos aseguramos de que cantidad sea número
    }));
    console.log("CSV cargado correctamente:", usos.length, "registros.");
  })
  .catch((error) => {
    console.error("Error al leer el archivo CSV:", error);
  });

/* -------------------------
   RUTAS CRUD BÁSICAS
------------------------- */

// GET /usos - Devuelve todos los usos registrados
app.get("/usos", (req, res) => {
  res.status(200).json(usos);
});

// GET /usos/:id - Devuelve un uso específico por ID
app.get("/usos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const uso = usos.find(u => u.id === id);
  if (!uso) return res.status(404).json({ error: "Uso no encontrado" });
  res.status(200).json(uso);
});

app.post("/usos", (req, res) => {
  const nuevo = { ...req.body, id: usos.at(-1).id + 1 };
  usos.push(nuevo);
  res.status(201).json({ message: "Uso agregado con éxito", data: nuevo });
});

//Definimos una ruta de tipo PUT, que sirve para actualizar un recurso.
app.put("/usos/:id", (req, res) => {
  //Extraemos el id de la URL usando req.params.id
  const id = parseInt(req.params.id);
  //Usamos findIndex() para buscar la posición en el array del objeto que tiene ese id.
  const index = usos.findIndex(u => u.id === id);
  //Si no lo encuentra, devuelve -1. si no responde se devuelve error 404
  if (index === -1) return res.status(404).json({ error: "Uso no encontrado para actualizar" });

  usos[index] = { ...usos[index], ...req.body, id };
  res.status(200).json({ message: "Uso actualizado con éxito", data: usos[index] });
});

app.delete("/usos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  //Acá usamos .some() para verificar si existe al menos un uso con ese ID.
  const existe = usos.some(u => u.id === id);
  //Si el ID no existe devolvemos un error 404
  if (!existe) return res.status(404).json({ error: "Uso no encontrado para eliminar" });
//filter() crea un nuevo array que contiene todos los usos excepto el que tiene ese ID.
  usos = usos.filter(u => u.id !== id);
  res.sendStatus(204); // No devuelve contenido, pero confirma éxito
});

// GET /usos/rango/:desde/:hasta
app.get("/usos/rango/:desde/:hasta", (req, res) => {
  const desde = parseInt(req.params.desde);
  const hasta = parseInt(req.params.hasta);

  if (isNaN(desde) || isNaN(hasta)) {
    return res.status(400).json({ error: "Los parámetros deben ser números" });
  }

  if (desde > hasta) {
    return res.status(400).json({ error: "El valor 'desde' no puede ser mayor que 'hasta'" });
  }

  const resultado = usos.filter(u => u.id >= desde && u.id <= hasta);

  res.status(200).json(resultado);
});


app.delete("/usos/provincia/:provincia", (req, res) => {
  const provincia = req.params.provincia.toLowerCase();

  // Verificamos si existe algún dato con esa provincia
  const existe = usos.some(u => u.PROVINCIA.toLowerCase() === provincia);

  if (!existe) {
    return res.status(404).json({ error: "Provincia no encontrada para eliminar" });
  }

  // Filtramos eliminando los que coinciden con la provincia
  datos = usos.filter(u => u.PROVINCIA.toLowerCase() !== provincia);

  res.status(200).json({ message: "Datos de la provincia eliminados correctamente" });
});





app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});