# 🎮 AI Rubik's Cube Solver

A modern, interactive web-based Rubik's Cube solver powered by AI algorithms. This project combines computer vision, optimal solving algorithms, and stunning 3D visualization to create an intuitive and educational experience.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61dafb.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Solving**: Uses Kociemba's algorithm for optimal cube solving (≤20 moves)
- **Computer Vision**: Scan real Rubik's cubes using your webcam with OpenCV-based color detection
- **Dual Visualization**: 
  - Interactive 3D cube with rotation, zoom, and pan controls
  - 2D unfolded view for clear state inspection
- **Step-by-Step Navigation**: View each solving move individually
- **Auto-Solve Mode**: Watch the cube solve itself automatically with smooth animations
- **Manual Shuffle**: Randomize the cube with a single click

### 🎨 User Experience
- Modern gradient UI with glass-morphism effects
- Responsive design that adapts to different screen sizes
- Real-time cube state synchronization between views
- Intuitive controls with helpful tooltips
- Color-coded buttons for different actions

## 🛠️ Technologies Used

### Backend
- **FastAPI** - High-performance Python web framework
- **Kociemba** - Optimal Rubik's Cube solving algorithm
- **OpenCV** - Computer vision for color detection
- **NumPy** - Numerical computations
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Three.js** - 3D graphics rendering
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Helpers for React Three Fiber
- **React Webcam** - Camera access for scanning
- **Vite** - Fast build tool and dev server

## 📋 Prerequisites

Before running this project, ensure you have:

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Webcam (optional, for scanning real cubes)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AIRubikCubeSolver
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## 🎮 Running the Application

### Start the Backend Server

```bash
# Make sure you're in the backend directory with venv activated
cd backend
python main.py
```

The API will run at `http://localhost:8000`

### Start the Frontend Development Server

```bash
# In a new terminal, navigate to frontend directory
cd frontend
npm run dev
```

The application will open at `http://localhost:5173` (or the URL shown in terminal)

## 📖 How to Use

### Option 1: Manual Shuffle & Solve

1. Click **Shuffle** to randomize the cube
2. Click **Solve with AI** to get the solution
3. Use **Next/Previous** buttons to step through the solution
4. Or click **🚀 Auto Solve** to watch it solve automatically

### Option 2: Scan a Real Cube

1. Click **Scan Real Cube (AI Vision)**
2. Align each face with the on-screen grid
3. Capture all 6 faces in order: U (White), R (Red), F (Green), D (Yellow), L (Orange), B (Blue)
4. Click **Solve with AI** once scanning is complete

### Interacting with the 3D View

- **Rotate**: Click and drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click and drag

## 📁 Project Structure

```
AIRubikCubeSolver/
├── backend/
│   ├── main.py              # FastAPI application and endpoints
│   ├── vision.py            # Computer vision for cube scanning
│   ├── requirements.txt     # Python dependencies
│   └── __pycache__/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Cube3D.jsx       # 3D cube visualization
│   │   │   ├── Cube2D.jsx       # 2D unfolded view
│   │   │   ├── CubeScanner.jsx  # Webcam scanner interface
│   │   │   ├── Cube2D.css
│   │   │   └── CubeScanner.css
│   │   ├── utils/
│   │   │   └── cubeLogic.js     # Cube state management & moves
│   │   ├── App.jsx              # Main application component
│   │   ├── App.css              # Main styles
│   │   └── main.jsx             # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## 🧩 API Endpoints

### `GET /`
Health check endpoint

### `POST /solve`
Solves a Rubik's Cube configuration
- **Request Body**: `{ "definition": "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB" }`
- **Response**: `{ "solution": "R U R' U'...", "steps": ["R", "U", "R'", "U'", ...] }`

### `POST /scan-face`
Processes webcam image to detect cube colors
- **Request Body**: `{ "image": "<base64-encoded-image>" }`
- **Response**: `{ "colors": ["U", "U", "R", ...] }`

## 🎨 Color Mapping

| Face | Color  | Code |
|------|--------|------|
| Up   | White  | U    |
| Right| Red    | R    |
| Front| Green  | F    |
| Down | Yellow | D    |
| Left | Orange | L    |
| Back | Blue   | B    |

## 🔧 Configuration

### Adjust Auto-Solve Speed

Edit `frontend/src/App.jsx`, line ~95:

```javascript
}, 500); // Change delay in milliseconds (500 = 0.5 seconds)
```

### Modify Color Detection Sensitivity

Edit `backend/vision.py` to adjust HSV ranges for different lighting conditions.

## 🐛 Troubleshooting

### Backend Issues
- **Module not found**: Ensure virtual environment is activated and dependencies are installed
- **Port 8000 already in use**: Change port in `main.py`: `uvicorn.run(app, host="0.0.0.0", port=8001)`

### Frontend Issues
- **Can't connect to backend**: Verify backend is running at `http://localhost:8000`
- **Webcam not working**: Check browser permissions and HTTPS requirements
- **3D cube not rendering**: Ensure WebGL is enabled in your browser

### Color Detection Issues
- Ensure good, even lighting when scanning
- Hold the cube steady and align faces with the grid
- Adjust HSV ranges in `vision.py` for your lighting conditions

## 🚀 Future Enhancements

- [ ] Manual cube configuration via UI clicks
- [ ] Multiple solving algorithms (CFOP, Roux, etc.)
- [ ] Solution optimization metrics
- [ ] Save/load cube states
- [ ] Solving history and statistics
- [ ] Mobile app version
- [ ] Multiplayer solving challenges
- [ ] AR cube scanning

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Kociemba Algorithm** - Herbert Kociemba for the optimal solving algorithm
- **Three.js** - For amazing 3D graphics library
- **FastAPI** - For the excellent Python web framework
- **React Three Fiber** - For seamless Three.js integration with React

## 📧 Contact

For questions or feedback, please open an issue on the repository.

---

Made with ❤️ for Rubik's Cube enthusiasts and AI learners
