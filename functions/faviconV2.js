// functions/faviconV2.js
export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  
  // --- REDIRECCIÓN PARA PAGES.DEV ---
  if (url.hostname !== 'letter-it.b4.cc.cd') {
    const newUrl = new URL(request.url);
    newUrl.hostname = 'letter-it.b4.cc.cd';
    newUrl.protocol = 'https';
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': newUrl.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
  
  // --- LÓGICA DE FAVICONV2 ---
  const targetUrl = url.searchParams.get('url') || '';
  const size = url.searchParams.get('size') || '256';
  const customColor = url.searchParams.get('color') || '';

  // Validar que url no esté vacío
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
  
  // Validar que sea una URL válida
  try {
    new URL(finalUrl);
  } catch {
    return new Response('Error: Invalid "url" format. Use domain like "google.com" or "https://google.com"', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // Extraer el dominio limpio
  const cleanDomain = finalUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
  const initial = cleanDomain ? cleanDomain.charAt(0).toUpperCase() : "?";

  // Validar size
  const sizeNum = parseInt(size);
  if (isNaN(sizeNum) || sizeNum <= 0) {
    return new Response('Error: "size" must be a positive number.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // --- MANEJO DEL COLOR ---
  let finalColor;
  let displayColor = 'random'; // Para mostrar en el título
  
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
      return new Response('Error: Invalid color format. Use 6-digit HEX (e.g., 4285f4, %4285f4, or #4285f4)', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    finalColor = '#' + cleanColor;
    displayColor = cleanColor; // Guardar sin # para el título
  } else {
    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;
    
    finalColor = '#' + 
      r.toString(16).padStart(2, '0') + 
      g.toString(16).padStart(2, '0') + 
      b.toString(16).padStart(2, '0');
    
    displayColor = finalColor.replace('#', ''); // Mostrar el color generado
  }

  // --- TÍTULO AUTOMÁTICO ---
  const pageTitle = `${cleanDomain} - ${sizeNum}px - ${displayColor}`;

  // Generar SVG con título
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${sizeNum}" height="${sizeNum}" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="8" fill="${finalColor}" />
    <text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="bold">${initial}</text>
  </svg>
  `.trim();

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': `inline; filename="${cleanDomain}-${sizeNum}x${sizeNum}-${displayColor}.svg"`
    }
  });
}
