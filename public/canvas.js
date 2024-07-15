import { svgRotateIcon } from "../assets/svgRotateIcon.js";
// import { textTippy } from "./tooltip.js";

$(document).ready(function () {
  // let scale = 1;
  // let panX = 0;
  // let panY = 0;
  // const zoomSensitivity = 0.01; // Decrease this value for slower zooming
  // const maxScale = 3; // Maximum zoom level
  // const minScale = 0.5; // Minimum zoom level

  // const $container = $("#outer-canvas-container");
  // const $canvasFrontContainer = $("#canvas-front-container");
  // const $canvasBackContainer = $("#canvas-back-container");

  // function updateTransform() {
  //   const transformString = `scale(${scale}) translate(${panX}px, ${panY}px)`;
  //   $canvasFrontContainer.css("transform", transformString);
  //   $canvasBackContainer.css("transform", transformString);
  // }

  // $container.on("wheel", function (e) {
  //   e.preventDefault();
  //   const delta =
  //     e.originalEvent.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
  //   const newScale = scale + delta;
  //   if (newScale >= minScale && newScale <= maxScale) {
  //     scale = newScale;
  //     updateTransform();
  //   }
  // });

  // let isPanning = false;
  // let startX, startY;

  // $container.on("mousedown", function (e) {
  //   isPanning = true;
  //   startX = e.clientX - panX;
  //   startY = e.clientY - panY;
  // });

  // $container.on("mousemove", function (e) {
  //   if (!isPanning) return;
  //   panX = e.clientX - startX;
  //   panY = e.clientY - startY;
  //   updateTransform();
  // });

  // $container.on("mouseup mouseleave", function () {
  //   isPanning = false;
  // });

  let convertedBackUrl;
  let convertedFrontUrl;

  // Fabric.js initialization
  if (typeof fabric !== "undefined") {
    const mobileConfig = {
      cornerSize: 45,
      cornerStrokeWidth: 20,
      padding: 25,
      cornerScalingAction: false,
      cornerStyle: "circle",
      cornerStrokeColor: "#000",
    };

    const desktopConfig = {
      cornerSize: 200,
      cornerStrokeWidth: 10,
      padding: 100,
      cornerStrokeColor: "#9652a8",
      cornerStyle: "circle",
    };

    const isMobile = window.innerWidth <= 500; // Adjust breakpoint as needed

    fabric.Object.prototype.set({
      // Mobile-Optimized Selection
      cornerSize: isMobile ? mobileConfig.cornerSize : desktopConfig.cornerSize,
      cornerStrokeWidth: isMobile
        ? mobileConfig.cornerStrokeWidth
        : desktopConfig.cornerStrokeWidth,
      padding: isMobile ? mobileConfig.padding : desktopConfig.padding,
      transparentCorners: false, // Show clear selection indicators
      selectable: true,
      cornerStrokeColor: isMobile
        ? mobileConfig.cornerStrokeColor
        : desktopConfig.cornerStrokeColor,
      // Improved User Experience (Optional Visual Feedback)
      borderColor: "#9652a8", // Semi-transparent blue border on select
      cornerColor: "#9652a8", // Semi-transparent blue corners on select
      // cornerStyle: isMobile ? mobileConfig.cornerStyle : desktopConfig.cornerStyle,
      borderScaleFactor: isMobile ? 7 : 40,
      cornerScalingAction: false,
    });

    const canvas = new fabric.Canvas("canvas", {
      preserveObjectStacking: true,
    });

    const canvas2 = new fabric.Canvas("canvas2", {
      preserveObjectStacking: true,
    });

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
        cornerStrokeWidth: 20,
        transparentCorners: false,
        selectable: true,
        borderScaleFactor: 8,
      });
      SIZE = 600;
    } else {
      SIZE = 2000;
    }

    let activeCanvas = canvas; // Initially set the active canvas

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

      activeCanvas = canvasToShow;
      updateInputChangeListener("#input", activeCanvas, ".uploaded-images");
      addText("#addTextBtn", activeCanvas);
      italicBtn("#italic-btn", activeCanvas);
      boldBtn("#bold-btn", activeCanvas);
      changeTextSize("#text-size-field", activeCanvas, false);
      changeTextSize("#increment-btn", activeCanvas, true, "+");
      changeTextSize("#decrement-btn", activeCanvas, true, "-");
      activeCanvas.on("selection:created", selectAction);
      activeCanvas.on("selection:updated", selectAction);
      activeCanvas.on("selection:cleared", clearAction);
    }

    // Event listener for "Canvas1" button
    document.getElementById("holaBtn").addEventListener("click", function () {
      toggleCanvasVisibility(canvas, canvas2, "#canvas", "#canvas2");
      $("#holaBtn").addClass("active-canvas");
      $("#adiosBtn").removeClass("active-canvas");
    });

    // Event listener for "Canvas2" button
    document.getElementById("adiosBtn").addEventListener("click", function () {
      toggleCanvasVisibility(canvas2, canvas, "#canvas2", "#canvas");
      $("#holaBtn").removeClass("active-canvas");
      $("#adiosBtn").addClass("active-canvas");
    });

    // Function to update the inputChange event listener
    function updateInputChangeListener(selector, targetCanvas, container) {
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
          const scaleFactor = Math.min(
            MAX_SIZE / img.width,
            MAX_SIZE / img.height
          );
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

    updateInputChangeListener("#input", activeCanvas, ".uploaded-images");

    function canvasEvents(targetCanvas) {
      targetCanvas.on("selection:created", function (event) {
        $("canvas").css("border", "2px dashed white");
        const selectedObject = event.selected[0];
        if (selectedObject && selectedObject.type === "image") {
          $("#modification-options-container").removeClass("hidden");
          $(".text-buttons-div").addClass("hidden");
        } else {
          $("#modification-options-container").removeClass("hidden");
          $(".text-buttons-div").removeClass("hidden");
        }
      });

      targetCanvas.on("selection:updated", function (event) {
        $("canvas").css("border", "2px dashed white");
        const selectedObject = event.selected[0];
        if (selectedObject && selectedObject.type === "image") {
          $("#modification-options-container").removeClass("hidden");
          $(".text-buttons-div").addClass("hidden");
        } else {
          $("#modification-options-container").removeClass("hidden");
          $(".text-buttons-div").removeClass("hidden");
        }
      });

      targetCanvas.on("selection:cleared", function (event) {
        $("canvas").css("border", "none");
        $("#modification-options-container").addClass("hidden");
      });
    }

    canvasEvents(canvas);
    canvasEvents(canvas2);

    const rotateIcon = `data:image/svg+xml;utf8,${svgRotateIcon}`;
    const imgIcon = new Image();
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
      const size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(imgIcon, -size / 2, -size / 2, size, size);
      ctx.restore();
    }

    function deleteTextPreview(fabricID) {
      const textPreviewContainer = document.querySelector(
        `[data-fabric-id='${fabricID}']`
      );
      if (textPreviewContainer) {
        textPreviewContainer.parentElement.remove();

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

    function createTextPreview(text, container) {
      const textPreview = document.createElement("p");
      textPreview.className =
        "border-2 rounded-lg w-full my-4 font-medium capitalize text-black flex items-center justify-between p-3";
      textPreview.innerHTML = `<input type='text' class='dynamic-text'   style="color: #000;" id='${text.fabricID}' value='${text.text}'><i data-lucide="trash-2" class="cursor-pointer trash-icon" data-fabric-id="${text.fabricID}"></i>`;

      const containerToAppendText = document.querySelector(container);
      containerToAppendText.appendChild(textPreview);
      containerToAppendText.style.height = "120px";
      containerToAppendText.style.overflowY = "auto";

      lucide.createIcons();
    }

    $(document).on("input", ".dynamic-text", function () {
      const fabricID = $(this).attr("id");
      const newText = $(this).val();
      updateFabricObjectText(fabricID, newText, canvas);
    });

    function updateFabricObjectText(fabricID, newText, canvas) {
      const fabricObject = canvas
        .getObjects()
        .find((obj) => obj.get("fabricID") === fabricID);

      if (fabricObject && fabricObject.type === "i-text") {
        fabricObject.set({ text: newText });
        canvas.renderAll();
      }
    }

    function updateTextPreview(fabricID, canvas) {
      const fabricObject = canvas
        .getObjects()
        .find((obj) => obj.get("fabricID") === fabricID);

      if (fabricObject && fabricObject.type === "i-text") {
        const textPreview = document.querySelector(`#${fabricID}`);
        textPreview.value = fabricObject.text;
        // textPreview.style.fontFamily = fabricObject.fontFamily;
        // textPreview.style.fontSize = fabricObject.fontSize + 'px';
        textPreview.style.color = "black";
        // textPreview.style.fontWeight = fabricObject.fontWeight;
        // textPreview.style.fontStyle = fabricObject.fontStyle;
        // Update other styles as needed (e.g., fontWeight, fontStyle, etc.)
      }
    }

    canvas.on("text:changed", function (event) {
      // textTippy[0].show();
      // textTippy[0].popper.style.opacity = "0";
      const activeObject = canvas.getActiveObject().fabricID;
      updateTextPreview(activeObject, canvas);
    });

    canvas2.on("text:changed", function (event) {
      // textTippy[0].show();
      // textTippy[0].popper.style.opacity = "0";
      const activeObject = canvas2.getActiveObject().fabricID;
      updateTextPreview(activeObject, canvas2);
    });

    $(document).on("click", ".trash-icon", function () {
      const fabricID = $(this).data("fabric-id");
      deleteTextPreview(fabricID);
      const container = document.querySelector(".dynamic-text-preview-div");
      if (container.children.length == 0) {
        container.style.height = "auto";
        container.style.overflowY = "auto";
      }
    });

    function addText(textbox, targetCanvas, container) {
      const uniqueEventName = `click.addText`; // Simplified namespace

      // Remove any existing event listener for the specific namespace
      $(document).off(`.${uniqueEventName}`, textbox);
      $(document).on(`click.${uniqueEventName}`, textbox, function () {
        const text = new fabric.IText("Edit your text", {
          left: 100,
          top: 100,
          width: 200,
          height: 100,
          fontFamily: "Poppins",
          fontSize: window.innerWidth > 500 ? 250 : 50,
          fill: "white",
          fontWeight: "normal",
          fontStyle: "normal",
          textAlign: "left",
        });
        const fabricID = `fabric_${Date.now()}`;

        targetCanvas.add(text);
        text.set("fabricID", fabricID);
        createTextPreview(text, ".dynamic-text-preview-div");

        // Delay setting active object to ensure text is fully added to targetCanvas
        setTimeout(() => {
          targetCanvas.setActiveObject(text);
          targetCanvas.renderAll();
          text.enterEditing();
          text.selectAll();
        }, 100);
      });
    }

    addText("#addTextBtn", activeCanvas);

    // Function to toggle text styles
    function toggleTextStyles(property, value, canvas) {
      const activeObject = canvas.getActiveObject();
      console.log(activeObject);
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
      $(document).on("click", selector, () => {
        toggleTextStyles("fontWeight", "bold", canvas);
        const activeObject = activeCanvas._activeObject.fabricID;
        updateTextPreview(activeObject, canvas);
      });
    }
    function italicBtn(selector, canvas) {
      // Example for toggling italic style on button click
      $(document).on("click", selector, () => {
        toggleTextStyles("fontStyle", "italic", canvas);
        const activeObject = activeCanvas._activeObject.fabricID;
        updateTextPreview(activeObject, canvas);
      });
    }

    function changeTextSize(selector, canvas, buttonClick, operator) {
      // Example for toggling italic style on button click
      if (!buttonClick) {
        $(document).on("input", selector, () => {
          const fontSize = $(selector).val();
          toggleTextStyles("fontSize", fontSize, canvas);
        });
      } else {
        $(document).on("click", selector, () => {
          const fontSize = activeCanvas._activeObject.fontSize;
          let newFontSize;
          if (operator == "+") {
            newFontSize = fontSize + 20;
          } else {
            newFontSize = fontSize - 20;
          }
          $("#text-size-field").val(newFontSize);

          toggleTextStyles("fontSize", newFontSize, canvas);
        });
      }
    }

    changeTextSize("#text-size-field", activeCanvas, false);
    changeTextSize("#increment-btn", activeCanvas, true, "+");
    changeTextSize("#decrement-btn", activeCanvas, true, "-");

    italicBtn("#italic-btn", activeCanvas);

    boldBtn("#bold-btn", activeCanvas);

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
          // target?.id != "text-size-field" &&
          // target?.id != "fonts" &&
          // target?.id != "decrement-btn" &&
          // target?.id != "increment-btn" &&
          // target?.id != "font-size-div" &&
          // target?.className != "text-modification-btn" &&
          // target?.className != "buttons-div" &&
          // target?.id != "fontFamilyOptionDiv" &&
          // target?.className != "text-buttons-div" &&
          // target.id != "bold-btn" &&
          // target.id != "italic-btn" &&
          // target.id != "delete-image" &&
          !target.closest("#image-modification-menu") &&
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

    // Function to get the active image object
    function getActiveImage(canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        canvas.renderAll();
      } else {
        console.log("No active image object.");
        return null;
      }
    }

    $(document).on("click", "#delete-image", function (params) {
      getActiveImage(activeCanvas);
    });

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

    let sessionUrl = "";
    let hasImagesForFrontCanvas;
    let hasImagesForBackCanvas;
    let hasTextForBackCanvas;
    let hasTextForFrontCanvas;

    function isObjectEmpty(obj) {
      return Object.keys(obj).length === 0;
    }

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
      hasImagesForFrontCanvas = hasImages(canvas) || false;
      hasTextForFrontCanvas = hasText(canvas) || false;
    });

    canvas2.on("mouse:down", function (event) {
      hasImagesForBackCanvas = hasImages(canvas2) || false;
      hasTextForBackCanvas = hasText(canvas2) || false;
    });

    canvas.on("selection:cleared", function (event) {
      hasImagesForFrontCanvas = hasImages(canvas) || false;
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
        // if (termsAccepted) {
        window.location.href = session.url;
        // }
        sessionUrl = session.url;
      } catch (error) {
        console.error("Error processing checkout:", error);
        // Handle error, e.g., display an error message to the user
      }
    }

    // document.querySelectorAll(".cart-btn").forEach((btn) => {
    $(document).on("click", ".cart-btn", async function (params) {
      // $(this).click("click", async function () {
      var shirtColor = $(".color-div.active").attr("id");
      $("#shirt-size-tooltip").removeClass("hidden");
      console.log(shirtColor);
      // Collect the selected sizes and quantities
      var selectedSizes = {};
      $(".size-div").each(function () {
        var size = $(this).find("p").text().trim();
        var quantity = parseInt($(this).find(".quantity").text());

        // Only include sizes with a quantity greater than 0
        if (quantity > 0) {
          selectedSizes[size] = quantity;
        }
      });

      if (isObjectEmpty(selectedSizes)) {
        return;
      } else {
        document.querySelectorAll(".cart-btn").forEach((btn) => {
          // btn.textContent = "";
          btn.disabled = true;
          btn.style.opacity = "0.7";
          btn.style.color = "#BA69F0";
        });
        $(".loader").addClass("inline-block");
        // $(".loading-modal").addClass("inline-block");
        // $(".overlay").addClass("inline-block");
        canvas.backgroundColor = "#00b140";
        canvas2.backgroundColor = "#00b140";
        setTimeout(() => {
          canvas.backgroundColor = "transparent";
          canvas2.backgroundColor = "transparent";
          canvas.renderAll();
        }, 3000);
        canvas.renderAll();
        addDesignToShirt(() => handleUpload(selectedSizes, shirtColor));
      }
      // });
    });

    // });

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
            body: JSON.stringify({
              frontImage:
                window.innerWidth <= 500
                  ? convertedFrontUrl
                  : canvasFrontDesign,
            }),
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
            body: JSON.stringify({
              backImage:
                window.innerWidth <= 500 ? convertedBackUrl : canvasBackDesign,
            }),
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

    function addDesignToShirt(callback) {
      // $("#holaBtn").click();
      // $(".shirtSize").hide();
      // Disable borders
      // canvas.discardActiveObject().renderAll();

      document.querySelectorAll("canvas").forEach((canvas) => {
        canvas.style.border = "2px dashed black";
      });

      const img = document.getElementById("shirt-image");

      const originalImg = img.src;
      img.src = "./new-images/Front/bg.png";
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
            // document.querySelector("#shirtDesignFront").src = convertedFrontUrl;
            // document.querySelector("#shirtDesignFront").style.display = "block";
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
      // $("#adiosBtn").click();
      // $(".shirtSize").hide();

      // Disable borders
      // canvas2.discardActiveObject().renderAll();

      const img = document.getElementById("shirt-image-back");

      const originalImg = img.src;
      img.src = "./new-images /Back/bg.png";
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
          // openModal();
          $(".loading-modal").hide();
          $(".overlay").hide();
          if (hasImagesForBackCanvas || hasTextForBackCanvas) {
            // document.querySelector("#shirtDesignBack").src = convertedBackUrl;
            // document.querySelector("#shirtDesignBack").style.display = "block";
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

    // Add event listeners to the range sliders
    const widthSlider = document.getElementById("widthResizer");
    const heightSlider = document.getElementById("heightResizer");
    const fontSizeSlider = document.getElementById("fontSizeSlider");
    const fontSizeSliderCon = document.querySelector(".text-font-size");
    const sizeSliderCon = document.querySelectorAll(".resizer-slider");

    widthSlider.addEventListener("input", function () {
      let activeObject = activeCanvas.getActiveObject();
      if (!activeObject) return;
      if (activeObject.type === "image") {
        //  change image scalingX
        activeObject.set({
          scaleX: this.value / activeObject.width,
        });
        activeObject.setCoords();
        activeCanvas.renderAll();
      }
    });

    heightSlider.addEventListener("input", function () {
      let activeObject = activeCanvas.getActiveObject();
      if (!activeObject) return;
      if (activeObject.type === "image") {
        //  change image scalingY
        activeObject.set({
          scaleY: this.value / activeObject.height,
        });
        activeObject.setCoords();
        activeCanvas.renderAll();
      }
    });

    fontSizeSlider.addEventListener("input", function () {
      const fontSizeValue = parseInt(this.value);
      let activeObject = activeCanvas.getActiveObject();
      if (!activeObject) return;
      if (activeObject.type === "i-text") {
        activeObject.set("fontSize", fontSizeValue);
        activeCanvas.renderAll();
      }
    });

    // Change slider values when selecting any object
    activeCanvas.on("selection:created", selectAction);
    activeCanvas.on("selection:updated", selectAction);
    activeCanvas.on("selection:cleared", clearAction);

    function clearAction() {
      fontSizeSliderCon.style.display = "none";
      sizeSliderCon.forEach((slider) => {
        slider.style.display = "none";
      });
    }

    function selectAction(e) {
      const activeObject = e.selected[0];
      if (activeObject) {
        if (activeObject.type === "i-text") {
          fontSizeSliderCon.style.display = "block";
          sizeSliderCon.forEach((slider) => {
            slider.style.display = "none";
          });
          fontSizeSlider.value = activeObject.fontSize;
        } else {
          fontSizeSliderCon.style.display = "none";
          sizeSliderCon.forEach((slider) => {
            slider.style.display = "block";
          });

          widthSlider.value = activeObject.width * activeObject.scaleX;
          heightSlider.value = activeObject.height * activeObject.scaleY;
        }
      }
    }
  }
});
