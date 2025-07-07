
(()=>{

  const pdfForm   = document.getElementById("form1");
  const fechaInput= document.getElementById("fecha");

  /* Desactivar validación nativa */
  pdfForm.setAttribute("novalidate","");

  /* Fecha de hoy por defecto */
  if(!fechaInput.value){
    const d = new Date();
    fechaInput.value = new Date(d.getTime()-d.getTimezoneOffset()*6e4)
                       .toISOString().split("T")[0];
  }

  /* Submit → generar PDF */
  pdfForm.addEventListener("submit", e=>{
    e.preventDefault();

    const encabezadoImg = new Image();
    encabezadoImg.src = "imagen/htl16.PNG";

    const pieImg = new Image();
    pieImg.src = "imagen/imagen3.PNG";

    encabezadoImg.onload = ()=>{ pieImg.onload = ()=> generarPDF(encabezadoImg,pieImg); };
  });

  /* --------- helpers --------- */
  const generarCodigoUnico = ()=>{
    const c="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let r=""; for(let i=0;i<8;i++) r+=c[Math.floor(Math.random()*c.length)];
    return r;
  };

  /* --------- PDF --------- */
  function generarPDF(headerImg,footerImg){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const g = id=>document.getElementById(id)?.value||"";

    /* datos */
    const fecha = g("fecha"), lugar = g("lugar"),
          clase = g("claseEquipo"), equipo = g("equipoLista"),
          inicio = g("inicio"), fin = g("fin"),
          AsignadoPor = g("AsignadoPor"),
          AsignadoPara = g("AsignadoPara"),
          descripcion = g("descripcion"),
          consecuencias = g("consecuencias"),
          pendiente = g("pendiente"),
          material = g("material"),
          observacion = g("observacion"),
          codigo = generarCodigoUnico();

    /* imágenes */
    const w=177.8, hHead=17, hFoot=15.5, marginX=(210-w)/2;
    doc.addImage(headerImg,"PNG",marginX,5,w,hHead);
    doc.addImage(footerImg,"PNG",marginX,297-hFoot-7,w,hFoot);

    /* título */
    doc.setFillColor(115,188,250);
    doc.rect(marginX,25,w,10,"F");
    doc.setTextColor(255); doc.setFontSize(10);
    doc.text("Reporte, Grupo de Mantenimiento, Protecciones, Registros, Medición, Supervisión y Control",105,30,{align:"center"});
    doc.setTextColor(0); doc.setFontSize(11);

    /* tabla */
    doc.autoTable({
      startY:40,
      head:[["Campo","Valor"]],
      body:[
        ["Código Único",codigo],
        ["Asingado Por",AsignadoPor],
        ["Fecha",fecha],
        ["Lugar",lugar],
        ["Clase de equipo",clase],
        ["Equipo",equipo],
        ["Inicio",inicio],
        ["Fin",fin],
        ["Asignado a",AsignadoPara],
        
      ],
      theme:"grid",
      headStyles:{ fillColor:[115,188,250], textColor:255 },
      styles:{ halign:"left", cellPadding:2, fontSize:9, tableWidth:w },
      margin:{ left:marginX, right:marginX }
    });

    let y = doc.lastAutoTable.finalY + 10;

    const seccion = (titulo,texto)=>{
      const alto = doc.getTextDimensions(texto).h + 12;
      if(y+alto+20 > 297-hFoot){ doc.addPage(); y=20; }
      doc.setFillColor(115,188,250); doc.setTextColor(255);
      doc.rect(marginX,y,w,8,"F"); doc.text(titulo,marginX+2,y+5.5);
      y+=10;
      doc.setTextColor(0); doc.setDrawColor(0);
      doc.rect(marginX,y,w,alto);
      doc.text(doc.splitTextToSize(texto,w-4),marginX+2,y+6);
      y += alto + 5;
    };

    seccion("Descripción del trabajo", descripcion);
    seccion("Consecuencias", consecuencias);
    seccion("Actividad Pendiente", pendiente);
    seccion("Material o equipo pendiente", material);
    seccion("Observaciones", observacion);

    doc.save(`reporte_${codigo}.pdf`);
  }

})();  




















  