from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import kociemba
from fastapi.middleware.cors import CORSMiddleware
from vision import process_cube_face

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CubeState(BaseModel):
    # The cube definition string usually looks like:
    # UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
    # Order: Up, Right, Front, Down, Left, Back
    definition: str

class ImageInput(BaseModel):
    image: str # Base64 string

@app.get("/")
def read_root():
    return {"message": "Rubik's Cube Solver API is running"}

@app.post("/scan-face")
def scan_face(input_data: ImageInput):
    try:
        colors = process_cube_face(input_data.image)
        return {"colors": colors}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not process image: {str(e)}")

@app.post("/solve")
def solve_cube(cube: CubeState):
    try:
        # Kociemba returns a string of moves separated by spaces, e.g., "R U R' U'"
        solution = kociemba.solve(cube.definition)
        return {"solution": solution, "steps": solution.split()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not solve cube: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
