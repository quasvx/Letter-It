export async function onRequest(context) {
  // Obtener la URL de la request
  const url = new URL(context.request.url);
  
  // Obtener parámetros
  const targetUrl = url.searchParams.get('url') || '';
  const size = url.searchParams.get('size') || '256';
  const customColor = url.searchParams.get('color') || '';

  // Validar URL
  if (!targetUrl) {
    return new Response('Error: "url" parameter is required.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  try {
    new URL(targetUrl);
  } catch {
    return new Response('Error: Invalid "url" format.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // Validar size
  const sizeNum = parseInt(size);
  if (isNaN(sizeNum) || sizeNum <= 0) {
    return new Response('Error: "size" must be a positive number.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // --- EL COLOR ---
  let finalColor;
  
  if (customColor) {
    // Limpiar el color
    const cleanColor = customColor.replace('#', '');
    
    // Validar HEX
    if (!/^[0-9a-fA-F]{6}$/.test(cleanColor)) {
      return new Response('Error: Invalid color format. Use 6-digit HEX (e.g., #4285f4 or 4285f4)', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // USAR EL COLOR EXACTO
    finalColor = '#' + cleanColor;
    
  } else {
    // Color aleatorio (oscuro)
    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;
    
    finalColor = '#' + 
      r.toString(16).padStart(2, '0') + 
      g.toString(16).padStart(2, '0') + 
      b.toString(16).padStart(2, '0');
  }

  // Extraer inicial
  const cleanDomain = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
  const initial = cleanDomain ? cleanDomain.charAt(0).toUpperCase() : "?";

  // --- GENERAR SVG ---
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${sizeNum}" height="${sizeNum}" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="8" fill="${finalColor}" />
    <text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="bold">${initial}</text>
  </svg>
  `.trim();

  // --- DEVOLVER SVG ---
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
