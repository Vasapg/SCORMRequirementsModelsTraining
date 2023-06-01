function getDocumento(URL){
    fetch(URL)
    .then(response => response.text())
    .then(data => {
        var infoxml = new DOMParser().parseFromString(data, "text/xml");
        var entidades=[];
        var procesos=[];
        var flujos=[];
        var almacenes=[];
        var relaciones=[];
        var texto = infoxml.getElementsByTagName("text")[0].childNodes[0].nodeValue;
        var atributos = infoxml.getElementsByTagName("atribute");
        for(i = 0; i < atributos.length; i++){
            if(atributos[i].getAttribute("type") == "proceso"){
                procesos.push(atributos[i].childNodes[0].nodeValue);
            }
            else if(atributos[i].getAttribute("type") == "entidad"){
                entidades.push(atributos[i].childNodes[0].nodeValue);
            }   
            else if(atributos[i].getAttribute("type") == "flujo"){
                flujos.push(atributos[i].childNodes[0].nodeValue);
            }
            else if(atributos[i].getAttribute("type") == "almacen"){
                almacenes.push(atributos[i].childNodes[0].nodeValue);
            }
            else if(atributos[i].getAttribute("type") == "relacion"){
                relaciones.push(atributos[i].childNodes[0].nodeValue);
            }
        }

        localStorage.setItem("texto", formatearTexto(texto));
        localStorage.setItem("procesos", JSON.stringify(procesos));
        localStorage.setItem("entidades", JSON.stringify(entidades));
        localStorage.setItem("flujos", JSON.stringify(flujos));
        localStorage.setItem("almacenes", JSON.stringify(almacenes));
        localStorage.setItem("relaciones", JSON.stringify(relaciones));

        var body = document.getElementById("documentoXML");
        var textHTML = document.createElement("p");
        textHTML.innerHTML = formatearTexto(texto);

        var espacioHTML  = document.createElement("hr");
        body.appendChild(textHTML);
        body.appendChild(espacioHTML);
    })
    .catch(error => console.error(error));
}

function getConfig() {
    return fetch("https://raw.githubusercontent.com/Vasapg/PIE-SCORM/main/Self-Assesment-5/ejercicios/config.xml")
	.then(response => response.text())
	.then(data => {
	  var xmlDoc = new DOMParser().parseFromString(data, "text/xml");
	  localStorage.setItem("nEjercicio", 0);
	  localStorage.setItem("maxEjercicio", parseInt(xmlDoc.getElementsByTagName("numExercises")[0].childNodes[0].nodeValue));
	  var titulos = [];
	  var urls = [];
	  
	  // obtiene todas las etiquetas "title" y "url"
	  var titleTags = xmlDoc.getElementsByTagName("title");
	  var urlTags = xmlDoc.getElementsByTagName("url"); 
	  
	  // itera sobre las etiquetas y guarda los contenidos en los arrays
	  for (var i = 0; i < titleTags.length; i++) 
	  {
		titulos.push(titleTags[i].textContent);
		urls.push(urlTags[i].textContent);
	  }
	  var desordenados = desordenarArrays(urls, titulos);
	  urls = desordenados.urls;
	  titulos = desordenados.titulos;
	  localStorage.setItem("urls", JSON.stringify(urls));
	  localStorage.setItem("titulos", JSON.stringify(titulos));
	});
}

async function getUrl() {
  if (!localStorage.getItem("urls")) {
	await getConfig();
  }
  var nEjercicio = parseInt(localStorage.getItem("nEjercicio"));
  console.log(nEjercicio);

  var url = JSON.parse(localStorage.getItem("urls"));
  url = url[nEjercicio];

  getDocumento(url);
  nEjercicio = nEjercicio + 1;
  localStorage.setItem("nEjercicio", nEjercicio);
}

function desordenarArrays(urls, titulos) {
  // Verificar que los arrays tengan la misma longitud
  if (urls.length !== titulos.length) {
	throw new Error("Los arrays deben tener la misma longitud");
  }

  // Crear un array de índices desordenados
  var indicesDesordenados = [];
  for (var i = 0; i < urls.length; i++) {
	indicesDesordenados.push(i);
  }
  indicesDesordenados.sort(() => Math.random() - 0.5); // Desordenar los índices

  // Crear nuevos arrays desordenados
  var urlsDesordenadas = [];
  var titulosDesordenados = [];
  for (var j = 0; j < indicesDesordenados.length; j++) {
	var indiceActual = indicesDesordenados[j];
	urlsDesordenadas.push(urls[indiceActual]);
	titulosDesordenados.push(titulos[indiceActual]);
  }

  // Devolver los nuevos arrays desordenados
  return { urls: urlsDesordenadas, titulos: titulosDesordenados };
}


function comprobarXHTTP(){
    var xhttp;
        if(window.XMLHttpRequest){
            xhttp = new XMLHttpRequest();
        }
        else{
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xhttp;
}


function formatearTexto(texto){
    return texto.replace(/[\n]/gi,"<br>");
}
if(!localStorage.getItem("texto"))
    window.onload = getUrl();
else
{
    var texto = localStorage.getItem("texto");
    var body = document.getElementById("documentoXML");
    var textHTML = document.createElement("p");
    textHTML.innerHTML = formatearTexto(texto);

    var espacioHTML  = document.createElement("hr");
    body.appendChild(textHTML);
    body.appendChild(espacioHTML);
}
