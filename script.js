document.addEventListener('DOMContentLoaded', function () {
    // Quitar todos los "required" para permitir envío sin datos
    document.querySelectorAll("#form1 [required]").forEach(el => el.removeAttribute("required"));

    function generarOrdenTrabajo() {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let ordenTrabajo = "";
        for (let i = 0; i < 8; i++) {
            ordenTrabajo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return ordenTrabajo;
    }

    function agregarEncabezado(doc, codigoOrden) {
        const imagenEncabezado = 'imagen/htl16.PNG';
        const margenLateral = (210 - 177.8) / 2;
        doc.addImage(imagenEncabezado, 'PNG', margenLateral, 5, 177.8, 17);

        doc.setFontSize(13);
        doc.text("ORDEN DIARIA DE TRABAJO", 105, 28, null, null, "center");

        const fechaActual = new Date().toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: '2-digit' });
        doc.setFontSize(8);
        doc.text(`Código OT: ${codigoOrden}`, margenLateral, 33);
        doc.text(`Fecha: ${fechaActual}`, 210 - margenLateral, 33, null, null, "right");

        doc.setDrawColor(0, 102, 204);
        doc.setLineWidth(0.5);
        doc.line(margenLateral, 37, 210 - margenLateral, 37);
    }

    function agregarPieDePagina(doc) {
        const imagenPie = 'imagen/imagen3.PNG';
        const margenLateral = (210 - 177.8) / 2;
        doc.addImage(imagenPie, 'PNG', margenLateral, 277, 177.8, 17);
    }

    function generarPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const codigoOrden = generarOrdenTrabajo();

        agregarEncabezado(doc, codigoOrden);

        const getValor = id => {
            const el = document.getElementById(id);
            if (id === "permisoConsignacion" && (!el || el.value.trim() === "")) {
                return "N/A";
            }
            return el && el.value.trim() !== "" ? el.value : "";
        };

        const cuadrilla = getValor("permisoConsignacion");
        const lugar = getValor("lugar");
        const claseEquipo = getValor("claseEquipo");
        const fecha = getValor("fecha");
        const dia = getValor("dia");
        const instalacion = getValor("instalacion");
        const AsignadoPor = getValor("Asignado Por");
        const AsignadoPara = getValor("Asignado a");
        const linea = getValor("linea");
        const equipo = getValor("equipo");
        const vehiculo = getValor("vehiculo");
        const modelo = getValor("modelo");
        const placas = getValor("placa");
        const nombreApellido = getValor("nombreApellido");

        let y = 40;
        const margenLateral = (210 - 177.8) / 2;
        const anchoTotal = 177.8;

        const tablaEstilo = {
            fontSize: 7,
            cellPadding: 1.5,
            lineWidth: 0.3
        };

        const encabezadoEstilo = {
            fillColor: [0, 102, 204]
        };

        doc.autoTable({
            startY: y,
            head: [["Campo", "Valor"]],
            body: [
                ["Orden de Trabajo:", codigoOrden],
                ["Asignado Por", AsignadoPor],
                ["Permiso de Consignación:", cuadrilla],
                ["Fecha:", fecha],
                ["Día:", dia],
                ["Instalación:", instalacion],
                ["Linea:", linea],
                ["Lugar:", lugar],
                ["Clases de Equipo:", claseEquipo],
                ["Equipo:", equipo],
                ["Asignado a", AsignadoPara],
            ],
            theme: "grid",
            styles: tablaEstilo,
            headStyles: encabezadoEstilo,
            columnStyles: { 0: { cellWidth: anchoTotal / 2 }, 1: { cellWidth: anchoTotal / 2 } },
            margin: { left: margenLateral, right: margenLateral }
        });
        y = doc.lastAutoTable.finalY + 3;

        doc.autoTable({
            startY: y,
            head: [["Descripción de la actividad"]],
            body: [[""]],
            theme: "grid",
            styles: { ...tablaEstilo, minCellHeight: 10 },
            headStyles: encabezadoEstilo,
            columnStyles: { 0: { cellWidth: anchoTotal } },
            margin: { left: margenLateral, right: margenLateral }
        });
        y = doc.lastAutoTable.finalY + 2;

        doc.autoTable({
            startY: y,
            head: [["Informe de la Actividad"]],
            body: [[""]],
            theme: "grid",
            styles: { ...tablaEstilo, minCellHeight: 10 },
            headStyles: encabezadoEstilo,
            columnStyles: { 0: { cellWidth: anchoTotal } },
            margin: { left: margenLateral, right: margenLateral }
        });
        y = doc.lastAutoTable.finalY + 2;

        doc.autoTable({
            startY: y,
            head: [["Vehículo", "Modelo", "Placas"]],
            body: [[vehiculo, modelo, placas]],
            theme: "grid",
            styles: tablaEstilo,
            headStyles: encabezadoEstilo,
            columnStyles: {
                0: { cellWidth: anchoTotal / 3 },
                1: { cellWidth: anchoTotal / 3 },
                2: { cellWidth: anchoTotal / 3 }
            },
            margin: { left: margenLateral, right: margenLateral }
        });
        y = doc.lastAutoTable.finalY + 2;

        // Generar 11 filas vacías para actividades (4 columnas: Trabajador, Actividad, Horas Extras, Observaciones)
        const actividades = Array.from({ length: 10 }, () => ["", "", "", ""]);
        doc.autoTable({
            startY: y,
            head: [["Trabajador", "Actividad", "Horas Extras", "Observaciones"]],
            body: actividades,
            theme: "grid",
            styles: tablaEstilo,
            headStyles: encabezadoEstilo,
            columnStyles: {
                0: { cellWidth: anchoTotal / 4 },
                1: { cellWidth: anchoTotal / 4 },
                2: { cellWidth: anchoTotal / 4 },
                3: { cellWidth: anchoTotal / 4 }
            },
            margin: { left: margenLateral, right: margenLateral }
        });
        y = doc.lastAutoTable.finalY + 2;

        doc.autoTable({
            startY: y,
            head: [["Nombre y Apellido", "Firma del trabajador"]],
            body: [[nombreApellido, ""]],
            theme: "grid",
            styles: tablaEstilo,
            headStyles: encabezadoEstilo,
            columnStyles: {
                0: { cellWidth: anchoTotal / 2 },
                1: { cellWidth: anchoTotal / 2 }
            },
            margin: { left: margenLateral, right: margenLateral }
        });
        y = doc.lastAutoTable.finalY + 2;

        doc.autoTable({
            startY: y,
            head: [["Caporal", "Técnico Supervisor", "Autorizado por"]],
            body: [
                ["Nombre", "", ""],
                ["C.I:", "", ""],
                ["Firma", "", ""]
            ],
            theme: "grid",
            styles: tablaEstilo,
            headStyles: encabezadoEstilo,
            columnStyles: {
                0: { cellWidth: anchoTotal / 3 },
                1: { cellWidth: anchoTotal / 3 },
                2: { cellWidth: anchoTotal / 3 }
            },
            margin: { left: margenLateral, right: margenLateral }
        });

        agregarPieDePagina(doc);
        doc.save(`Orden_Trabajo_${codigoOrden}.pdf`);
    }

    document.getElementById("form1").addEventListener("submit", function (event) {
        event.preventDefault();
        generarPDF();
    });
});



























