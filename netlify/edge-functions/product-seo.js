// Every visitor receives the same product HTML, including crawlers without JavaScript.
// This serves catalogue information only. Quotes and payments still use the existing calculator.
import pages from '../../_generated/product-pages.mjs';

export default async function productPage(request, context) {
 if (!['GET', 'HEAD'].includes(request.method)) return context.next();
 const url = new URL(request.url);
 if (url.hostname === 'www.victoria-diamonds.com') {
  url.hostname = 'victoria-diamonds.com';url.protocol = 'https:';
  return new Response(null, {status:301, headers:{Location:url.href}});
 }
 if (url.pathname === '/product') {
  url.pathname = '/product.html';
  return new Response(null, {status:301, headers:{Location:url.href}});
 }
 const id = url.searchParams.get('item');
 const page = Object.hasOwn(pages.products, id) ? pages.products[id] : null;
 const headers = new Headers({'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'});
 if (page) headers.set('Link', '<'+page.canonical+'>; rel="canonical"');
 else headers.set('X-Robots-Tag','noindex');
 return new Response(request.method === 'HEAD' ? null : page?.html || pages.notFound, {status:page ? 200 : 404, headers});
}
