document.getElementById("generate-pdf").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Función para obtener un valor de input por id con validación
  function getInputValue(id) {
    const el = document.getElementById(id);
    if (!el) {
      alert(`No se encontró el campo con id: '${id}'`);
      throw new Error(`Campo no encontrado: ${id}`);
    }
    return el.value || "";
  }

  try {
    // Generación del código único para la orden de trabajo
    const codigoUnico = `OT-${Date.now()}`;
    const fechaActual = new Date().toLocaleDateString("es-VE");
    const centerX = (210 - 177.8) / 2;
    const lineHeight = 5; // ✅ Declarada una sola vez aquí

    // Obtener datos del formulario
    const asignadoPor = getInputValue("AsignadoPor");
    const asignadoPara = getInputValue("AsignadoPara");
    const cuadrilla = getInputValue("cuadrilla");
    const lugar = getInputValue("lugar");
    const claseEquipo = getInputValue("claseEquipo");
    const equipo = getInputValue("equipo");
    const descripcionEquipo = getInputValue("descripcionEquipo");
    const descripcionTrabajo = getInputValue("descripcionTrabajo");
    const caporal = getInputValue("caporal");
    const permiso = getInputValue("permiso");
    const supervision = getInputValue("supervision");
    const observaciones = getInputValue("observaciones");

    const tipoTrabajoInputs = document.querySelectorAll(".tabla-tipo input");
    const tipoTrabajo = Array.from(tipoTrabajoInputs).map(input => input.value || "-");

    const tabla = document.querySelector("#tabla-semanal");
    if (!tabla) {
      alert("No se encontró la tabla con id 'tabla-semanal'");
      return;
    }

    const filas = Array.from(tabla.querySelectorAll("tr")).slice(1);
    const actividades = filas.map(fila => {
      const celdas = fila.querySelectorAll("td");
      return [
        celdas[0]?.textContent.trim() || "",
        celdas[1]?.querySelector("input")?.value || "",
        celdas[2]?.querySelector("input")?.value || "",
        celdas[3]?.querySelector("input")?.value || ""
      ];
    });

    const headerImg = document.getElementById("img-header");
    const footerImg = document.getElementById("img-footer");

    if (!headerImg || !footerImg) {
      alert("No se encontraron las imágenes de encabezado o pie de página");
      return;
    }

    const loadImageAsDataURL = (img) =>
      new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const gradientTop = ctx.createLinearGradient(0, 0, 0, 50);
        gradientTop.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradientTop.addColorStop(1, "rgba(255, 255, 255, 0.2)");

        const gradientBottom = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - 50);
        gradientBottom.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradientBottom.addColorStop(1, "rgba(255, 255, 255, 0.2)");

        ctx.fillStyle = gradientTop;
        ctx.fillRect(0, 0, canvas.width, 50);
        ctx.fillStyle = gradientBottom;
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
        ctx.globalCompositeOperation = "source-over";

        resolve(canvas.toDataURL("image/png"));
      });

    const headerDataUrl = await loadImageAsDataURL(headerImg);
    const footerDataUrl = await loadImageAsDataURL(footerImg);

    // Dibujo encabezado
    doc.addImage(headerDataUrl, "PNG", centerX, 5, 177.8, 17);
    let y = 30;
    doc.setFontSize(16);
    doc.setFont(undefined, "normal");
    doc.text("ORDEN DIARIA DE TRABAJO", 105, y, { align: "center" });

    y += 10;
    doc.setFontSize(10);
    doc.text(`Fecha: ${fechaActual}`, centerX, y);
    doc.text(`Código: ${codigoUnico}`, centerX + 140, y);
    y += 10;

    // --- Cuadro 3x1: Cuadrilla / Asignado Por / Asignado Para ---
    const colWidthAsignado = 177.8 / 3;
    const cuadrillaLines = doc.splitTextToSize(cuadrilla || "-", colWidthAsignado - 4);
    const asignadoPorLines = doc.splitTextToSize(asignadoPor || "-", colWidthAsignado - 4);
    const asignadoParaLines = doc.splitTextToSize(asignadoPara || "-", colWidthAsignado - 4);
    const maxAsignadoLines = Math.max(cuadrillaLines.length, asignadoPorLines.length, asignadoParaLines.length);
    const rowHeightAsignado = 7 + maxAsignadoLines * lineHeight + 3;

    doc.setDrawColor(0);
    doc.setFillColor(230, 230, 230);
    doc.rect(centerX, y, colWidthAsignado, rowHeightAsignado, "F");
    doc.rect(centerX + colWidthAsignado, y, colWidthAsignado, rowHeightAsignado, "F");
    doc.rect(centerX + 2 * colWidthAsignado, y, colWidthAsignado, rowHeightAsignado, "F");
    doc.rect(centerX, y, 177.8, rowHeightAsignado);
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text("Cuadrilla:", centerX + 2, y + 5);
    doc.text("Asignado Por:", centerX + colWidthAsignado + 2, y + 5);
    doc.text("Asignado a:", centerX + 2 * colWidthAsignado + 2, y + 5);
    doc.setFontSize(9);
    doc.setTextColor(50);
    doc.text(cuadrillaLines, centerX + 2, y + 10);
    doc.text(asignadoPorLines, centerX + colWidthAsignado + 2, y + 10);
    doc.text(asignadoParaLines, centerX + 2 * colWidthAsignado + 2, y + 10);
    y += rowHeightAsignado + 5;

    // --- Cuadro 3x1: Lugar / Clase de Equipo / Equipo ---
    const colWidth3x1 = 177.8 / 3;
    const lugarLines = doc.splitTextToSize(lugar || "-", colWidth3x1 - 4);
    const claseEquipoLines = doc.splitTextToSize(claseEquipo || "-", colWidth3x1 - 4);
    const equipoLines = doc.splitTextToSize(equipo || "-", colWidth3x1 - 4);
    const maxLines = Math.max(lugarLines.length, claseEquipoLines.length, equipoLines.length);
    const rowHeight3x1 = 7 + maxLines * lineHeight + 3;

    doc.setDrawColor(0);
    doc.setFillColor(230, 230, 230);
    doc.rect(centerX, y, colWidth3x1, rowHeight3x1, "F");
    doc.rect(centerX + colWidth3x1, y, colWidth3x1, rowHeight3x1, "F");
    doc.rect(centerX + 2 * colWidth3x1, y, colWidth3x1, rowHeight3x1, "F");
    doc.rect(centerX, y, 177.8, rowHeight3x1);
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text("Lugar:", centerX + 2, y + 5);
    doc.text("Clase de Equipo:", centerX + colWidth3x1 + 2, y + 5);
    doc.text("Equipo:", centerX + 2 * colWidth3x1 + 2, y + 5);
    doc.setFontSize(9);
    doc.setTextColor(50);
    doc.text(lugarLines, centerX + 2, y + 10);
    doc.text(claseEquipoLines, centerX + colWidth3x1 + 2, y + 10);
    doc.text(equipoLines, centerX + 2 * colWidth3x1 + 2, y + 10);
    y += rowHeight3x1 + 5;

    // --- Descripción del trabajo ---
    const trabajoText = doc.splitTextToSize(descripcionTrabajo, 170);
    const trabajoHeight = trabajoText.length * lineHeight + 6;
    doc.rect(centerX, y, 177.8, trabajoHeight);
    doc.setTextColor(0);
    doc.text("Descripción del Trabajo:", centerX + 2, y + 5);
    doc.setTextColor(50);
    doc.text(trabajoText, centerX + 2, y + 10);
    y += trabajoHeight + 5;

    // --- Tipo de trabajo (tabla 5 columnas) ---
    const rowHeight3 = 12;
    const ancho5 = 177.8 / 5;
    doc.rect(centerX, y, 177.8, rowHeight3);
    for (let i = 1; i < 5; i++) {
      doc.line(centerX + i * ancho5, y, centerX + i * ancho5, y + rowHeight3);
    }
    const etiquetas = ["Tipo", "Sitio", "Caliente", "Prioridad", "Desde"];
    doc.setTextColor(0);
    etiquetas.forEach((etq, i) => {
      doc.text(etq + ":", centerX + i * ancho5 + 2, y + 5);
    });
    doc.setTextColor(50);
    tipoTrabajo.forEach((val, i) => {
      const texto = doc.splitTextToSize(val, ancho5 - 4);
      doc.text(texto, centerX + i * ancho5 + 2, y + 10);
    });
    y += rowHeight3 + 5;

    // --- Actividades semanales ---
    doc.setTextColor(0);
    doc.text("Actividades Semanales:", centerX, y);
    y += 5;
    doc.autoTable({
      startY: y,
      head: [["Día", "Actividad", "Responsable", "Firma"]],
      body: actividades,
      theme: "grid",
      styles: { fontSize: 9 },
      margin: { left: centerX, right: centerX },
      tableWidth: 177.8,
      headStyles: {
        fillColor: [115, 188, 250],
        valign: "middle",
      },
    });
    y = doc.lastAutoTable.finalY + 10;

    // --- Observaciones ---
    const obsText = doc.splitTextToSize(observaciones, 170);
    const obsHeight = obsText.length * lineHeight + 6;
    doc.rect(centerX, y, 177.8, obsHeight);
    doc.setTextColor(0);
    doc.text("Observaciones:", centerX + 2, y + 5);
    doc.setTextColor(50);
    doc.text(obsText, centerX + 2, y + 10);
    y += obsHeight + 5;

    // --- Caporal / Permiso / Supervisión ---
    const rowHeight2 = 12;
    const ancho3 = 177.8 / 3;
    doc.rect(centerX, y, 177.8, rowHeight2);
    doc.line(centerX + ancho3, y, centerX + ancho3, y + rowHeight2);
    doc.line(centerX + 2 * ancho3, y, centerX + 2 * ancho3, y + rowHeight2);
    doc.setTextColor(0);
    doc.text("Caporal:", centerX + 2, y + 5);
    doc.text("Permiso de Trabajo:", centerX + ancho3 + 2, y + 5);
    doc.text("Supervisión Inmediata:", centerX + 2 * ancho3 + 2, y + 5);
    doc.setTextColor(50);
    doc.text(doc.splitTextToSize(caporal, ancho3 - 5), centerX + 2, y + 10);
    doc.text(doc.splitTextToSize(permiso, ancho3 - 5), centerX + ancho3 + 2, y + 10);
    doc.text(doc.splitTextToSize(supervision, ancho3 - 5), centerX + 2 * ancho3 + 2, y + 10);
    y += rowHeight2 + 5;

    // --- Pie de página ---
    doc.addImage(footerDataUrl, "PNG", centerX, 275, 177.8, 17);

    // ✅ Guardar el PDF
    doc.save(`${codigoUnico}.pdf`);
  } catch (error) {
    console.error("Error generando PDF:", error);
  }
});





























  
  

