fabric.Object.prototype.set({
  cornerColor: "#9652a8",
  cornerSize: 200,
  cornerStrokeWidth: 200, // Width of the stroke around the controls
  transparentCorners: false,
  selectable: true,
  borderColor: "#9652a8",
  borderScaleFactor: 20,
});
const canvas = new fabric.Canvas("canvas", {
  preserveObjectStacking: true,
});
const canvas2 = new fabric.Canvas("canvas2", {
  preserveObjectStacking: true,
});
const exportCanvas = new fabric.Canvas("exportCanvas", {
  preserveObjectStacking: false,
});

let selectedObject = null;
let currentImageUrl = null; // variable to store the URL of the current image
let SIZE;

if (window.innerWidth <= 500) {
  canvas.setWidth(700);
  canvas.setHeight(700);
  canvas2.setWidth(700);
  canvas2.setHeight(700);

  fabric.Object.prototype.set({
    cornerBackground: "red",
    cornerSize: 65,
    cornerStrokeWidth: 20, // Width of the stroke around the controls
    transparentCorners: false,
    selectable: true,
    borderScaleFactor: 8,
  });
  SIZE = 600;
} else {
  SIZE = 2000;
}

let termsAccepted = false;
let convertedFrontUrl = "";
let convertedBackUrl = "";

function openModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

$(".fa-bars").click(function (params) {
  $("#sidebar-canvas-one").toggle();
  $("#sidebar-canvas-one").css("width", "100%");
});

$(".cross-icon").click(function (params) {
  $("#sidebar-canvas-one").hide();
});

function inputChange(selector, targetCanvas, container) {
  document.querySelector(selector).addEventListener("change", (event) => {
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
        // width: SIZE,
        // height: SIZE,
      });

      if (window.innerWidth <= 500) {
        img.set({
          left: targetCanvas.width / 2 - scaledWidth / 2,
          top: targetCanvas.height / 2 - scaledHeight / 2,
        });

        img.scaleToHeight(600);
        img.scaleToWidth(600);
      }

      // Set the clipTo function to clip the image to the visible part of the targetCanvas
      // img.clipTo = function (ctx) {
      //   ctx.rect(0, 0, targetCanvas.width, targetCanvas.height);
      // };
      targetCanvas.add(img);
      // Trigger click event to select the image
      img.setCoords();
      targetCanvas.setActiveObject(img);
      targetCanvas.renderAll();
      createImagePreview(currentImageUrl, img, targetCanvas, container);
      input.value = ""; // Clear the input field
    };
  });
}

inputChange("#input", canvas, "#image-preview-container");
inputChange("#input2", canvas2, "#image-preview-container2");

function cambiarColorRojo(btnId) {
  // Obtener todos los botones
  const botones = document.querySelectorAll("button");

  // Restaurar el color original de todos los botones
  botones.forEach((boton) => {
    // boton.style.backgroundColor = "";
    boton.classList.remove("selected");
  });

  // Obtener el elemento del botón
  const boton = document.getElementById(btnId);

  // Cambiar el color a rojo
  // boton.style.backgroundColor = "#9fa3a9";
  boton.classList.add("selected");
}

window.onload = function () {
  cambiarColorRojo("holaBtn");
};

// Asignar el evento de clic al botón "Hola"
document.getElementById("holaBtn").addEventListener("click", function () {
  // Cambiar el color del botón a rojo y restaurar otros colores
  cambiarColorRojo("holaBtn");
});

// Asignar el evento de clic al botón "Adiós"
document.getElementById("adiosBtn").addEventListener("click", function () {
  // Cambiar el color del botón a rojo y restaurar otros colores
  cambiarColorRojo("adiosBtn");
});

// Function to toggle visibility of canvases
function toggleCanvasVisibility(
  canvasToShow,
  canvasToHide,
  parentToShow,
  parentToHide
) {
  document.querySelector(
    parentToShow
  ).parentElement.parentElement.style.display = "block";
  document.querySelector(
    parentToHide
  ).parentElement.parentElement.style.display = "none";

  canvasToShow.lowerCanvasEl.style.display = "block";
  canvasToShow.upperCanvasEl.style.display = "block";

  // Show the selected canvas
  canvasToHide.lowerCanvasEl.style.display = "none";
  canvasToHide.upperCanvasEl.style.display = "none";
}

// Event listener for "Canvas1" button
document.getElementById("holaBtn").addEventListener("click", function () {
  toggleCanvasVisibility(canvas, canvas2, "#canvas", "#canvas2");
  $("#sidebar-canvas-two").hide();
  $("#sidebar-canvas-one").show();
});

// Event listener for "Canvas2" button
document.getElementById("adiosBtn").addEventListener("click", function () {
  toggleCanvasVisibility(canvas2, canvas, "#canvas2", "#canvas");
  $("#sidebar-canvas-one").hide();
  $("#sidebar-canvas-two").show();
});

// Set the initial visibility (e.g., show canvas1 and hide canvas2)
toggleCanvasVisibility(canvas, canvas2, "#canvas", "#canvas2");
toggleCanvasVisibility(canvas, exportCanvas, "#canvas", "#exportCanvas");
$("#sidebar-canvas-two").hide();

