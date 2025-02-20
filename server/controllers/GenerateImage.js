// import * as dotenv from "dotenv";
// import { createError } from "../error.js";
// import { Configuration, OpenAIApi } from "openai";

// dotenv.config();

// // Setup open ai api key
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// // Controller to generate Image
// export const generateImage = async (req, res, next) => {
//   try {
//     const { prompt } = req.body;

//     const response = await openai.createImage({
//       prompt,
//       n: 1,
//       size: "1024x1024",
//       response_format: "b64_json",
//     });
//     const generatedImage = response.data.data[0].b64_json;
//     res.status(200).json({ photo: generatedImage });
//   } catch (error) {
//     next(
//       createError(
//         error.status,
//         error?.response?.data?.error.message || error.message
//       )
//     );
//   }
// };

import * as dotenv from "dotenv";
import { createError } from "../error.js";
import axios from "axios";

dotenv.config();

// Controller to generate Image using ClipDrop
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      { prompt },
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer", // Ensure image data is received correctly
      }
    );

    const generatedImage = Buffer.from(response.data, "binary").toString("base64");

    res.status(200).json({ photo: generatedImage });
  } catch (error) {
    next(
      createError(
        error.response?.status || 500,
        error.response?.data?.error?.message || error.message || "Image generation failed"
      )
    );
  }
};


