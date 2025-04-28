import os, re, json
import base64
from dotenv import load_dotenv

from fastapi import FastAPI, File, UploadFile, HTTPException
from openai import OpenAI

load_dotenv()
app = FastAPI()
api_key = os.getenv("GEMINI_API_KEY")

client = OpenAI(
    api_key= api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

@app.post("/recognize")
async def recognize(image: UploadFile = File(...)):
    if not image:
        raise HTTPException(status_code=400, detail="No image uploaded.")
    contents = await image.read()
    b64 = base64.b64encode(contents).decode("utf-8")
    mime = image.content_type

    resp =  client.chat.completions.create(
        model="gemini-2.0-flash",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text",
                     "text": (
                         "Identify the food in this image and return a JSON with: "
                         "name, calories, carbs, fats, proteins, vitamins."
                     )
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime};base64,{b64}"}
                    }
                ]
            }
        ]
    )

    raw = resp.choices[0].message.content

    clean = re.sub(r"^```json\s*|\s*```$", "", raw, flags=re.MULTILINE).strip()

    try:
        result = json.loads(clean)
        print(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Malformed response: {e}")

    return {"result": result}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