// Function to delete both the Fabric object and the image preview
function deleteImage(fabricID) {
  const fabricObject = canvas
    .getObjects()
    .find((obj) => obj.get("fabricID") === fabricID);
  const fabricObject2 = canvas2
    .getObjects()
    .find((obj) => obj.get("fabricID") === fabricID);
  if (fabricObject) {
    // Remove the image preview and the corresponding image in the canvas
    // fabricObject.remove();
    canvas.remove(fabricObject);
    const previewContainer = document.getElementById(fabricID);
    if (previewContainer) {
      previewContainer.remove();
    }
  } else if (fabricObject2) {
    // Remove the image preview and the corresponding image in the canvas
    // fabricObject.remove();
    canvas2.remove(fabricObject2);
    const previewContainer = document.getElementById(fabricID);
    if (previewContainer) {
      previewContainer.remove();
    }
  }
}

function createImagePreview(imageUrl, imageObject, canvas, container) {
  // Create a new image preview and delete button
  const previewContainer = document.createElement("div");
  previewContainer.className = "image-icon-container";
  previewContainer.id = `fabric_${Date.now()}`;
  const zIndex = canvas.getObjects().length; // Use the current number of objects as the z-index
  imageObject.set("zIndex", -zIndex);

  const fabricID = `fabric_${Date.now()}`;
  imageObject.set("fabricID", fabricID);

  const template = `
<img src="${imageUrl}" draggable="false">
<div class="buttons-div">
    <div onclick="deleteImage('${fabricID}')" title="Trash">
        <i class="fa-solid fa-trash delete-icon"></i>
    </div>
    <div title="Move">
        <i class="fa-solid fa-grip move-icon"></i>
    </div>
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

canvas.on("mouse:down", (event) => {
  if (event.target) {
    selectedObject = event.target;
  } else {
    selectedObject = null;
  }
});

canvas2.on("mouse:down", (event) => {
  if (event.target) {
    selectedObject = event.target;
  } else {
    selectedObject = null;
  }
});

let fontSize;

if (window.innerWidth <= 500) {
  fontSize = 65;
} else {
  fontSize = 250;
}

function addText(textbox, canvas, container) {
  document.querySelector(textbox).addEventListener("click", () => {
    const text = new fabric.IText("Edit your text", {
      left: 100,
      top: 100,
      width: 200, // Set a specific width for the text box
      height: 100, // Set a specific height for the text box
      fontFamily: "Arial",
      fontSize: fontSize,
      fill: "black",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "left",
    });
    const fabricID = `fabric_${Date.now()}`;

    canvas.add(text);
    text.set("fabricID", fabricID);
    createTextPreview(text, container);

    // Delay setting active object to ensure text is fully added to canvas
    setTimeout(() => {
      canvas.setActiveObject(text);
      canvas.renderAll();
      text.enterEditing();
      text.selectAll();
    }, 100);
  });
}

addText("#addTextBtn", canvas, ".text-container");
addText("#addTextBtn2", canvas2, ".text-container-2");

// Function to delete the text preview and the corresponding text object
function deleteTextPreview(fabricID) {
  const textPreviewContainer = document.getElementById(`fabric_${fabricID}`);
  if (textPreviewContainer) {
    textPreviewContainer.remove();

    // Find the Fabric object based on the fabricID
    const textObject = canvas
      .getObjects()
      .find((obj) => obj.get("fabricID") === fabricID);
    const textObject2 = canvas2
      .getObjects()
      .find((obj) => obj.get("fabricID") === fabricID);

    if (textObject) {
      // Remove the text object from the canvas
      canvas.remove(textObject);
      canvas.renderAll();
    } else if (textObject2) {
      canvas2.remove(textObject2);
      canvas2.renderAll();
    }
  }
}

// Function to handle text style changes
function setTextStyles(property, value, canvas) {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    activeObject.set(property, value);
    canvas.requestRenderAll();
  }
}

// Function to toggle text styles
function toggleTextStyles(property, value, canvas) {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    if (activeObject.get(property) === value) {
      activeObject.set(property, "normal");
    } else {
      activeObject.set(property, value);
    }
    canvas.requestRenderAll();
  }
}

// Example for toggling bold style on button click
function boldBtn(selector, canvas) {
  document.getElementById(selector).addEventListener("click", () => {
    toggleTextStyles("fontWeight", "bold", canvas);
    const activeObject = canvas.getActiveObject().fabricID;
    updateTextPreview(activeObject, canvas);
  });
}

boldBtn("boldBtn", canvas);
boldBtn("boldBtn2", canvas2);

function italicBtn(selector, canvas) {
  // Example for toggling italic style on button click
  document.getElementById(selector).addEventListener("click", () => {
    toggleTextStyles("fontStyle", "italic", canvas);
    const activeObject = canvas.getActiveObject().fabricID;
    updateTextPreview(activeObject, canvas);
  });
}

italicBtn("italicBtn", canvas);
italicBtn("italicBtn2", canvas2);

function alignLeftText(selector, canvas) {
  // Example of changing text alignment to center on button click
  document.getElementById(selector).addEventListener("click", () => {
    setTextStyles("textAlign", "left", canvas);
  });
}

function alignCenterText(selector, canvas) {
  // Example of changing text alignment to center on button click
  document.getElementById(selector).addEventListener("click", () => {
    setTextStyles("textAlign", "center", canvas);
  });
}

function alignRightText(selector, canvas) {
  // Example of changing text alignment to center on button click
  document.getElementById(selector).addEventListener("click", () => {
    setTextStyles("textAlign", "right", canvas);
  });
}
alignLeftText("alignLeftBtn", canvas);
alignLeftText("alignLeftBtn2", canvas2);
alignCenterText("alignCenterBtn", canvas);
alignCenterText("alignCenterBtn2", canvas2);
alignRightText("alignRightBtn", canvas);
alignRightText("alignRightBtn2", canvas2);

// Function to handle the visibility of text-related buttons
function toggleTextButtonsVisibility(isVisible) {
  const textButtons = [
    "boldBtn",
    "boldBtn2",
    "italicBtn",
    "italicBtn2",
    "alignLeftBtn",
    "alignLeftBtn2",
    "alignCenterBtn",
    "alignCenterBtn2",
    "alignRightBtn",
    "alignRightBtn2",
    "fontSizeInput",
    "fontSizeInput2",
    "colorPicker",
    "colorPicker2",
    "fontFamilySelect",
    "fontFamilySelect2",
    "fontFamilylabel",
    "fontFamilylabel2",
    "color-label",
    "color-label2",
    "fontsize-label",
    "fontsize-label2",
    "text-preview",
    "text-preview2",
    "textbox",
    "textbox2",
  ];

  textButtons.forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    button.style.display = isVisible ? "inline-block" : "none";
    $(".flex-2").css(
      isVisible ? { "margin-top": "1em" } : { "margin-top": "0" }
    );
  });
}
$(".flex-2").css({ "margin-top": "0" });

function canvasEvents(canvas) {
  canvas.on("selection:created", function (event) {
    document.querySelectorAll("canvas").forEach((canvas) => {
      canvas.style.border = "2px dashed black";
    });
    const selectedObject = event.selected[0];
    if (selectedObject && selectedObject.type === "i-text") {
      toggleTextButtonsVisibility(true);
    }
  });
  canvas.on("selection:cleared", function () {
    toggleTextButtonsVisibility(false);
    document.querySelectorAll("canvas").forEach((canvas) => {
      canvas.style.border = "none";
    });
  });
}

canvasEvents(canvas);
canvasEvents(canvas2);

// Function to change font size from input field
function changeFontSizeFromInput(size, canvas) {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    activeObject.set("fontSize", parseInt(size, 10));
    canvas.requestRenderAll();
  }
}

function fontSizeFromInput(selector, canvas) {
  // Event listener for the font size input field
  document
    .getElementById(selector)
    .addEventListener("change", function (event) {
      changeFontSizeFromInput(event.target.value, canvas);
    });
}

fontSizeFromInput("fontSizeInput", canvas);
fontSizeFromInput("fontSizeInput2", canvas2);

// Function to change text color from color picker
function changeFontColor(color, canvas) {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    activeObject.set("fill", color);
    canvas.requestRenderAll();
  }
}

function changeTextColor(selector, canvas) {
  // Event listener for the color picker
  document.getElementById(selector).addEventListener("input", function (event) {
    changeFontColor(event.target.value, canvas);
    const activeObject = canvas.getActiveObject().fabricID;
    updateTextPreview(activeObject, canvas);
  });
}

changeTextColor("colorPicker", canvas);
changeTextColor("colorPicker2", canvas2);

// Function to change font family
function changeFontFamily(font, canvas) {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    activeObject.set("fontFamily", font);
    canvas.requestRenderAll();
  }
}

function changeFontFamilyFun(selector, canvas) {
  // Event listeners for font family and font size select elements
  document
    .getElementById(selector)
    .addEventListener("change", function (event) {
      changeFontFamily(event.target.value, canvas);
    });
}

changeFontFamilyFun("fontFamilySelect", canvas);
changeFontFamilyFun("fontFamilySelect2", canvas2);

canvas.on("text:changed", function (event) {
  const activeObject = canvas.getActiveObject().fabricID;
  updateTextPreview(activeObject, canvas);
});

canvas2.on("text:changed", function (event) {
  const activeObject = canvas2.getActiveObject().fabricID;
  updateTextPreview(activeObject, canvas2);
});

function createTextPreview(activeObject, container) {
  const textPreviewContainer = document.createElement("div");
  const textContentDiv = document.createElement("p");
  textPreviewContainer.className = "text-preview-container";
  textPreviewContainer.id = `fabric_${activeObject.fabricID}`;
  textContentDiv.textContent = activeObject.text;
  textContentDiv.style.fontFamily = activeObject.fontFamily;
  textContentDiv.style.fontSize = "20px";
  textContentDiv.style.color = activeObject.fill;
  textContentDiv.style.fontWeight = activeObject.fontWeight;
  textContentDiv.style.fontStyle = activeObject.fontStyle;
  const deleteButton = document.createElement("div");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash delete-icon" title="Trash" onclick="deleteTextPreview('${activeObject.fabricID}')"></i>`;
  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "buttons-div";
  textPreviewContainer.appendChild(textContentDiv);
  buttonsDiv.appendChild(deleteButton);
  textPreviewContainer.appendChild(buttonsDiv);

  document.querySelector(container).append(textPreviewContainer);
}

