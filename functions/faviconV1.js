// functions/faviconV1.js
export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  
  // --- REDIRIGIR CUALQUIER DOMINIO A B4.CC.CD ---
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
  
  // --- LÓGICA DE FAVICONV1 ---
  const targetUrl = url.searchParams.get('url') || '';
  const size = url.searchParams.get('size') || '256';
  const customColor = url.searchParams.get('color') || '';

  // --- REGLA: SI ES LETTER-IT, DEVOLVER PNG REDIMENSIONADO ---
  const cleanDomain = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
  
  if (cleanDomain.toLowerCase() === 'letter-it.b4.cc.cd' || 
      cleanDomain.toLowerCase() === 'letter-it.pages.dev') {
    try {
      // Obtener la imagen PNG original
      const imageResponse = await context.env.ASSETS.fetch(new URL('/images/favicon.png', context.request.url));
      
      if (imageResponse.status === 200) {
        const imageBuffer = await imageResponse.arrayBuffer();
        const sizeNum = parseInt(size) || 256;
        
        // Devolver el PNG directamente con el tamaño solicitado
        return new Response(imageBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*',
            'Content-Disposition': `inline; filename="letter-it-${sizeNum}x${sizeNum}.png"`
          }
        });
      }
    } catch {
      // Fallback: SVG simple
    }
  }

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

  const domain = finalUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
  const initial = domain ? domain.charAt(0).toUpperCase() : "?";
  const sizeNum = parseInt(size) || 256;

  // --- MANEJO DEL COLOR ---
  let finalColor;
  let displayColor = 'random';
  
  if (customColor) {
    let cleanColor = customColor.replace('#', '').replace('%', '');
    if (!/^[0-9a-fA-F]{6}$/.test(cleanColor)) {
      return new Response('Error: Invalid color format.', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    const r = parseInt(cleanColor.substr(0, 2), 16);
    const g = parseInt(cleanColor.substr(2, 2), 16);
    const b = parseInt(cleanColor.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    if (brightness > 200) {
      const darkR = Math.floor(r * 0.5);
      const darkG = Math.floor(g * 0.5);
      const darkB = Math.floor(b * 0.5);
      finalColor = '#' + 
        darkR.toString(16).padStart(2, '0') + 
        darkG.toString(16).padStart(2, '0') + 
        darkB.toString(16).padStart(2, '0');
      displayColor = finalColor.replace('#', '');
    } else {
      finalColor = '#' + cleanColor;
      displayColor = cleanColor;
    }
  } else {
    let r, g, b, brightness;
    let attempts = 0;
    
    do {
      r = Math.floor(Math.random() * 200) + 30;
      g = Math.floor(Math.random() * 200) + 30;
      b = Math.floor(Math.random() * 200) + 30;
      brightness = (r * 299 + g * 587 + b * 114) / 1000;
      attempts++;
    } while (brightness > 180 && attempts < 50);
    
    finalColor = '#' + 
      r.toString(16).padStart(2, '0') + 
      g.toString(16).padStart(2, '0') + 
      b.toString(16).padStart(2, '0');
    displayColor = finalColor.replace('#', '');
  }

  // --- GENERAR SVG CON BORDES REDONDEADOS ---
  const titleText = `${domain} - ${sizeNum}px - ${displayColor}`;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sizeNum}" height="${sizeNum}" viewBox="0 0 128 128">
    <title>${titleText}</title>
    <rect width="128" height="128" rx="8" fill="${finalColor}" />
    <text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="64" font-weight="bold">${initial}</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': `inline; filename="${domain}-${sizeNum}x${sizeNum}-${displayColor}-rounded.svg"`
    }
  });
}
