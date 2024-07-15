// This is your test secret API key.
const dotenv = require("dotenv");

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const express = require("express");

const cors = require("cors");
const app = express();
app.use(express.static("public"));
app.use(express.static("."));
app.use(
  cors({
    origin: "*",
    allowedHeaders: true,
  })
);

let frontSideSecureUrl = "";
let backSideSecureUrl = "";
let hasBothSides = false;

// Get the current date
var currentDate = new Date();

// Add one week to the current date
var oneWeekLater = new Date(currentDate);
oneWeekLater.setDate(oneWeekLater.getDate() + 7);

// Add 4 days to the one week later date
var expectedDeliveryDate = new Date(oneWeekLater);
expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 4);

// Format the dates in "ddmm" format
var formattedCurrentDate = currentDate
  .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
  .replace(/\//g, "");
var formattedOneWeekLater = oneWeekLater
  .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
  .replace(/\//g, "");
var formattedExpectedDeliveryDate = expectedDeliveryDate
  .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
  .replace(/\//g, "");

app.use(express.json({ limit: "50mb" }));

const YOUR_DOMAIN = "https://www.desyy.com";
// const YOUR_DOMAIN = "http://localhost:4242";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dts36tgxc",
  api_key: "736723159885782",
  api_secret: "S4HOUVmIBvDmj9Zu3W4-607-MlQ",
});

app.post("/upload", (req, res) => {
  const { frontImage } = req.body;

  cloudinary.uploader.upload(
    frontImage,
    {
      public_id: `${Date.now()}unique_public_id`,
      timeout: 600000,
    },
    function (error, result) {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to upload image to Cloudinary" });
      } else {
        frontSideSecureUrl = result.secure_url;
        res.status(200).json({ success: true, result });
      }
    }
  );
});

app.post("/uploadBack", (req, res) => {
  const { backImage } = req.body;

  cloudinary.uploader.upload(
    backImage,
    {
      public_id: `${Date.now()}_unique_public_id_back`,
      timeout: 600000,
    },
    function (error, result) {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to upload image to Cloudinary" });
      } else {
        backSideSecureUrl = result.secure_url;
        res.status(200).json({ success: true, result });
      }
    }
  );
});

app.post("/create-checkout-session", async (req, res) => {
  hasBothSides = false;
  try {
    const {
      imageSrc,
      sizes,
      color,
      hasImagesForFrontCanvas,
      hasTextsForFrontCanvas,
      hasImagesForBackCanvas,
      hasTextsForBackCanvas,
    } = req.body;

    if (!hasImagesForFrontCanvas && !hasTextsForFrontCanvas) {
      frontSideSecureUrl = "none";
    }

    if (!hasImagesForBackCanvas && !hasTextsForBackCanvas) {
      backSideSecureUrl = "none";
    }

    if (
      (hasImagesForFrontCanvas || hasTextsForFrontCanvas) &&
      (hasImagesForBackCanvas || hasTextsForBackCanvas)
    ) {
      console.log("RAN");
      hasBothSides = true;
    }

    const sum = Object.values(sizes).reduce((acc, value) => acc + value, 0);

    console.log({ frontSideSecureUrl, backSideSecureUrl, sizes });

    // Create a Checkout session with the selected image and quantity
    const session = await stripe.checkout.sessions.create(
      {
        line_items: [
          {
            price_data: {
              unit_amount: hasBothSides ? 3499 : 2499,
              product_data: {
                name: "T-Shirt",
                description: "Awesome T-Shirt",

                // images: [frontSideSecureUrl],
              },
              currency: "usd",
            },
            quantity: sum,
          },
        ],
        allow_promotion_codes: true,
        mode: "payment",
        shipping_address_collection: {
          allowed_countries: [
            "US",
            "FR",
            "DE",
            "GB",
            "AC",
            "AD",
            "PK",
            "AE",
            "AF",
            "AG",
            "AI",
            "AL",
            "AM",
            "AQ",
            "DJ",
            "IN",
            "IM",
            "PG",
            "PH",
            "AT",
            "BE",
            "BG",
            "HR",
            "CY",
            "CZ",
            "DK",
            "EE",
            "FI",
            "GR",
            "HU",
            "IE",
            "IT",
            "LV",
            "LT",
            "LU",
            "MT",
            "NL",
            "PL",
            "PT",
            "RO",
            "ES",
            "SE",
          ],
        },
        custom_text: {
          shipping_address: {
            message:
              "Expected delivery time: " +
              formattedOneWeekLater +
              "-" +
              formattedExpectedDeliveryDate,
          },
          submit: {
            message: "We'll email you instructions on how to get started.",
          },
        },
        phone_number_collection: {
          enabled: true,
        },

        success_url: `${YOUR_DOMAIN}/shirt-thank-you.html`,
        cancel_url: `${YOUR_DOMAIN}/shirt.html`,
        // Pass the selected image information to the metadata
        payment_method_types: ["card"],
        payment_intent_data: {
          metadata: {
            sizeDetails: JSON.stringify(sizes),
            // ShirtFront: JSON.stringify(imageSrc),
            shirtColor: color,
            dataFront: frontSideSecureUrl,
            dataBack: backSideSecureUrl,
          },
        },
      },
      {
        timeout: 600000,
      }
    );

    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(4242, () => console.log("Running on port 4242"));
