export async function onRequest(context) {
  const urlObj = new URL(context.request.url);
  
  // Verificar que SOLO existan los parámetros permitidos
  const allowedParams = ['url', 'size', 'color'];
  const receivedParams = Array.from(urlObj.searchParams.keys());
  const hasInvalidParams = receivedParams.some(param => !allowedParams.includes(param));
  
  if (hasInvalidParams) {
    return new Response('Error: Invalid parameters. Only "url", "size", and "color" are allowed.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  const targetUrl = urlObj.searchParams.get('url') || '';
  const size = urlObj.searchParams.get('size') || '256';
  const customColor = urlObj.searchParams.get('color') || '';

  // Validar que url no esté vacío
  if (!targetUrl) {
    return new Response('Error: "url" parameter is required.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // Validar que url sea una URL válida
  try {
    new URL(targetUrl);
  } catch {
    return new Response('Error: Invalid "url" format. Must be a valid URL.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // Validar que size sea un número positivo
  const sizeNum = parseInt(size);
  if (isNaN(sizeNum) || sizeNum <= 0) {
    return new Response('Error: "size" must be a positive number.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // Función para validar y ajustar brillo del color
  function validateAndAdjustColor(hexColor) {
    // Eliminar # si existe
    const cleanColor = hexColor.replace('#', '');
    
    // Debe ser exactamente 6 caracteres hexadecimales
    if (!/^[0-9a-fA-F]{6}$/.test(cleanColor)) {
      return null; // Color inválido
    }
    
    // Calcular el brillo (percepción humana)
    const r = parseInt(cleanColor.substr(0, 2), 16);
    const g = parseInt(cleanColor.substr(2, 2), 16);
    const b = parseInt(cleanColor.substr(4, 2), 16);
    
    // Fórmula de luminosidad perceptiva (https://www.w3.org/TR/WCAG20/#relativeluminancedef)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Si el brillo es muy alto (> 0.7), oscurecer el color
    if (luminance > 0.7) {
      // Oscurecer un 40%
      const darkR = Math.floor(r * 0.6);
      const darkG = Math.floor(g * 0.6);
      const darkB = Math.floor(b * 0.6);
      return '#' + 
        darkR.toString(16).padStart(2, '0') + 
        darkG.toString(16).padStart(2, '0') + 
        darkB.toString(16).padStart(2, '0');
    }
    
    return '#' + cleanColor;
  }

  // Generar color
  let finalColor;
  if (customColor) {
    const adjustedColor = validateAndAdjustColor(customColor);
    if (!adjustedColor) {
      return new Response('Error: Invalid "color" format. Must be a valid 6-digit HEX code (e.g., #4285f4 or 4285f4).', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    finalColor = adjustedColor;
  } else {
    // Generar colores aleatorios hasta encontrar uno suficientemente oscuro
    let attempts = 0;
    let randomColor;
    let luminance;
    
    do {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      
      // Calcular luminosidad
      luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      if (luminance <= 0.7) {
        randomColor = '#' + 
          r.toString(16).padStart(2, '0') + 
          g.toString(16).padStart(2, '0') + 
          b.toString(16).padStart(2, '0');
        break;
      }
      
      attempts++;
    } while (attempts < 50); // Máximo 50 intentos para evitar loop infinito
    
    // Si no encontró un color oscuro después de 50 intentos, usar uno fijo
    if (!randomColor) {
      randomColor = '#2563eb'; // Azul oscuro por defecto
    }
    
    finalColor = randomColor;
  }

  // Extraer la inicial
  const cleanDomain = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
  const initial = cleanDomain ? cleanDomain.charAt(0).toUpperCase() : "?";

  // Generar el SVG
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${sizeNum}" height="${sizeNum}" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="8" fill="${finalColor}" />
    <text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="bold">${initial}</text>
  </svg>
  `.trim();

  // Devolver el SVG
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
