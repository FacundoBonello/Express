# Trabajo Práctico 1 – Programación Web II

## Nombre del proyecto

**Gestor de datos SUBE - Consumo y gestión de archivo CSV con Node.js y Express**

---

## Descripción del aplicativo

Esta aplicación fue desarrollada en **Node.js** utilizando el framework **Express.js**. Permite consumir, visualizar y modificar un conjunto de datos provenientes de un archivo `.csv`, representando usos de la tarjeta SUBE en distintas provincias. El servidor expone una API REST completa que permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar), junto con endpoints adicionales con lógica personalizada.

---

## ¿Por qué esta selección?

Elegimos trabajar con un archivo CSV realista que simula datos públicos sobre el uso del transporte (SUBE) porque:

- Nos pareció interesante trabajar con una fuente de datos con campos geográficos y sociales (provincias, localidades, etc.).
- El CSV representa un formato común en entornos reales.
- La estructura del archivo era adecuada para practicar filtros y búsquedas por distintos criterios.

---

## Fuente de datos

- **Nombre del archivo:** `dat-ab-usos-2025.csv`
- **Formato:** CSV
- **Origen:** Fuente simulada o descargada a elección. El archivo contiene registros con datos como localidad, provincia, tipo de uso, etc.
- **Conversión:** El archivo fue convertido a JSON usando el módulo `csvtojson` para poder ser manipulado desde Node.js.

---

## Rutas y métodos implementados

### 📥 GET `/sube`
- **Descripción:** Devuelve todos los registros del archivo.
- **Entrada:** Ninguna
- **Salida:** Array JSON de todos los datos

---

### 📥 GET `/sube/buscar/:id`
- **Descripción:** Devuelve el registro con el ID especificado.
- **Entrada:** `id` (numérico)
- **Salida:** Objeto JSON con el dato encontrado o error 404

---

### 📥 GET `/sube/rango`
- **Descripción:** Devuelve los datos entre dos IDs (inclusive).
- **Entrada:** `id1` y `id2` (numéricos) a través de Query
- **Salida:** Array con los datos en ese rango o error si hay valores inválidos

---

### ➕ POST `/sube`
- **Descripción:** Agrega un nuevo dato al array.
- **Entrada:** Objeto JSON con los campos del nuevo registro (ej: `PROVINCIA`, `LOCALIDAD`, etc.)
- **Salida:** Objeto agregado con su ID asignado

---

### ✏️ PUT `/sube/:id`
- **Descripción:** Modifica un dato existente por ID.
- **Entrada:** 
  - `id` (numérico)
  - Cuerpo JSON con campos a modificar
- **Salida:** Objeto actualizado o error si no se encuentra

---

### 🗑 DELETE `/sube/:id`
- **Descripción:** Elimina un registro por ID.
- **Entrada:** `id` (numérico)
- **Salida:** Código 204 si se elimina o error 404 si no existe

---

### 🗑 DELETE `/sube/provincia/:provincia`
- **Descripción:** Elimina todos los registros de una provincia.
- **Entrada:** `provincia` (string)
- **Salida:** Mensaje de éxito o error si no hay coincidencias

---
### 📥 GET `/sube/provincia`
- **Descripción:** Devuelve los nombres de las provincias que contiene el dataset sin repetición y ordenadas.
- **Entrada:** Ninguna
- **Salida:** Array JSON de los nombres de las provincias

---

### 📥 GET `/sube/viajes/:provincia`
- **Descripción:** Devuelve la cantidad de viajes que se hicieron en una provincia determinada
- **Entrada:** `provincia` (string)
- **Salida:** Cantidad de viajes o error si no hay coincidencias

---




## Códigos de respuesta utilizados

- `200 OK`: Para operaciones exitosas con contenido
- `201 Created`: (en el futuro se podría usar en POST)
- `204 No Content`: Para DELETE sin respuesta (aunque usamos 200 con mensaje)
- `400 Bad Request`: Para errores de validación o parámetros inválidos
- `404 Not Found`: Cuando no se encuentra un recurso solicitado

---

## Ejecución

- Puerto configurado: `7050`
- Para probar los endpoints se utilizó **Thunder Client**

---

## Grupo 12

- Facundo Bonello
- Daniel Flores
- Maria Belen Calveira
