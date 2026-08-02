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

  // --- COLOR - SIN IGNORAR ---
  let finalColor;
  
  // Función para verificar si es un HEX válido
  function isValidHex(color) {
    const clean = color.replace('#', '');
    return /^[0-9a-fA-F]{6}$/.test(clean);
  }

  // Si hay color personalizado
  if (customColor) {
    const cleanColor = customColor.replace('#', '');
    
    if (!isValidHex(customColor)) {
      return new Response('Error: Invalid "color" format. Must be a valid 6-digit HEX (e.g., #4285f4 or 4285f4).', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // USAR EL COLOR QUE EL USUARIO PIDIÓ - SIN MODIFICAR
    finalColor = '#' + cleanColor;
    
  } else {
    // Si no hay color, generar uno aleatorio OSCURO
    let randomColor;
    let attempts = 0;
    
    do {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      if (luminance <= 0.7) {
        randomColor = '#' + 
          r.toString(16).padStart(2, '0') + 
          g.toString(16).padStart(2, '0') + 
          b.toString(16).padStart(2, '0');
        break;
      }
      
      attempts++;
    } while (attempts < 100);
    
    finalColor = randomColor || '#2563eb';
  }

  // Extraer la inicial
  const cleanDomain = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
  const initial = cleanDomain ? cleanDomain.charAt(0).toUpperCase() : "?";

  // --- SVG CON PATH EN LUGAR DE RECT ---
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${sizeNum}" height="${sizeNum}" viewBox="0 0 128 128">
    <!-- Path cuadrado con bordes redondeados -->
    <path d="M 20 0 L 108 0 C 119.045 0 128 8.955 128 20 L 128 108 C 128 119.045 119.045 128 108 128 L 20 128 C 8.955 128 0 119.045 0 108 L 0 20 C 0 8.955 8.955 0 20 0 Z" fill="${finalColor}" />
    <text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="bold">${initial}</text>
  </svg>
  `.trim();

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
