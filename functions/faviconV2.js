// functions/faviconV1.js
export async function onRequest(context) {
  const url = new URL(context.request.url);
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
  const initial = cleanDomain ? cleanDomain.charAt(0).toUpperCase() : "?";
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

  // --- GENERAR SVG CON TÍTULO (para accesibilidad y tooltip) ---
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sizeNum}" height="${sizeNum}" viewBox="0 0 128 128">
    <title>${cleanDomain} - ${sizeNum}px - ${displayColor}</title>
    <rect width="128" height="128" rx="8" fill="${finalColor}" />
    <text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="64" font-weight="bold">${initial}</text>
  </svg>`;

  // --- CONVERTIR SVG A PNG USANDO API EXTERNA ---
  try {
    const svgEncoded = encodeURIComponent(svg);
    const pngUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${sizeNum}x${sizeNum}&data=${svgEncoded}&format=png`;
    
    const response = await fetch(pngUrl);
    
    if (!response.ok) {
      throw new Error('Failed to convert SVG to PNG');
    }
    
    const pngBuffer = await response.arrayBuffer();

    return new Response(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
        'Content-Disposition': `inline; filename="${cleanDomain}-${sizeNum}.png"`
      }
    });
    
  } catch (error) {
    // Fallback: devolver SVG si falla la conversión
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
