import uvicorn
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.bert import bert_api
from routes.semanticscholar import semantic_scholar_api

# Load env variables
load_dotenv()

app = FastAPI()

# Allow requests from localhost and your Azure frontend (adjust if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://meta-analysis-brhwewftaahwhcc8.eastus2-01.azurewebsites.net"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include routes
app.include_router(bert_api, prefix="/api")
app.include_router(semantic_scholar_api, prefix="/api")

@app.get("/")
def is_server_running():
    return {"status": True, "message": "The server is currently running."}

if __name__ == "__main__":
    # Azure App Service will inject PORT environment variable.
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)  # Critical - 0.0.0.0 is required on Azure
