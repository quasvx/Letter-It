// functions/faviconV2.js
export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  
  // --- OBTENER PARÁMETROS ---
  const targetUrl = url.searchParams.get('url') || '';
  const size = url.searchParams.get('size') || '256';
  const customColor = url.searchParams.get('color') || '';

  // --- VALIDAR URL ---
  if (!targetUrl) {
    return new Response('Error: "url" parameter is required.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // Aceptar URL sin https://
  let finalUrl = targetUrl;
  if (!/^https?:\/\//i.test(finalUrl)) {
    finalUrl = 'https://' + finalUrl;
  }
  
  try {
    new URL(finalUrl);
  } catch {
    return new Response('Error: Invalid "url" format.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // --- EXTRAER DOMINIO LIMPIO ---
  const cleanDomain = finalUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
  
  // --- REGLA ESPECIAL: SI ES LETTER-IT, DEVOLVER PNG ---
  if (cleanDomain.toLowerCase() === 'letter-it.b4.cc.cd' || 
      cleanDomain.toLowerCase() === 'letter-it.pages.dev') {
    try {
      // Intentar servir la imagen PNG desde /images/favicon.png
      const image = await context.env.ASSETS.fetch(new URL('/images/favicon.png', request.url));
      if (image.status === 200) {
        // Devolver el PNG con título en el header
        return new Response(image.body, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*',
            'Content-Disposition': `inline; filename="letter-it-favicon.png"`
          }
        });
      }
    } catch {
      // Si falla, continuar con SVG (fallback)
    }
  }

  // --- PARA CUALQUIER OTRO DOMINIO: GENERAR SVG ---
  const initial = cleanDomain ? cleanDomain.charAt(0).toUpperCase() : "?";

  const sizeNum = parseInt(size);
  if (isNaN(sizeNum) || sizeNum <= 0) {
    return new Response('Error: "size" must be a positive number.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // --- MANEJO DEL COLOR ---
  let finalColor;
  let displayColor = 'random';
  
  if (customColor) {
    let decodedColor = customColor;
    try {
      decodedColor = decodeURIComponent(customColor);
    } catch {
      decodedColor = customColor;
    }
    
    let cleanColor = decodedColor;
    if (cleanColor.startsWith('%')) {
      cleanColor = cleanColor.substring(1);
    }
    cleanColor = cleanColor.replace('#', '');
    
    if (!/^[0-9a-fA-F]{6}$/.test(cleanColor)) {
      return new Response('Error: Invalid color format. Use 6-digit HEX.', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    finalColor = '#' + cleanColor;
    displayColor = cleanColor;
  } else {
    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;
    finalColor = '#' + 
      r.toString(16).padStart(2, '0') + 
      g.toString(16).padStart(2, '0') + 
      b.toString(16).padStart(2, '0');
    displayColor = finalColor.replace('#', '');
  }

  // --- GENERAR SVG ---
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${sizeNum}" height="${sizeNum}" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="8" fill="${finalColor}" />
    <text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="64" font-weight="bold">${initial}</text>
  </svg>
  `.trim();

  // Devolver SVG
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': `inline; filename="${cleanDomain}-${sizeNum}x${sizeNum}-${displayColor}.svg"`
    }
  });
}
