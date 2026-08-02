export async function onRequest(context) {
  // Leemos la URL de la petición para sacar los parámetros
  const urlObj = new URL(context.request.url);
  const targetUrl = urlObj.searchParams.get('url') || '';
  const size = urlObj.searchParams.get('size') || '256';
  const customColor = urlObj.searchParams.get('color') || '';
  
  // Limpiamos el texto para quedarnos solo con el dominio
  const cleanDomain = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
  
  // Sacamos la inicial (o ponemos "?" si viene vacío)
  const initial = cleanDomain ? cleanDomain.charAt(0).toUpperCase() : "?";

  // Generamos el color aleatorio o usamos el color personalizado
  let finalColor;
  if (customColor) {
    const cleanColor = customColor.replace('#', '');
    if (/^[0-9a-f]{6}$/i.test(cleanColor)) {
      finalColor = '#' + cleanColor;
    } else {
      finalColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }
  } else {
    finalColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  }

  // Si es una petición directa al endpoint, devolvemos el SVG
  const acceptHeader = context.request.headers.get('accept') || '';
  if (acceptHeader.includes('image/svg+xml') || !acceptHeader.includes('text/html')) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="8" fill="${finalColor}" />
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

  // Si es un navegador, devolvemos HTML con el SVG centrado
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Letter-It | Favicon Generator</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #f8f9fa;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        padding: 2rem;
      }
      
      .favicon-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 3rem;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      }
      
      .favicon-wrapper svg {
        display: block;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      }
      
      .info {
        text-align: center;
        color: #64748b;
        font-size: 0.95rem;
      }
      
      .info code {
        background: #f1f5f9;
        padding: 0.2rem 0.6rem;
        border-radius: 4px;
        font-size: 0.85rem;
        color: #2563eb;
      }
      
      .info strong {
        color: #1a1a2e;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="favicon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
          <rect width="128" height="128" rx="8" fill="${finalColor}" />
          <text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="bold">${initial}</text>
        </svg>
      </div>
      <div class="info">
        <strong>${cleanDomain || 'example.com'}</strong> → Letter: <strong>${initial}</strong><br>
        <code>${finalColor}</code> • <code>${size}×${size}</code>
      </div>
    </div>
  </body>
  </html>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
