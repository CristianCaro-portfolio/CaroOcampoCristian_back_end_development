# back_end_development coderhouse course
Cristian Andres Caro Ocampo

- first delivery on 06/09/2023 using ECMAscript.
- second delivery on 13/09/2023 using file management.
- third delivery on 25/09/2023 using Servers with Express.
- Primera Pre Entrega 02/10/2023.
- cuatro entregable 11/10/2023.
- Primera Practica Integradora 30/10/2023.
- Seunga PreEntrega 06/11/2023

important tools to try the API:

- npm init
- npm install express
- npm install --save-dev nodemon

in the package.json is setted nodemon server.js as default to execute the server with Nodemon:

"scripts": {
    "start": "nodemon server.js"
},

npm start

test the API:
install postman https://www.postman.com/downloads/

POST or PUT method
http://localhost:8080/api/products

- click on body>> raw>> JSON

- you can try with this example in json:

{
  "title": "New Toy",
  "description": "A fun new toy",
  "code": "NT123",
  "price": 19.99,
  "status": true,
  "stock": 100,
  "category": "Toys",
  "thumbnails": []
}