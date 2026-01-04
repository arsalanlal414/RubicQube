import cv2
import numpy as np
import base64

def read_image_from_base64(base64_string):
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    nparr = np.frombuffer(base64.b64decode(base64_string), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def get_dominant_color(roi):
    # Convert to HSV
    hsv_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    
    # Calculate mean HSV
    mean_hsv = np.mean(hsv_roi, axis=(0, 1))
    h, s, v = mean_hsv
    
    # Color classification logic - Simple heuristic
    # H: 0-179, S: 0-255, V: 0-255
    
    # White: Low saturation
    if s < 30 and v > 100:
        return 'U' # Up/White
        
    # Red: Low H or High H
    if (h < 10 or h > 160) and s > 50:
        return 'R' # Right/Red
        
    # Orange: 10-25
    if 10 <= h < 25 and s > 50:
        return 'L' # Left/Orange
        
    # Yellow: 25-35
    if 25 <= h < 35 and s > 50:
        return 'D' # Down/Yellow
        
    # Green: 35-85
    if 35 <= h < 85 and s > 50:
        return 'F' # Front/Green
        
    # Blue: 85-130
    if 85 <= h < 130 and s > 50:
        return 'B' # Back/Blue
        
    # Fallback based on V
    return 'U'

def process_cube_face(image_base64):
    img = read_image_from_base64(image_base64)
    if img is None:
        raise ValueError("Could not decode image")
        
    # Resize for consistency
    img = cv2.resize(img, (600, 600))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 150)
    
    # Find contours
    contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Filter for square-like contours
    squares = []
    for cnt in contours:
        peri = cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, 0.04 * peri, True)
        
        if len(approx) == 4:
            (x, y, w, h) = cv2.boundingRect(approx)
            aspect_ratio = w / float(h)
            area = cv2.contourArea(cnt)
            
            # Filter by size and aspect ratio
            if 2000 < area < 50000 and 0.8 < aspect_ratio < 1.2:
                squares.append((x, y, w, h, approx))
                
    # Sort squares (top-left to bottom-right)
    # We expect 9 squares. If we find more or less, we might need better filtering.
    # For this simple version, we'll try to find the 9 most central/largest ones or just take the center of the image if detection fails.
    
    # Fallback: If detection is too hard, just sample 9 points from the center of the image
    # This is often more robust for a controlled web-cam environment where the user aligns the cube.
    
    height, width, _ = img.shape
    step_x = width // 3
    step_y = height // 3
    
    colors = []
    
    # Sample 3x3 grid from the center 50% of the image
    margin_x = width // 4
    margin_y = height // 4
    roi_width = width // 2
    roi_height = height // 2
    
    cell_w = roi_width // 3
    cell_h = roi_height // 3
    
    for row in range(3):
        for col in range(3):
            cx = margin_x + col * cell_w + cell_w // 2
            cy = margin_y + row * cell_h + cell_h // 2
            
            # Extract a small ROI around the center
            roi_size = 20
            roi = img[cy-roi_size:cy+roi_size, cx-roi_size:cx+roi_size]
            
            color_code = get_dominant_color(roi)
            colors.append(color_code)
            
    return colors
