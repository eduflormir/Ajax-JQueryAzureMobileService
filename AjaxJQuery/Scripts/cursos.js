
var url = "https://alumnoscurso.azure-mobile.net/Tables/Curso"; // URL de Azure Mobile Service

var modificando = undefined;

function procesarJson(res) {
    var salida = "<table>";
    salida += "<tr>";
    salida += "<td> <b>Nombre</b> </td>";
    salida += "<td> <b>Duracion</b> </td>";
    salida += "</tr>";

    for (var i = 0; i < res.length; i++) {
        salida += "<tr>"; // salida = salida + '<tr>'
        salida += "<td>" + res[i].nombre + "</td>";
        salida += "<td>" + res[i].duracion + "</td>";
        salida +=
        "<td><button class='borrar' type='button' onclick='borrar(\"" +
            res[i].id +
        "\")' >Borrar</button> </td>";
        salida += "<td><button  type='button' onclick='cargarModificacion(\"" +
           res[i].id +
       "\")' >Modificar</button> </td>";
        salida += "</tr>";
    }
    salida += "</table>";
    $("#cursos").html(salida);
    

}
// borrar un elemento de la lista mediante el boton Borrar
function borrar(id) {
    $.ajax({
        method: "delete",
        url: url + "/" + id,
        success: function (res) {
            console.log("borrar, success::: ");
            console.log(res);
            getCursos(); // refrescar pantalla
        },
        error: function (err) {
            console.log("borrar, error::: ");
            console.log(err);
        }
    });
}


// Dese la tabla el boton modificar ejecuta ejecuta esta función
function cargarModificacion(id) {
    var myUrl = url + "/" + id; // voy a consultar por ID
    console.log("cargarModificacion, myUrl:::");
    console.log(myUrl);
    $.get(myUrl, function(res) // recupero objeto
    {
       // asigno valores
        document.getElementById("txtNombre").value = res.nombre;
        document.getElementById("txtDuracion").value = res.duracion;
        modificando = res.id;
     });
}

function ejecutarModificacion() {

    var o = { nombre: $("#txtNombre").val(), duracion: $("#txtDuracion").val() };

    console.log("ejecutarModificacion voy a actualizar el siguiente objeto::");
    console.log(o);
    $.ajax({
        method: "PATCH",
        url: url + "/" + modificando,
        success: function (res) {
            console.log("ejecutarModificacion, success::: ");
            console.log(res);
            getCursos(); // refrescar pantalla
        },
        error: function (err) {
            console.log("ejecutarModificacion, error::: ");
            console.log(err);
        },
        data: JSON.stringify(o),
        dataType: "json",
        headers: {
            "Content-Type": "application/json"
        }
    });
    
 }

// Hace una busqueda mediante filtro oData ?$orderby=nombre
function getCursos() {
    var  myUrl = url + "/?$orderby=nombre";
    console.log("getCursos, myUrl:::");
    console.log(myUrl);
    $.get(myUrl, procesarJson);
}
// Hace una busqueda mediante filtro oData ?$filter=nombre eq
function buscarCurso() {
    var myUrl = "";
    var nomCur = $("#txtCurso").val();
    console.log("buscarCurso, myUrl:::");
    console.log(myUrl);
    console.log("buscarCurso, nomCur:::");
    console.log(nomCur);
    
    myUrl = url + "/?$filter=nombre eq '" + nomCur + "'"; // construyo url OData para petición    

    $.get(myUrl, procesarJson);
}

function agregarCurso() {
    var o = { nombre: $("#txtNombre").val(), duracion: $("#txtDuracion").val() };
    console.log("voy a guardar el siguiente objeto::");
    console.log(o);
    $.ajax({
        method: "post",
        url: url,
        success: function (res) {
            console.log("agregarCurso, success::: ");
            console.log(res);
            getCursos(); // refrescar pantalla
        },
        error: function (err) {
            console.log("agregarCurso, error::: ");
            console.log(err);
        },
        data: JSON.stringify(o),
        dataType: "json",
        headers: {
            "Content-Type": "application/json"
        }
    });
}

function refrescar() {
    $("#cursos").load(getCursos());
}

$(document).ready(function () {
    $("#btnBuscar").click(buscarCurso);
    $("#btnRefrescar").click(refrescar);
    $("#btnUpdate").click(function() {
        if (modificando != undefined)
            ejecutarModificacion();
        else
            agregarCurso();
    });

});

