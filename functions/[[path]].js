// functions/[[path]].js
export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  
  // --- REDIRIGIR TODAS LAS RUTAS A B4.CC.CD ---
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
  
  // --- SI YA ESTÁ EN B4.CC.CD, DEJAR PASAR ---
  // Aquí se ejecuta la lógica normal (faviconV2, páginas estáticas, etc.)
  return context.next();
}