function updateTextPreview(fabricID, canvas) {
  const fabricObject = canvas
    .getObjects()
    .find((obj) => obj.get("fabricID") === fabricID);

  if (fabricObject && fabricObject.type === "i-text") {
    const textPreview = document.querySelector(`#fabric_${fabricID} p`);

    textPreview.textContent = fabricObject.text;
    // textPreview.style.fontFamily = fabricObject.fontFamily;
    // textPreview.style.fontSize = fabricObject.fontSize + 'px';
    textPreview.style.color = fabricObject.fill;
    textPreview.style.fontWeight = fabricObject.fontWeight;
    textPreview.style.fontStyle = fabricObject.fontStyle;
    // Update other styles as needed (e.g., fontWeight, fontStyle, etc.)
  }
}

function movingImages(container) {
  $(container).sortable({
    placeholder: "slide-placeholder",
    axis: "y",
    revert: 150,
    start: function (e, ui) {
      placeholderHeight = ui.item.outerHeight();
      ui.item.addClass("opacity-less");
      ui.placeholder.height(placeholderHeight + 15);
      $(
        '<div class="slide-placeholder-animator" data-height="' +
          placeholderHeight +
          '"></div>'
      ).insertAfter(ui.placeholder);
    },
    change: function (event, ui) {
      ui.placeholder
        .stop()
        .height(0)
        .animate(
          {
            height: ui.item.outerHeight() + 15,
          },
          300
        );

      placeholderAnimatorHeight = parseInt(
        $(".slide-placeholder-animator").attr("data-height")
      );

      $(".slide-placeholder-animator")
        .stop()
        .height(placeholderAnimatorHeight + 15)
        .animate(
          {
            height: 0,
          },
          300,
          function () {
            $(this).remove();
            placeholderHeight = ui.item.outerHeight();
            $(
              '<div class="slide-placeholder-animator" data-height="' +
                placeholderHeight +
                '"></div>'
            ).insertAfter(ui.placeholder);
          }
        );
    },
    stop: function (e, ui) {
      $(".slide-placeholder-animator").remove();
      ui.item.removeClass("opacity-less");
      const previewDivs = document.querySelectorAll(".image-icon-container");
      previewDivs.forEach((previewDiv, index) => {
        const fabricID = previewDiv.getAttribute("id"); // Assume the preview div's ID is set as the fabricID

        const fabricObject = canvas
          .getObjects()
          .find((obj) => obj.get("fabricID") === fabricID);
        const fabricObject2 = canvas2
          .getObjects()
          .find((obj) => obj.get("fabricID") === fabricID);

        if (fabricObject) {
          const newZIndex = fabricObject.zIndex - 1; // Set the new z-index based on the index of the preview div
          fabricObject.set("zIndex", newZIndex);
          canvas.moveTo(fabricObject, newZIndex);
        } else if (fabricObject2) {
          const newZIndex = fabricObject2.zIndex - 1; // Set the new z-index based on the index of the preview div
          fabricObject2.set("zIndex", newZIndex);
          canvas2.moveTo(fabricObject2, newZIndex);
        }
      });

      canvas.renderAll();
    },
  });
}

