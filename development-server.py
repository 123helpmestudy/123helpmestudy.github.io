import http.server
import socketserver

PORT = 9001

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f'Navigate to http://localhost:{PORT}')
    httpd.serve_forever()