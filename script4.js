document.getElementById("generate-pdf").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const codigoUnico = `OT-${Date.now()}`;
  const fechaActual = new Date().toLocaleDateString("es-VE");

  const getValue = (id) => document.getElementById(id)?.value || "";

  const fields = {
    fecha: getValue("fecha"),
    lugar: getValue("lugar"),
    claseEquipo: getValue("claseEquipo"),
    equipo: getValue("equipo"),
    trabajoRealizar: getValue("trabajoRealizar"),
    trabajoRealizado: getValue("trabajoRealizado"),
    trabajoPendiente: getValue("trabajoPendiente"),
    vehiculosUtilizados: getValue("vehiculosUtilizados"),
    personalNumero: getValue("personalNumero"),
    tiempoJornada: getValue("tiempoJornada"),
    nombres: getValue("nombres"),
    inicio: getValue("inicio"),
    fin: getValue("fin"),
    caporal: getValue("caporal"),
    permiso: getValue("permiso"),
    supervision: getValue("supervision"),
    observaciones: getValue("observaciones"),
    AsignadoPor: getValue("Asignado Por"),
    AsignadoPara: getValue("Asignado a"),
  };

  const headerImg = document.getElementById("img-header");
  const footerImg = document.getElementById("img-footer");

  /** ------- utilidades para cargar imágenes con degradado lateral ------- */
  const loadImageAsDataURL = (img) =>
    new Promise((resolve, reject) => {
      const applyGradient = (canvas, ctx, width, height) => {
        const gradientLeft = ctx.createLinearGradient(0, 0, 30, 0);
        gradientLeft.addColorStop(0, "rgba(255,255,255,1)");
        gradientLeft.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradientLeft;
        ctx.fillRect(0, 0, 30, height);

        const gradientRight = ctx.createLinearGradient(width - 30, 0, width, 0);
        gradientRight.addColorStop(0, "rgba(255,255,255,0)");
        gradientRight.addColorStop(1, "rgba(255,255,255,1)");
        ctx.fillStyle = gradientRight;
        ctx.fillRect(width - 30, 0, 30, height);
      };

      const processImage = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        applyGradient(canvas, ctx, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };

      if (img.complete) {
        processImage();
      } else {
        img.onload = processImage;
        img.onerror = reject;
      }
    });

  /** -------------------- Helper para filas de 3 columnas -------------------- */
  const marginX = 16.1;                // margen izquierdo del documento
  const col3 = 177.8 / 3;              // ancho de cada una de las 3 columnas
  const lineHeight = 5;
  let y = 30;                          // cursor vertical global

  /**
   * Dibuja una fila con 3 columnas: etiqueta arriba, valor debajo
   * @param {string[]} labels  Longitud 3
   * @param {string[]} values  Longitud 3
   */
  function drawThreeColRow(labels, values) {
    const colW     = col3;
    const paddingX = 2;                // margen interno dentro de la celda
    const maxWidth = colW - paddingX * 2;

    // Prepara envoltura de texto para cada celda
    const cells = labels.map((label, i) => {
      const labelLines  = doc.splitTextToSize(label, maxWidth);
      const valueLines  = doc.splitTextToSize(values[i] || "", maxWidth);
      return {
        labelLines,
        valueLines,
        totalLines: labelLines.length + valueLines.length,
      };
    });

    const maxLines   = Math.max(...cells.map(c => c.totalLines));
    const rectHeight = Math.max(12, maxLines * lineHeight + 6); // 6 mm de padding vertical

    // Dibujar bordes de las 3 celdas
    for (let i = 0; i < 3; i++) {
      doc.rect(marginX + i * colW, y, colW, rectHeight);
    }

    // Escribir texto dentro de cada celda
    cells.forEach((cell, idx) => {
      let textY = y + 7;                       // 7 mm desde el borde superior
      const baseX = marginX + idx * colW + paddingX;

      cell.labelLines.forEach(line => {
        doc.text(line, baseX, textY);
        textY += lineHeight;
      });
      cell.valueLines.forEach(line => {
        doc.text(line, baseX, textY);
        textY += lineHeight;
      });
    });

    y += rectHeight + 4;                       // espacio después de la fila
  }

  /** ------------------------- Armado del PDF ------------------------- */
  try {
    const headerDataUrl = await loadImageAsDataURL(headerImg);
    const footerDataUrl = await loadImageAsDataURL(footerImg);

    /* ---- Encabezado ---- */
    doc.addImage(headerDataUrl, "PNG", marginX, 5, 177.8, 17);

    doc.setFontSize(16);
    doc.text("ORDEN DIARIA DE TRABAJO", 105, y, { align: "center" });
    y += 6;
    doc.setFontSize(10);
    doc.text(`Fecha: ${fields.fecha || fechaActual}`, marginX, y);
    doc.text(`Código: ${codigoUnico}`, marginX + 140, y);
    y += 12;

    /* ---- Asignado Por ---- */
    const simpleBlocks = [
      { label: "Asignado Por:",  value: fields.AsignadoPor },
      { label: "Lugar:",         value: fields.lugar },
      { label: "Clase de Equipo:", value: fields.claseEquipo },
      { label: "Equipo:",        value: fields.equipo },
      { label: "Asignado a:", value: fields.AsignadoPara },
    ];

    simpleBlocks.forEach(({ label, value }) => {
      const labelW    = doc.getTextWidth(label) + 4;
      const maxWidth  = 177.8 - 4 - labelW;
      const lines     = doc.splitTextToSize(value || "", maxWidth);
      const height    = Math.max(12, lines.length * lineHeight + 6);

      doc.rect(marginX, y, 177.8, height);
      doc.text(label, marginX + 2, y + 7);
      doc.text(lines[0] || "", marginX + 2 + labelW, y + 7);
      for (let i = 1; i < lines.length; i++) {
        doc.text(lines[i], marginX + 2 + labelW, y + 7 + i * lineHeight);
      }
      y += height + 4;
    });

    /* ---- Trabajo a realizar / realizado / pendiente ---- */
    const trabajos = [
      { label: "Trabajo(s) a realizar:",  content: fields.trabajoRealizar },
      { label: "Trabajo(s) realizado(s):", content: fields.trabajoRealizado },
      { label: "Trabajo(s) pendiente(s):", content: fields.trabajoPendiente },
    ];

    trabajos.forEach(({ label, content }) => {
      const labelW   = doc.getTextWidth(label) + 4;
      const maxW     = 177.8 - 4 - labelW;
      const lines    = doc.splitTextToSize(content || "", maxW);
      const height   = Math.max(12, lines.length * lineHeight + 6);

      doc.rect(marginX, y, 177.8, height);
      doc.text(label, marginX + 2, y + 7);
      doc.text(lines[0] || "", marginX + 2 + labelW, y + 7);
      for (let i = 1; i < lines.length; i++) {
        doc.text(lines[i], marginX + 2 + labelW, y + 7 + i * lineHeight);
      }
      y += height + 4;
    });

    /* ---- Filas de 3 columnas (ya sin desbordes) ---- */
    drawThreeColRow(
      ["Nombre y Apellido:", "Inicio:", "Fin:"],
      [fields.nombres, fields.inicio, fields.fin]
    );

    drawThreeColRow(
      ["Caporal:", "Permiso de Trabajo:", "Supervisión Inmediata:"],
      [fields.caporal, fields.permiso, fields.supervision]
    );

    /* ---- Observaciones ---- */
    {
      const label      = "Observaciones:";
      const labelW     = doc.getTextWidth(label) + 4;
      const maxWidth   = 177.8 - 4 - labelW;
      const lines      = doc.splitTextToSize(fields.observaciones || "", maxWidth);
      const height     = Math.max(12, lines.length * lineHeight + 6);

      doc.rect(marginX, y, 177.8, height);
      doc.text(label, marginX + 2, y + 7);
      doc.text(lines[0] || "", marginX + 2 + labelW, y + 7);
      for (let i = 1; i < lines.length; i++) {
        doc.text(lines[i], marginX + 2 + labelW, y + 7 + i * lineHeight);
      }
      y += height + 5;
    }

    /* ---- Pie de página ---- */
    doc.addImage(footerDataUrl, "PNG", marginX, 275, 177.8, 15);

    /* ---- Guardar PDF ---- */
    doc.save(`Orden_Trabajo_${codigoUnico}.pdf`);
  } catch (error) {
    alert("Error al cargar imágenes del encabezado o pie de página.");
    console.error(error);
  }
});






















  

  
  
  
  
  
  

  
  
  
  


  
  