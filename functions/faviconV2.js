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

  const cleanDomain = finalUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
  
  // --- REGLA ESPECIAL: SI ES LETTER-IT, DEVOLVER PNG ---
  if (cleanDomain.toLowerCase() === 'letter-it.b4.cc.cd' || 
      cleanDomain.toLowerCase() === 'letter-it.pages.dev') {
    try {
      const image = await context.env.ASSETS.fetch(new URL('/images/favicon.png', request.url));
      if (image.status === 200) {
        return new Response(image.body, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    } catch {
      // Fallback a SVG
    }
  }

  // --- GENERAR SVG ---
  const initial = cleanDomain ? cleanDomain.charAt(0).toUpperCase() : "?";
  const sizeNum = parseInt(size);
  if (isNaN(sizeNum) || sizeNum <= 0) {
    return new Response('Error: "size" must be a positive number.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

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
      return new Response('Error: Invalid color format.', {
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

  const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${sizeNum}" height="${sizeNum}" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="8" fill="${finalColor}" />
    <text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="64" font-weight="bold">${initial}</text>
  </svg>
  `.trim();

  // --- GENERAR HTML CON TÍTULO Y SVG CENTRADO ---
  const pageTitle = `${cleanDomain} - ${sizeNum}px - ${displayColor}`;
  
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Letter-It | ${pageTitle}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #0a0a0f;
      }
    </style>
  </head>
  <body>
    ${svgContent}
  </body>
  </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
