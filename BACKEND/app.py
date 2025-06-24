
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import requests
import os 
from dotenv import load_dotenv
from pydantic import BaseModel
load_dotenv()

app = FastAPI(title="API Proxy Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "https://your-frontend-domain.com",
     
    ],
    allow_credentials=True,
    allow_methods=["GET","POST"],
    allow_headers=["*"],
)

# Environment variables for API configuration
API_KEY = os.getenv("API_KEY")
PORT = os.getenv("PORT") or 5000


class NewsRequest(BaseModel):
    field: str
   

@app.get("/")
def home():
    return  "FastAPI Proxy Backend is running!"

@app.post("/api/proxy")
async def root(request:NewsRequest):
    print(request,"request")
    field=request.field
    data=requests.get(f"https://newsapi.org/v2/everything?q={field}&apiKey={API_KEY}")

    if(data.status_code!=200):
        raise HTTPException(status_code=500, detail="SOMETHING WENT WRONG !")
    
    return {"status": "success", "message": data.json()}
    


if __name__ == "__main__":
    uvicorn.run("app:app", host="localhost", port=PORT)