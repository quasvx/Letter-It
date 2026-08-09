export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  
  // Obtener el hostname actual
  const hostname = url.hostname;
  
  // Si NO es letter-it.b4.cc.cd, redirigir a letter-it.b4.cc.cd
  if (hostname !== 'letter-it.b4.cc.cd') {
    // Construir la nueva URL con el mismo path, query params y hash
    const newUrl = new URL(request.url);
    newUrl.hostname = 'letter-it.b4.cc.cd';
    newUrl.protocol = 'https';
    
    // Redirigir con 302 (Found - Temporal)
    return new Response(null, {
      status: 302,
      headers: {
        'Location': newUrl.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate' // No cachear redirección temporal
      }
    });
  }
  
  // Si ya es letter-it.b4.cc.cd, dejar pasar normalmente
  return context.next();
}
