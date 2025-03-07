import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://meta-analysis-frontend.azurewebsites.net"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional middleware
app.add_middleware(HTTPSRedirectMiddleware)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

@app.get("/")
def is_server_running():
    return {"status": True, "message": "The server is currently running."}

if __name__ == "__main__":
    port = int(os.getenv("SERV_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
