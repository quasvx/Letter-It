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
    // Eliminamos el # si existe y validamos que sea un hex válido
    const cleanColor = customColor.replace('#', '');
    if (/^[0-9a-f]{6}$/i.test(cleanColor)) {
      finalColor = '#' + cleanColor;
    } else {
      // Si el color no es válido, generamos uno aleatorio
      finalColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }
  } else {
    // Generamos color aleatorio
    finalColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  }

  // Creamos el SVG - Ahora con el texto perfectamente centrado
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="8" fill="${finalColor}" />
    <text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="bold">${initial}</text>
  </svg>
  `.trim();

  // Devolvemos el SVG directamente
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