movingImages("#image-preview-container");
movingImages("#image-preview-container2");

$(document).on("click", ".shirtSize", function () {
  $(".shirtSize").hide();
  $(".buttons-container").hide();
  $(".shirtColor").hide();
  $(".product-info").hide();
  $(".edit-btn").show();
  $(".cart-btn").show();
  $(".shirt-size-menu").show();
  $(".size-guide-div").show();
  $(".size-guide-btn").show();
  document.querySelectorAll(".cart-btn").forEach((btn) => {
    btn.scrollIntoView();
  });
});

$(".size-guide").hide();

$(".size-guide-btn").click(function (params) {
  $(".overlay").show();
  $(".size-guide").show();
});

$(".overlay").click(function (params) {
  $(".overlay").hide();
  $(".size-guide").hide();
});

setTimeout(() => {
  $("#inch").addClass("selected-guide");

  $("#inch").click(function (params) {
    mostrarDatos1();
  });
  $("#centimeter").click(function (params) {
    mostrarDatos2();
  });
  $(document).on("click", ".measure-btn", function (params) {
    $(".measure-btn").removeClass("selected-guide");
    $(this).addClass("selected-guide");
  });
  // $(".measure-btn").click(function (params) {});

  $(".close-menu").click(function (params) {
    $(".overlay").hide();
    $(".size-guide").hide();
  });
}, 1000);

function mostrarDatos2() {
  var datos = [
    { a: "S", b: 45.7, c: 71.1, d: 20.9 },
    { a: "M", b: 50.8, c: 73.6, d: 21.6 },
    { a: "L", b: 55.9, c: 76.2, d: 22.2 },
    { a: "XL", b: 60.1, c: 78.7, d: 22.9 },
    { a: "XXL", b: 66.1, c: 81.3, d: 23.5 },
    { a: "3XL", b: 71.1, c: 83.9, d: 24.1 },
  ];

  actualizarTabla(datos, "encabezado2");
  // Resaltar el botón seleccionado
  document.getElementById("inch").classList.remove("active");
  document.getElementById("centimeter").classList.add("active");
}

// Función para mostrar datos 1
function mostrarDatos1() {
  var datos = [
    { a: "S", b: 18, c: 28, d: 8.2 },
    { a: "M", b: 20, c: 29, d: 8.5 },
    { a: "L", b: 22, c: 30, d: 8.7 },
    { a: "XL", b: 24, c: 31, d: 9.1 },
    { a: "XXL", b: 26, c: 32, d: 9.2 },
    { a: "3XL", b: 28, c: 33, d: 9.5 },
  ];

  actualizarTabla(datos, "encabezado1");
  // Resaltar el botón seleccionado
  document.getElementById("inch").classList.add("active");
  document.getElementById("centimeter").classList.remove("active");
}

