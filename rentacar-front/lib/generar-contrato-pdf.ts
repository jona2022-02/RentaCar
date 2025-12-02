import jsPDF from 'jspdf';

interface DatosContrato {
  solicitud: any;
  usuario: any;
  vehiculo: any;
}

export function generarContratoPDF(datos: DatosContrato) {
  const { solicitud, usuario, vehiculo } = datos;
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = 20;

  // Función auxiliar para agregar texto justificado
  const addTextJustified = (text: string, yPos: number, fontSize: number = 10): number => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    doc.text(lines, margin, yPos);
    return yPos + (lines.length * fontSize * 0.4);
  };

  // Verificar si necesitamos nueva página
  const checkPageBreak = (neededSpace: number): void => {
    if (y + neededSpace > pageHeight - 30) {
      doc.addPage();
      y = 20;
    }
  };

  // ============ TÍTULO ============
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRATO DE ARRENDAMIENTO DE VEHÍCULO', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // ============ INTRODUCCIÓN ============
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const fechaContrato = new Date().toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const licenciaTexto = usuario.numeroLicencia ? `, portador de Licencia de Conducir No. ${usuario.numeroLicencia}` : '';
  
  const introduccion = `En la ciudad correspondiente, a la fecha ${fechaContrato}, comparecen por una parte LA EMPRESA ARRENDADORA, representada por quien suscribe, en adelante EL ARRENDADOR; y por la otra, ${usuario.nombre.toUpperCase()} ${(usuario.apellido || '').toUpperCase()}, mayor de edad, identificado con ID de usuario ${usuario.id}${licenciaTexto}, correo electrónico ${usuario.email}, en adelante EL ARRENDATARIO. Los comparecientes manifiestan que tienen la capacidad legal para contratar y obligarse, y convienen en celebrar el presente:`;
  
  y = addTextJustified(introduccion, y);
  y += 10;

  doc.setFont('helvetica', 'bold');
  y = addTextJustified('CONTRATO DE ARRENDAMIENTO DE VEHÍCULO, bajo las siguientes cláusulas:', y);
  y += 10;

  // ============ PRIMERA: OBJETO DEL CONTRATO ============
  checkPageBreak(60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PRIMERA: OBJETO DEL CONTRATO', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const clausula1 = 'Por medio del presente instrumento, EL ARRENDADOR da en arrendamiento a EL ARRENDATARIO el vehículo cuyas características se detallan a continuación:';
  y = addTextJustified(clausula1, y);
  y += 8;

  // Detalles del vehículo con viñetas
  doc.text(`Vehículo: ${vehiculo.marca} ${vehiculo.modelo}`, margin + 5, y);
  y += 6;
  doc.text(`Año: ${vehiculo.anio}`, margin + 5, y);
  y += 6;
  doc.text(`Color: ${vehiculo.color || 'No especificado'}`, margin + 5, y);
  y += 6;
  doc.text(`Placas: ${vehiculo.placa}`, margin + 5, y);
  y += 6;
  doc.text(`Categoría: ${vehiculo.categoria?.nombre || 'General'}`, margin + 5, y);
  y += 6;
  doc.text(`Transmisión: ${vehiculo.transmision}`, margin + 5, y);
  y += 6;
  doc.text(`Combustible: ${vehiculo.tipoCombustible}`, margin + 5, y);
  y += 6;
  doc.text(`Capacidad: ${vehiculo.numeroPasajeros} pasajeros • ${vehiculo.numeroPuertas} puertas`, margin + 5, y);
  y += 12;

  // ============ SEGUNDA: DURACIÓN ============
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SEGUNDA: DURACIÓN DEL ARRENDAMIENTO', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const fechaInicio = new Date(solicitud.fechaInicio).toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const fechaFin = new Date(solicitud.fechaFin).toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const numeroTexto = {
    1: 'un', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco', 
    6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez',
    11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince'
  } as any;
  
  const diasTexto = numeroTexto[solicitud.diasRenta] || solicitud.diasRenta;

  const clausula2 = `El período de arrendamiento será por ${diasTexto} (${solicitud.diasRenta}) ${solicitud.diasRenta === 1 ? 'día' : 'días'}, iniciando el ${fechaInicio} y finalizando el ${fechaFin}, fecha en la que EL ARRENDATARIO se obliga a devolver el vehículo.`;
  y = addTextJustified(clausula2, y);
  y += 12;

  // ============ TERCERA: ENTREGA Y DEVOLUCIÓN ============
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TERCERA: ENTREGA Y DEVOLUCIÓN DEL VEHÍCULO', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Lugar de entrega inicial: "${solicitud.lugarRecogida || 'Oficina principal'}"`, margin + 5, y);
  y += 8;
  doc.text(`Lugar de devolución: "${solicitud.lugarEntrega || 'Oficina principal'}"`, margin + 5, y);
  y += 10;

  const clausula3 = 'EL ARRENDATARIO se compromete a recibir y devolver el vehículo en los lugares y fechas pactadas, en las mismas condiciones en las que lo recibe, salvo el desgaste natural propio del uso razonable.';
  y = addTextJustified(clausula3, y);
  y += 12;

  // ============ CUARTA: PRECIO ============
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CUARTA: PRECIO DEL ARRENDAMIENTO', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const clausula4 = 'En concepto de alquiler del vehículo descrito, EL ARRENDATARIO pagará a EL ARRENDADOR:';
  y = addTextJustified(clausula4, y);
  y += 8;

  doc.text(`Precio total del arrendamiento: $${solicitud.precioTotal.toFixed(2)} USD`, margin + 5, y);
  y += 8;
  const textoDeposito = `Depósito en garantía: $${solicitud.deposito.toFixed(2)} USD, reembolsables al finalizar el contrato si no existieren daños, multas, infracciones o adeudos relacionados con el uso del vehículo.`;
  y = addTextJustified(textoDeposito, y, 10);
  y += 10;
  
  // Método de pago
  const metodoPagoTexto = solicitud.pagos?.[0]?.metodoPago || 'NO ESPECIFICADO';
  const metodoPagoDescripcion = metodoPagoTexto === 'EFECTIVO' 
    ? 'Efectivo (pago presencial al recoger el vehículo)'
    : metodoPagoTexto === 'TARJETA'
    ? 'Tarjeta de crédito/débito (pago procesado)'
    : metodoPagoTexto;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Método de pago: `, margin + 5, y);
  doc.setFont('helvetica', 'normal');
  const metodoPagoWidth = doc.getTextWidth('Método de pago: ');
  doc.text(metodoPagoDescripcion, margin + 5 + metodoPagoWidth, y);
  y += 12;

  // ============ QUINTA: OBLIGACIONES DEL ARRENDATARIO ============
  checkPageBreak(80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('QUINTA: OBLIGACIONES DEL ARRENDATARIO', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const obligaciones = [
    'Conducir el vehículo conforme a las leyes de tránsito vigentes.',
    'No permitir que el vehículo sea conducido por personas no autorizadas.',
    'No utilizar el vehículo para fines ilícitos, transporte de mercancía ilegal, ni en actividades que pongan en riesgo la integridad del mismo.',
    'Notificar inmediatamente a EL ARRENDADOR en caso de accidente, avería o anomalía.',
    'Asumir gastos por:'
  ];

  obligaciones.forEach((obligacion) => {
    checkPageBreak(15);
    const bullet = '• ';
    const lines = doc.splitTextToSize(obligacion, pageWidth - 2 * margin - 10);
    doc.text(bullet, margin + 5, y);
    doc.text(lines, margin + 10, y);
    y += lines.length * 5 + 2;
  });

  // Sub-items de gastos
  const gastos = ['Combustible.', 'Multas o infracciones cometidas durante el período de uso.', 'Daños ocasionados por negligencia, mal uso o incumplimiento del contrato.'];
  gastos.forEach((gasto) => {
    checkPageBreak(10);
    doc.text(`     - ${gasto}`, margin + 10, y);
    y += 6;
  });
  y += 8;

  // ============ SEXTA: RESPONSABILIDAD POR DAÑOS ============
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SEXTA: RESPONSABILIDAD POR DAÑOS', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const clausula6 = 'EL ARRENDATARIO será responsable de cualquier daño ocasionado al vehículo, a terceros o a bienes de terceros durante el uso del mismo. El depósito podrá ser utilizado parcial o totalmente para cubrir dichos daños.';
  y = addTextJustified(clausula6, y);
  y += 12;

  // ============ SÉPTIMA: SEGURO Y ASISTENCIA ============
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SÉPTIMA: SEGURO Y ASISTENCIA', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const clausula7 = 'EL ARRENDADOR declara que el vehículo cuenta con las coberturas básicas establecidas por la ley. Cualquier deducible o cobertura adicional será responsabilidad económica del ARRENDATARIO, salvo pacto en contrario.';
  y = addTextJustified(clausula7, y);
  y += 12;

  // ============ OCTAVA: INCUMPLIMIENTO ============
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('OCTAVA: INCUMPLIMIENTO', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const clausula8 = 'El incumplimiento de cualquiera de las condiciones aquí establecidas faculta a EL ARRENDADOR para dar por terminado el contrato de manera inmediata, exigir la devolución del vehículo y realizar los cobros correspondientes.';
  y = addTextJustified(clausula8, y);
  y += 12;

  // ============ NOVENA: JURISDICCIÓN ============
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('NOVENA: JURISDICCIÓN', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const clausula9 = 'Para todos los efectos legales, las partes se someten a la jurisdicción de los tribunales competentes del lugar donde se suscribe el presente contrato.';
  y = addTextJustified(clausula9, y);
  y += 12;

  // ============ DÉCIMA: ACEPTACIÓN ============
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DÉCIMA: ACEPTACIÓN', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const clausula10 = 'Leído que fue el presente contrato y enteradas las partes de su contenido, lo firman en dos ejemplares de un mismo tenor.';
  y = addTextJustified(clausula10, y);
  y += 20;

  // ============ FIRMAS ============
  checkPageBreak(80);
  
  // Espacios para firmas
  y += 15;

  // Firma del Arrendador (Izquierda)
  const col1X = margin + 10;
  const col2X = pageWidth / 2 + 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('FIRMA DEL ARRENDADOR', col1X, y);
  y += 20;
  
  doc.setLineWidth(0.5);
  doc.line(col1X, y, col1X + 60, y);
  y += 6;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Nombre: ____________________________', col1X, y);
  y += 6;
  doc.text('Cargo: ______________________________', col1X, y);

  // Firma del Arrendatario (Derecha)
  y -= 32;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('FIRMA DEL ARRENDATARIO', col2X, y);
  y += 20;
  
  doc.setLineWidth(0.5);
  doc.line(col2X, y, col2X + 60, y);
  y += 6;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const nombreCompleto = `${usuario.nombre.toUpperCase()} ${(usuario.apellido || '').toUpperCase()}`;
  doc.text(nombreCompleto, col2X, y);

  // Descargar el PDF
  const nombreArchivo = `Contrato_Arrendamiento_${solicitud.id}.pdf`;
  doc.save(nombreArchivo);
}
