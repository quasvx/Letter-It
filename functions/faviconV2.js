export async function onRequest(context) {
  // Leemos la URL de la petición para sacar los parámetros (?url=...&size=...)
  const urlObj = new URL(context.request.url);
  const targetUrl = urlObj.searchParams.get('url') || '';
  const size = urlObj.searchParams.get('size') || '256'; // Por defecto 256 si no le pasas el parámetro
  
  // Limpiamos el texto para quedarnos solo con el dominio (ej. go.link-it.cc.cd)
  const cleanDomain = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
  
  // Sacamos la inicial (o ponemos "?" si viene vacío)
  const initial = cleanDomain ? cleanDomain.charAt(0).toUpperCase() : "?";

  // Generamos el color aleatorio
  const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');

  // Creamos el SVG usando el tamaño que pasaste por URL
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="28" fill="${randomColor}" />
    <text x="50%" y="50%" alignment-baseline="central" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="64" font-weight="bold">${initial}</text>
  </svg>
  `.trim();

  // Devolvemos el SVG directamente
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*" // Por si lo llamas desde otros dominios
    }
  });
}
