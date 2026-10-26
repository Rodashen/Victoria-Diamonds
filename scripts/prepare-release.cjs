// Netlify and CI run the same SEO checks on every deployment. No calculator credentials are needed.
const path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
for(const file of ['scripts/generate-product-html.cjs','scripts/generate-seo-routing.cjs','scripts/generate-sitemap.cjs'])execFileSync(process.execPath,[file],{cwd:root,stdio:'inherit'});
execFileSync(process.execPath,['--test','tests/seo-release.test.cjs'],{cwd:root,stdio:'inherit'});
