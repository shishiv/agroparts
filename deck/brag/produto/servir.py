"""Serve o deck desta pasta em http://127.0.0.1:8931/, sem cache e sem internet."""

import functools
import http.server
import pathlib
import sys

PASTA = pathlib.Path(__file__).resolve().parent
PORTA = int(sys.argv[1]) if len(sys.argv) > 1 else 8931


class SemCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *args):
        pass


servidor = http.server.ThreadingHTTPServer(("127.0.0.1", PORTA), functools.partial(SemCache, directory=PASTA))
print(f"Deck em http://127.0.0.1:{PORTA}/  (Ctrl+C para parar)", flush=True)
servidor.serve_forever()
