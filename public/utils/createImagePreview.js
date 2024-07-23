export function createImagePreview(imageUrl, imageObject, canvas, container) {
  // Create a new image preview and delete button
  const previewContainer = document.createElement("div");
  previewContainer.className = "image-icon-container";
  previewContainer.id = `fabric_${Date.now()}`;
  const zIndex = canvas.getObjects().length; // Use the current number of objects as the z-index
  imageObject.set("zIndex", -zIndex);

  const fabricID = `fabric_${Date.now()}`;
  imageObject.set("fabricID", fabricID);

  const template = `
    <img class='uploaded-image' src="${imageUrl}">
     <div onclick="deleteImage('${fabricID}')" title="Trash">
      <i data-lucide="trash-2" class="fa-solid fa-trash delete-icon"></i>
  </div>
    `;

  previewContainer.innerHTML = template;

  // Insert the new child on top of existing children
  const imagePreviewContainer = document.querySelector(container);
  imagePreviewContainer.insertBefore(
    previewContainer,
    imagePreviewContainer.firstChild
  );
}
