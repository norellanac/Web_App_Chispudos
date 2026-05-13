import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'handle-spa-routing-for-github-pages',
      closeBundle() {
        // Path to the build output directory
        const distPath = path.resolve(__dirname, 'dist')
        
        // Create 404.html file for GitHub Pages
        const indexPath = path.join(distPath, 'index.html')
        const notFoundPath = path.join(distPath, '404.html')
        
        if (fs.existsSync(indexPath)) {
          // Read the index.html content
          let indexContent = fs.readFileSync(indexPath, 'utf8')
          
          // Add a script that preserves the URL on 404 redirects
          const redirectScript = `
            <script>
              // Single Page Apps for GitHub Pages with custom domain
              // Based on https://github.com/rafgraph/spa-github-pages
              (function() {
                // This only runs on the 404.html page
                var pathSegments = location.pathname.split('/');
                var redirectUrl = location.protocol + '//' + location.hostname + 
                  (location.port ? ':' + location.port : '') +
                  '/?' + 
                  pathSegments.slice(1).join('/');
                  
                location.replace(redirectUrl);
              })();
            </script>
          `;
          
          // Create a simple 404.html with the redirect script
          const notFoundContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Redirecting...</title>
                ${redirectScript}
              </head>
              <body>
                <h1>Redirecting...</h1>
              </body>
            </html>
          `;
          
          // Write the 404.html file
          fs.writeFileSync(notFoundPath, notFoundContent);
          
          // Add a script to index.html to handle the redirect from 404.html
          const indexScript = `
            <script>
              // Handle redirect from 404.html
              (function() {
                var redirectPath = null;
                var search = window.location.search;
                if (search.indexOf('?') === 0) {
                  // Get the path from the redirect
                  redirectPath = search.substr(1);
                  
                  // Replace the URL in the address bar without reloading
                  if (redirectPath) {
                    history.replaceState(null, null, '/' + redirectPath);
                  }
                }
              })();
            </script>
          `;
          
          // Insert the script right after the opening body tag
          indexContent = indexContent.replace('<body>', '<body>' + indexScript);
          
          // Write the modified index.html
          fs.writeFileSync(indexPath, indexContent);
        }
        
        // Also create a CNAME file if it doesn't exist
        const cnamePath = path.join(distPath, 'CNAME');
        if (!fs.existsSync(cnamePath)) {
          fs.writeFileSync(cnamePath, 'recolatam.com');
        }
      }
    }
  ],
  base: '/', // Use root path for custom domain
  server: {
    host: true, // Allows using the LAN IP
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})