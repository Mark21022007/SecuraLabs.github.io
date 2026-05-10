import cv2
import os

video_path = 'img/animation vid.mp4'
output_dir = 'img/sequence/'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

vidcap = cv2.VideoCapture(video_path)
success, image = vidcap.read()
count = 0

print("Extracting frames...")
while success:
    # Save frame as JPEG with 80% quality to save space
    frame_path = os.path.join(output_dir, f"frame_{count:04d}.jpg")
    cv2.imwrite(frame_path, image, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
    success, image = vidcap.read()
    count += 1

print(f"Extracted {count} frames to {output_dir}")
