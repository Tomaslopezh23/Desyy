import { createImagePreview } from "./createImagePreview.js";

// Function to update the inputChange event listener
let currentImageUrl = null;
export function updateInputChangeListener(
  selector,
  targetCanvas,
  container,
  SIZE
) {
  // Remove previous event listener
  $(document).off("change", selector);

  // Add new event listener
  $(document).on("change", selector, function (event) {
    const file = event.target.files[0];
    currentImageUrl = URL.createObjectURL(file); // update the current image URL
    const imgNode = new Image();
    imgNode.src = currentImageUrl;
    imgNode.onload = () => {
      const img = new fabric.Image(imgNode, {
        angle: 0,
        opacity: 1,
      });
      const MAX_SIZE = SIZE;
      const scaleFactor = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height);
      const scaledWidth = img.width * scaleFactor;
      const scaledHeight = img.height * scaleFactor;

      img.set({
        left: targetCanvas.width / 2 - scaledWidth / 2,
        top: targetCanvas.height / 2 - scaledHeight / 2,
      });

      if (window.innerWidth <= 500) {
        img.set({
          left: targetCanvas.width / 2 - scaledWidth / 2,
          top: targetCanvas.height / 2 - scaledHeight / 2,
        });

        img.scaleToHeight(600);
        img.scaleToWidth(600);
      }
      targetCanvas.add(img);
      img.setCoords();
      targetCanvas.setActiveObject(img);
      createImagePreview(currentImageUrl, img, targetCanvas, container);
      targetCanvas.renderAll();
      document.querySelector(selector).value = "";
    };
  });
}
