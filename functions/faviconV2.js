export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  
  // --- REDIRECCIÓN 302 SI NO ES letter-it.b4.cc.cd ---
  const hostname = url.hostname;
  
  if (hostname !== 'letter-it.b4.cc.cd') {
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
  
  // --- CONTINUAR CON LA LÓGICA NORMAL DE FAVICONV2 ---
  const targetUrl = url.searchParams.get('url') || '';
  const size = url.searchParams.get('size') || '256';
  const customColor = url.searchParams.get('color') || '';

  // --- CONDICIÓN ESPECIAL PARA DOMINIOS PROPIOS ---
  const cleanTarget = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
  
  // Lista de dominios que deben mostrar la imagen PNG
  const specialDomains = [
    'letter-it.pages.dev',
    'letter-it.b4.cc.cd'
  ];
  
  if (specialDomains.some(domain => cleanTarget.toLowerCase() === domain)) {
    try {
      const image = await context.env.ASSETS.fetch(new URL('/images/favicon.png', context.request.url));
      
      if (image.status === 200) {
        return image;
      }
      
      const fallbackSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
        <rect width="128" height="128" rx="8" fill="#2563eb" />
        <text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="64" font-weight="700">L</text>
      </svg>`;
      
      return new Response(fallbackSvg, {
        headers: { 'Content-Type': 'image/svg+xml' }
      });
      
    } catch {
      const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
        <rect width="128" height="128" rx="8" fill="#2563eb" />
        <text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="64" font-weight="700">L</text>
      </svg>`;
      
      return new Response(svg, {
        headers: { 'Content-Type': 'image/svg+xml' }
      });
    }
  }

  // --- COMPORTAMIENTO NORMAL PARA OTROS DOMINIOS ---
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

  const sizeNum = parseInt(size);
  if (isNaN(sizeNum) || sizeNum <= 0) {
    return new Response('Error: "size" must be a positive number.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // --- MANEJO DEL COLOR ---
  let finalColor;
  
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
    
  } else {
    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;
    
    finalColor = '#' + 
      r.toString(16).padStart(2, '0') + 
      g.toString(16).padStart(2, '0') + 
      b.toString(16).padStart(2, '0');
  }

  const cleanDomain = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
  const initial = cleanDomain ? cleanDomain.charAt(0).toUpperCase() : "?";

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
      'Access-Control-Allow-Origin': '*'
    }
  });
}
