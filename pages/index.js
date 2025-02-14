export const config = {
  runtime: 'edge'
};

export default function handler(request) {
  return new Response(
    JSON.stringify({
      status: 'Blog Summary API',
      endpoints: {
        summary: '/api/fetch'
      },
      version: '1.0'
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}