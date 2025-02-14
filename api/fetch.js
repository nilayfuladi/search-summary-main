import { processContent } from '../utils/contentProcessor';
import { extractMedia } from '../utils/mediaExtractor';
import { generateOutline } from '../utils/outlineGenerator';
import * as cheerio from 'cheerio';

export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  if (request.method === 'GET') {
    return new Response(
      JSON.stringify({ status: 'Blog Summary API is running!' }),
      { headers }
    );
  }

  if (request.method === 'POST') {
    try {
      const { url } = await request.json();

      if (!url) {
        return new Response(
          JSON.stringify({ error: 'URL is required' }),
          { status: 400, headers }
        );
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch webpage: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const [content, media, outline] = await Promise.all([
        processContent($),
        extractMedia($, url),
        generateOutline($)
      ]);

      return new Response(
        JSON.stringify({
          content,
          media,
          outline,
          url
        }),
        { headers }
      );

    } catch (error) {
      console.error('Error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process webpage',
          details: error.message
        }),
        { status: 500, headers }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers }
  );
}