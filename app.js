const fs = require("fs");
const http = require("http");
const axios = require("axios");
/*
function f(callback){
    fs.readFile("app.js",(err, data)=>{
        callback(data);
    })

}
f((data)=>{
    return data.toString();
});


http.createServer((req, res)=>{
    sendData(res);
}).listen(3000);

function sendData(res){
    fs.readFile("app.js", (err,data)=>{
        res.write(data.toString());
        res.end();
    })
}
*/

const url = "https://gist.githubusercontent.com/josejbocanegra/c6c2c82a091b880d0f6062b0a90cce88/raw/9ed13fd53a144528568d1187c1d34073b36101fd/categories.json";
axios.get(url).then(response => {

    function f(callback) {
        fs.readFile("index.html", (err, data) => {
            if (err) {
                throw err;
            }
            callback(data);
        })
    }


    let cadena;
    f((data) => {

        let htmlInjecion = `\n<div class="accordion" id="accordion">\n`;
        let accordion = "";
        response.data.forEach((tipoComida, i) => {
            accordion += `\n<div class="card">\n
                <div class="card-header" id="heading${i}">\n
                    <h2 class="mb-0">\n
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">\n
                    ${tipoComida.name}\n
                    </button>\n
                    </h2>\n
                </div>\n
                <div id="collapse${i}" class="collapse show" aria-labelledby="heading${i}" data-parent="#accordion">\n
                    <div class="card-body">\n
                        <div class="row" id="row${i}">\n`;

            let tipoC = "";
            tipoComida.products.forEach((product, j) => {
                tipoC += `\n<div class="col-3">\n
                                <div class="card" style="width: 18rem;">\n
                                    <img src="${product.image}" class="card-img-top" alt="${product.name}">\n
                                    <div class="card-body">\n
                                        <h5 class="card-title">${product.name}</h5>\n
                                        <p class="card-text">${product.description}</p>\n
                                        <p class="card-text">${product.price}$</p>\n
                                        <a href="#" class="btn btn-primary">Add to car</a>\n
                                    </div>\n
                                </div>\n
                            </div>\n`;
            });
            accordion += tipoC;
            accordion += `</div>\n
                    </div>\n
                </div>\n
            </div>\n`;

        });

        htmlInjecion += accordion + `\n</div>\n`;
        console.log(htmlInjecion);
        cadena = data.toString().replace("{{placeholder}}", htmlInjecion);
        //console.log(cadena);
        fs.writeFile("index.html", cadena, (err) => {
            if (err) {
                throw err;
            } else {
                console.log('el archivo ha sido escrito');

                http.createServer((req, res) => {
                    sendData(res);
                }).listen(8080);

                function sendData(res) {
                    res.write(cadena.toString());
                    res.end();
                }
            }
        });
    });
});