// Función para actualizar la tabla con nuevos datos y encabezados
function actualizarTabla(datos, encabezadoId) {
  // Ocultar todos los encabezados
  document.getElementById("encabezado1").style.display = "none";
  document.getElementById("encabezado2").style.display = "none";

  // Mostrar el encabezado correspondiente al conjunto de datos
  document.getElementById(encabezadoId).style.display = "table-header-group";

  var cuerpoTabla = document.getElementById("cuerpoTabla");
  cuerpoTabla.innerHTML = "";

  for (var i = 0; i < datos.length; i++) {
    var fila = cuerpoTabla.insertRow(i);
    var celdaa = fila.insertCell(0);
    var celdab = fila.insertCell(1);
    var celdac = fila.insertCell(2);
    var celdad = fila.insertCell(3);

    celdaa.innerHTML = datos[i].a;
    celdab.innerHTML = datos[i].b;
    celdac.innerHTML = datos[i].c;
    celdad.innerHTML = datos[i].d;

    celdaa.innerHTML = "<strong>" + datos[i].a + "</strong>";
    celdab.innerHTML = datos[i].b;
    celdac.innerHTML = datos[i].c;
  }
}

$(".edit-btn").click(function (params) {
  $(this).hide();
  $(".buttons-container").show();
  $(".shirtColor").show();
  $(".shirtSize").show();
  $(".cart-btn").hide();
  $(".product-info").show();
  $(".shirt-size-menu").hide();
  $(".select-shirt-color-div").hide();
  $(".size-guide-div").hide();
});

$(".menu-form").submit(function (e) {
  e.preventDefault();
});

$(document).on("click", ".shirtColor", function () {
  $(".select-shirt-color-div").css("display", "flex");
  $(".edit-btn").show();
  $(".size-guide-div").show();
  $(".buttons-container").hide();
  $(".shirtColor").hide();
  $(".shirtSize").hide();
  $(".labels-div").hide();
  $(".text-preview-container").hide();
  $(".text-preview").hide();
  $(".product-info").hide();
  $(".size-guide-btn").hide();
});

$(".color-div").click(function (params) {
  let id = $(this).attr("id");
  $("#shirt-image").attr("src", `./Shirt/Front/${id}.jpeg`);
  $("#shirt-image-back").attr("src", `./Shirt/Back/${id}.jpeg`);
  $(".color-div").removeClass("active");
  $(this).addClass("active");
  $(".edit-btn").click();

  if (id == "White") {
    $("canvas").css("border-color", "black");
  } else {
    $("canvas").css("border-color", "white");
  }
});

$("#addTextBtn").click(function (params) {
  $(".select-shirt-color-div").hide();
  $(".labels-div").show();
  $(".text-preview-container").show();
});

if (window.innerWidth < 1050 && window.innerWidth > 700) {
  $("#canvas2").parent().css({ top: "135px", left: "165px" });
} else if (window.innerWidth < 700 && window.innerWidth > 500) {
  $("#canvas2").parent().css({ top: "138px", left: "160px" });
} else if (window.innerWidth < 500) {
  $("#canvas2").parent().css({ top: "88px", left: "82px" });
} else {
  $("#canvas2").parent().css({ top: "200px", left: "210px" });
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

let sessionUrl = "";
let hasImagesForFrontCanvas;
let hasImagesForBackCanvas;
let hasTextForBackCanvas;
let hasTextForFrontCanvas;

// Function to check if canvas has images
function hasImages(canvas) {
  var objects = canvas.getObjects();
  for (var i = 0; i < objects.length; i++) {
    if (objects[i] instanceof fabric.Image) {
      return true;
    }
  }
  return false;
}

// Function to check if canvas has text
function hasText(canvas) {
  var objects = canvas.getObjects();
  for (var i = 0; i < objects.length; i++) {
    if (objects[i].type === "i-text") {
      return true;
    }
  }
  return false;
}

canvas.on("mouse:down", function (event) {
  hasImagesForFrontCanvas = hasImages(canvas || false);
  hasTextForFrontCanvas = hasText(canvas) || false;
});

canvas2.on("mouse:down", function (event) {
  hasImagesForBackCanvas = hasImages(canvas2) || false;
  hasTextForBackCanvas = hasText(canvas2) || false;
});

canvas.on("selection:cleared", function (event) {
  hasImagesForFrontCanvas = hasImages(canvas || false);
  hasTextForFrontCanvas = hasText(canvas) || false;
});

canvas2.on("selection:cleared", function (event) {
  hasImagesForBackCanvas = hasImages(canvas2) || false;
  hasTextForBackCanvas = hasText(canvas2) || false;
});

async function handleUpload(selectedSizes, shirtColor) {
  // Upload image and wait for completion
  try {
    const uploadResponse = await uploadImage();

    const response = await fetch(
      "https://desyy.com/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageSrc: uploadResponse,
          sizes: selectedSizes,
          color: shirtColor,
          hasImagesForFrontCanvas: hasImagesForFrontCanvas || false,
          hasTextsForFrontCanvas: hasTextForFrontCanvas || false,
          hasImagesForBackCanvas: hasImagesForBackCanvas || false,
          hasTextsForBackCanvas: hasTextForBackCanvas || false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const session = await response.json();

    // Redirect to the Stripe Checkout page
    if (termsAccepted) {
      window.location.href = session.url;
    }
    sessionUrl = session.url;
  } catch (error) {
    console.error("Error processing checkout:", error);
    // Handle error, e.g., display an error message to the user
  }
}

document.querySelectorAll(".cart-btn").forEach((btn) => {
  btn.addEventListener("click", async function () {
    const selectedImageSrc = document.getElementById("shirt-image").src;
    var shirtColor = $(".color-div.active").attr("id");

    // Collect the selected sizes and quantities
    var selectedSizes = {};
    $(".size-div").each(function () {
      var size = $(this).find("p").text().trim();
      var quantity = parseInt($(this).find(".size").val());

      // Only include sizes with a quantity greater than 0
      if (quantity > 0) {
        selectedSizes[size] = quantity;
      }
    });

    if (isObjectEmpty(selectedSizes)) {
      alert("Select Size!");
      return;
    } else {
      document.querySelectorAll(".cart-btn").forEach((btn) => {
        btn.textContent = "";
        btn.disabled = true;
      });
      $(".loader").addClass("inline-block");
      $(".loading-modal").addClass("inline-block");
      $(".overlay").addClass("inline-block");
      addDesignToShirt(() => handleUpload(selectedSizes, shirtColor));
    }
  });
});

$(".modal-button").click(function (params) {
  termsAccepted = true;
  $(".overlay").hide();
  if (sessionUrl != "") {
    window.location.href = sessionUrl;
  }
});

async function uploadImage() {
  let frontData, backData; // Declare variables outside try block

  // Set opacity for buttons while uploading
  document.querySelectorAll(".cart-btn").forEach((btn) => {
    btn.style.opacity = "0.7";
  });

  const canvasFrontDesign = canvas.toDataURL("image/png");
  const canvasBackDesign = canvas2.toDataURL("image/png");

  try {
    // Send the front side image data to backend and wait for completion
    if (hasImagesForFrontCanvas || hasTextForFrontCanvas) {
      const frontResponse = await fetch("https://desyy.com/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frontImage: canvasFrontDesign }),
      });

      if (!frontResponse.ok) {
        throw new Error("Failed to upload front image");
      }

      frontData = await frontResponse.json(); // Assign value
    }

    if (hasImagesForBackCanvas || hasTextForBackCanvas) {
      // Send the back side image data to backend and wait for completion
      const backResponse = await fetch("https://desyy.com/uploadBack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ backImage: canvasBackDesign }),
      });

      if (!backResponse.ok) {
        throw new Error("Failed to upload back image");
      }

      backData = await backResponse.json(); // Assign value
    }

    // Reset opacity for buttons after uploading
    document.querySelectorAll(".cart-btn").forEach((btn) => {
      btn.style.opacity = "1";
    });

    // Return secure URLs of both front and back images
    return {
      frontUrl: frontData ? frontData.result.secure_url : undefined,
      backUrl: backData ? backData.result.secure_url : undefined,
    };
  } catch (error) {
    console.error("Error uploading images:", error);
    // Handle error, e.g., display an error message to the user
    document.querySelectorAll(".cart-btn").forEach((btn) => {
      btn.style.opacity = "1";
    });
  }
}

