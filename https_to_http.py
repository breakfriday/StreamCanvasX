from mitmproxy import http

def request(flow: http.HTTPFlow) -> None:
    # Only process requests to dev.local.com:3000
    if flow.request.pretty_host == "dev.local.com" and flow.request.port == 3000:
        # Change the scheme from HTTPS to HTTP
        flow.request.scheme = "http"