function loadImageAsync(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Enable cross-origin access, important for some image URLs
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

$(document).on("click", ".change-size", function () {
  var size = $(this).data("size");
  var increment = parseInt($(this).data("increment"));
  var parentID = $(this).closest(".shirt-size-menu").attr("id"); // Get the ID of the parent container
  var valueToUse = parentID == "shirt-size-menu-1" ? "1" : "2";
  var sizeInput = $("#size" + size + valueToUse); // Update the selector to include the parent ID
  var currentSize = parseInt(sizeInput.val());
  var newSize = currentSize + increment;

  // Ensure the size is not less than 0
  if (newSize < 0) {
    newSize = 0;
  }

  sizeInput.val(newSize);
});

// Function to select all text objects and bring them to front
function selectAllTextObjects() {
  canvas.forEachObject(function (obj) {
    // Check if object is a text object
    if (obj.type === "text") {
      // Do something with the text object, e.g., select it
      obj.set("active", true);
    }
  });

  // Bring the selected text objects to the front
  canvas.bringToFront();
}

// Call selectAllTextObjects function whenever a selection is created on the canvas
canvas.on("selection:created", selectAllTextObjects);

function addDesignToShirt(callback) {
  $("#holaBtn").click();
  $(".shirtSize").hide();
  // Disable borders
  canvas.discardActiveObject().renderAll();

  const img = document.getElementById("shirt-image");

  const originalImg = img.src;
  // img.src = "./Shirt/Front/White.jpeg";
  const node = document.getElementById("canvas-front-container");

  const targetWidth = 4500;
  const targetHeight = 5100;

  let scaleX = targetWidth / node.offsetWidth;
  let scaleY = targetHeight / node.offsetHeight;

  let translateX = 0;
  let translateY = 0;

  if (window.innerWidth > 1250) {
    translateX = -115;
    translateY = -50;
  } else if (window.innerWidth > 1050) {
    translateX = -25;
    translateY = -50;
  } else if (window.innerWidth > 900) {
    translateX = -25;
  } else if (window.innerWidth > 700) {
    translateX = -35;
  } else if (window.innerWidth > 500) {
    translateX = -25;
  } else {
    translateY = -25;
    scaleY += 1;
  }

  const param = {
    height: targetHeight,
    width: targetWidth,
    quality: 1,
    style: {
      transform: `scale(${scaleX},${scaleY}) translate(${translateX}px,${translateY}px)`,
      transformOrigin: "top left",
      backgroundColor: "#fff",
    },
  };

  domtoimage
    .toJpeg(node, param)
    .then(function (dataUrl) {
      convertedFrontUrl = dataUrl;
      if (hasImagesForFrontCanvas || hasTextForFrontCanvas) {
        document.querySelector("#shirtDesignFront").src = convertedFrontUrl;
        document.querySelector("#shirtDesignFront").style.display = "block";
        // openModal();
      }
      if (typeof callback === "function") {
        callback();
      }
      setTimeout(() => {
        addDesignToShirt2();
      }, 4000);
      const a = document.createElement("a");
      a.download = "test_image.png";
      a.href = dataUrl;
      // a.click();
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
    })
    .finally(function () {
      img.src = originalImg;
    });
}
function addDesignToShirt2(callback) {
  $("#adiosBtn").click();
  $(".shirtSize").hide();

  // Disable borders
  canvas2.discardActiveObject().renderAll();

  const img = document.getElementById("shirt-image");

  const originalImg = img.src;
  // img.src = "./Shirt/Front/White.jpeg";
  const node = document.getElementById("canvas-back-container");

  const targetWidth = 4500;
  const targetHeight = 5100;

  let scaleX = targetWidth / node.offsetWidth;
  let scaleY = targetHeight / node.offsetHeight;

  let translateX = 0;
  let translateY = 0;

  if (window.innerWidth > 1250) {
    translateX = -115;
    translateY = -50;
  } else if (window.innerWidth > 1050) {
    translateX = -25;
    translateY = -50;
  } else if (window.innerWidth > 900) {
    translateX = -25;
  } else if (window.innerWidth > 700) {
    translateX = -35;
  } else if (window.innerWidth > 500) {
    translateX = -25;
  } else {
    translateY = -25;
    scaleY += 1;
  }

  const param = {
    height: targetHeight,
    width: targetWidth,
    quality: 1,
    style: {
      transform: `scale(${scaleX},${scaleY}) translate(${translateX}px,${translateY}px)`,
      transformOrigin: "top left",
      backgroundColor: "#fff",
    },
  };

  domtoimage
    .toJpeg(node, param)
    .then(function (dataUrl) {
      convertedBackUrl = dataUrl;
      openModal();
      $(".loading-modal").hide();
      if (hasImagesForBackCanvas || hasTextForBackCanvas) {
        document.querySelector("#shirtDesignBack").src = convertedBackUrl;
        document.querySelector("#shirtDesignBack").style.display = "block";
      }
      if (typeof callback === "function") {
        // callback();
      }
      const a = document.createElement("a");
      a.download = "test_back_image.png";
      a.href = dataUrl;
      // a.click();
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
    })
    .finally(function () {
      img.src = originalImg;
    });
}

function deselectActiveObjects(canvas) {
  canvas.discardActiveObject().renderAll();
}

function clickOutSideCanvas(canvas) {
  // Event listener for clicks on the document body
  document.body.addEventListener("click", function (event) {
    var target = event.target;

    // Check if the click target is not the canvas or its child elements
    if (
      target !== canvas.lowerCanvasEl &&
      target !== canvas.upperCanvasEl &&
      target?.id != "colorPicker" &&
      target?.id != "colorPicker2" &&
      target?.id != "fontFamilySelect" &&
      target?.id != "fontFamilySelect2" &&
      target?.id != "fontSizeInput" &&
      target?.id != "fontSizeInput2" &&
      !canvas.contains(target)
    ) {
      deselectActiveObjects(canvas);
    }
  });

  // Event listener for clicks on the canvas
  canvas.on("mouse:down", function (event) {
    var target = event.target;

    // Deselect active objects when clicking outside objects
    if (!target) {
      deselectActiveObjects(canvas);
    }
  });
}

clickOutSideCanvas(canvas);
clickOutSideCanvas(canvas2);

const svgRotateIcon = encodeURIComponent(`
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#filter0_d)">
    <circle cx="9" cy="9" r="5" fill="white"/>
    <circle cx="9" cy="9" r="4.75" stroke="black" stroke-opacity="0.3" stroke-width="0.5"/>
  </g>
    <path d="M10.8047 11.1242L9.49934 11.1242L9.49934 9.81885" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.94856 6.72607L8.25391 6.72607L8.25391 8.03142" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.69517 6.92267C10.007 7.03301 10.2858 7.22054 10.5055 7.46776C10.7252 7.71497 10.8787 8.01382 10.9517 8.33642C11.0247 8.65902 11.0148 8.99485 10.9229 9.31258C10.831 9.63031 10.6601 9.91958 10.4262 10.1534L9.49701 11.0421M8.25792 6.72607L7.30937 7.73554C7.07543 7.96936 6.90454 8.25863 6.81264 8.57636C6.72073 8.89408 6.71081 9.22992 6.78381 9.55251C6.8568 9.87511 7.01032 10.174 7.23005 10.4212C7.44978 10.6684 7.72855 10.8559 8.04036 10.9663" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
  <defs>
  <filter id="filter0_d" x="0" y="0" width="18" height="18" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
    <feOffset/>
    <feGaussianBlur stdDeviation="2"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.137674 0 0 0 0 0.190937 0 0 0 0 0.270833 0 0 0 0.15 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
  </filter>
  </defs>
</svg>
`);
const rotateIcon = `data:image/svg+xml;utf8,${svgRotateIcon}`;
const imgIcon = document.createElement("img");
imgIcon.src = rotateIcon;

// Changing rotation control properties
fabric.Object.prototype.controls.mtr = new fabric.Control({
  x: 0,
  y: -0.5,
  offsetX: 0,
  offsetY: 0,
  cursorStyle: "crosshair",
  actionHandler: fabric.controlsUtils.rotationWithSnapping,
  actionName: "rotate",
  render: renderIcon,
  cornerSize: window.innerWidth > 500 ? 838 : 168,
  withConnection: true,
});

// Defining how the rendering action will be
function renderIcon(ctx, left, top, styleOverride, fabricObject) {
  var size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(imgIcon, -size / 2, -size / 2, size, size);
  ctx.restore();
}

document.addEventListener("DOMContentLoaded", function () {
  var shirtInfo = document.querySelector(".shirtinfo");
  shirtInfo.style.display = "none";
});

function toggleShirtInfo() {
  var shirtInfo = document.querySelector(".shirtinfo");
  if (shirtInfo.style.display === "none" || shirtInfo.style.display === "") {
    shirtInfo.style.display = "block";
  } else {
    shirtInfo.style.display = "none";
  }
}

let lista = document.getElementById("lista-imagenes");
let contador = document.getElementById("contador");
let botonMoverIzquierda = document.querySelector(".botonmoverizq");
let botonMoverDerecha = document.querySelector(".botonmoverder");
let scrollAmount = 310;
let currentIndex = 0;
let startX;

function actualizarContador() {
  contador.textContent = `${currentIndex + 1}/${lista.children.length}`;
}

function actualizarVisibilidadBotones() {
  botonMoverIzquierda.style.display = currentIndex === 0 ? "none" : "block";
  botonMoverDerecha.style.display =
    currentIndex === lista.children.length - 1 ? "none" : "block";
}

function handleTouchStart(e) {
  startX = e.touches[0].clientX;
}

function handleTouchMove(e) {
  if (!startX) return;

  let currentX = e.touches[0].clientX;
  let diffX = startX - currentX;

  if (diffX > 50) {
    moverDerecha();
    startX = null;
  } else if (diffX < -50) {
    moverIzquierda();
    startX = null;
  }
}

function moverDerecha() {
  if (currentIndex < lista.children.length - 1) {
    currentIndex++;
    lista.style.transform = `translateX(-${currentIndex * scrollAmount}px)`;
    actualizarContador();
    actualizarVisibilidadBotones();
  }
}

function moverIzquierda() {
  if (currentIndex > 0) {
    currentIndex--;
    lista.style.transform = `translateX(-${currentIndex * scrollAmount}px)`;
    actualizarContador();
    actualizarVisibilidadBotones();
  }
}

lista.addEventListener("touchstart", handleTouchStart);
lista.addEventListener("touchmove", handleTouchMove);

// Inicializar el contador y la visibilidad de los botones
actualizarContador();
actualizarVisibilidadBotones();

// Mostrar Datos 1 automáticamente al cargar la página
window.onload = function () {
  mostrarDatos1();
};

// Función para mostrar datos 1
function mostrarDatos1() {
  var datos = [
    { a: "S", b: 18, c: 28, d: 8.2 },
    { a: "M", b: 20, c: 29, d: 8.5 },
    { a: "L", b: 22, c: 30, d: 8.7 },
    { a: "XL", b: 24, c: 31, d: 9.1 },
    { a: "XXL", b: 26, c: 32, d: 9.2 },
    { a: "3XL", b: 28, c: 33, d: 9.5 },
  ];

  actualizarTabla(datos, "encabezado1");
  // Resaltar el botón seleccionado
  document.getElementById("boton1").classList.add("active");
  document.getElementById("boton2").classList.remove("active");
}

// Función para mostrar datos 2
function mostrarDatos2() {
  var datos = [
    { a: "S", b: 45.7, c: 71.1, d: 20.9 },
    { a: "M", b: 50.8, c: 73.6, d: 21.6 },
    { a: "L", b: 55.9, c: 76.2, d: 22.2 },
    { a: "XL", b: 60.1, c: 78.7, d: 22.9 },
    { a: "XXL", b: 66.1, c: 81.3, d: 23.5 },
    { a: "3XL", b: 71.1, c: 83.9, d: 24.1 },
  ];

  actualizarTabla(datos, "encabezado2");
  // Resaltar el botón seleccionado
  document.getElementById("boton1").classList.remove("active");
  document.getElementById("boton2").classList.add("active");
}

// Función para actualizar la tabla con nuevos datos y encabezados
function actualizarTabla(datos, encabezadoId) {
  // Ocultar todos los encabezados
  document.getElementById("encabezado1").style.display = "none";
  document.getElementById("encabezado2").style.display = "none";

  // Mostrar el encabezado correspondiente al conjunto de datos
  document.getElementById(encabezadoId).style.display = "table-header-group";

  var cuerpoTabla = document.getElementById("cuerpoTabla");
  cuerpoTabla.innerHTML = "";

  for (var i = 0; i < datos.length; i++) {
    var fila = cuerpoTabla.insertRow(i);
    var celdaa = fila.insertCell(0);
    var celdab = fila.insertCell(1);
    var celdac = fila.insertCell(2);
    var celdad = fila.insertCell(3);

    celdaa.innerHTML = datos[i].a;
    celdab.innerHTML = datos[i].b;
    celdac.innerHTML = datos[i].c;
    celdad.innerHTML = datos[i].d;

    celdaa.innerHTML = "<strong>" + datos[i].a + "</strong>";
    celdab.innerHTML = datos[i].b;
    celdac.innerHTML = datos[i].c;
  }
}

function toggleShirtInfo() {
  var shirtInfo = document.querySelector(".shirtinfo");
  if (shirtInfo.style.display === "none" || shirtInfo.style.display === "") {
    shirtInfo.style.display = "block";
    shirtInfo.parentElement.style.height = "100vh";
    shirtInfo.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    shirtInfo.style.display = "none";
    shirtInfo.parentElement.style.height = "auto";
  }
}

