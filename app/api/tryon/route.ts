import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
// History types might not be needed if we simplify the input structure
// import { HistoryItem, HistoryPart } from "@/libs/types";

// Create a new redis client.
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter, that allows 5 requests per 1 day
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 d"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Initialize the Google Gen AI client with your API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY environment variable.");
  // Optionally throw an error or handle appropriately
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Define the model ID for Gemini 2.0 Flash experimental
const MODEL_ID = "gemini-2.5-flash-image-preview";

// Removed FormattedHistoryItem interface as history handling is simplified

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_middleware_${ip}`
  );
  if (!success) {
    return NextResponse.json(
      {
        error: "You have reached your daily limit of 5 generations.",
        reset: new Date(reset).toLocaleString(),
      },
      { status: 429 }
    );
  }

  let formData;
  try {
    // Parse FormData request instead of JSON
    formData = await req.formData();
  } catch (formError) {
    console.error("Error parsing FormData request body:", formError);
    return NextResponse.json(
      {
        error: "Invalid request body: Failed to parse FormData.",
        details: formError instanceof Error ? formError.message : String(formError),
      },
      { status: 400 } // Bad Request
    );
  }

  try {
    // Extract files and potentially a basic prompt text from FormData
    const userImageFile = formData.get("userImage") as File | null;
    const clothingImageFile = formData.get("clothingImage") as File | null;
    // const basicPrompt = formData.get("prompt") as string | null; // We'll construct the main prompt below

    if (!userImageFile || !clothingImageFile) {
      return NextResponse.json(
        { error: "Both userImage and clothingImage files are required" },
        { status: 400 }
      );
    }

    // Construct the detailed prompt for the AI
    const optimizedPrompt = `
You are an expert AI fashion stylist. Create a photorealistic virtual try-on by seamlessly integrating the clothing item onto the person in the photo.

**ESSENTIAL REQUIREMENTS:**
1. **Preserve Identity**: Keep the person's face, body, skin tone, and hair exactly the same
2. **Natural Fit**: Ensure clothing fits realistically with proper draping and fabric behavior
3. **Consistent Lighting**: Match the original photo's lighting, shadows, and color temperature
4. **Seamless Integration**: No visible artifacts or unrealistic blending
5. **Professional Quality**: Result should look like an authentic fashion photograph

**TECHNICAL GUIDELINES:**
- Analyze body proportions for accurate clothing placement
- Consider fabric properties for realistic draping
- Maintain original background and image quality
- Add natural shadows where clothing creates them
- Ensure clothing follows body contours naturally

**OUTPUT:**
Generate a high-quality virtual try-on image with a brief description of the styling result.
`;

  const detailedPrompt2 = `{
  "objective": "Intelligent Contextual Virtual Try-On with Dynamic Understanding",
  
  "core_philosophy": "UNDERSTAND, ANALYZE, ADAPT - Don't just place items, intelligently integrate them",
  
  "analysis_framework": {
    "user_image_understanding": {
      "spatial_analysis": "Identify visible body areas, pose, orientation, and angles",
      "contextual_analysis": "Understand lighting direction, environment mood, photographic style",
      "anatomical_analysis": "Assess body proportions, build, posture, and physical characteristics",
      "existing_items_analysis": "Catalog current clothing/accessories and their fit/style"
    },
    
    "target_item_understanding": {
      "visual_properties": "Extract exact colors, textures, patterns, materials, and design details",
      "dimensional_analysis": "Understand the item's 3D structure, draping behavior, and coverage area",
      "style_context": "Determine the item's formality, season, and typical wearing context",
      "perspective_analysis": "Identify the viewing angle and orientation of the item in its source image"
    }
  },
  
  "adaptive_integration_principles": {
    "perspective_matching": {
      "challenge": "Item and user may be photographed from different angles",
      "solution": "Intelligently transform the item's appearance to match user's pose and viewing angle",
      "example_scenario": "User facing right profile + front-view item → generate right-profile version of item"
    },
    
    "anatomical_adaptation": {
      "challenge": "Items must conform to user's unique body shape and proportions",
      "solution": "Analyze user's visible anatomy and realistically adapt item's fit, drape, and positioning",
      "considerations": "Account for body type, muscle definition, posture variations, and natural body curves"
    },
    
    "environmental_harmony": {
      "challenge": "New item must belong naturally in the user's environment",
      "solution": "Match lighting conditions, shadow patterns, and environmental reflections on the new item",
      "considerations": "Indoor vs outdoor, natural vs artificial light, time of day, weather conditions"
    },
    
    "contextual_appropriateness": {
      "challenge": "Item must make sense with existing outfit and setting",
      "solution": "Consider style compatibility, layering logic, and situational appropriateness",
      "considerations": "Formal vs casual, seasonal appropriateness, cultural context"
    }
  },
  
  "intelligent_modification_approach": {
    "analysis_first": "Before any modification, thoroughly understand both images and their relationship",
    "minimal_intervention": "Preserve maximum amount of original user image while achieving realistic integration",
    "adaptive_generation": "When extending or generating, maintain consistency with established visual patterns",
    "quality_over_convenience": "Prioritize realistic, believable results over simple copy-paste operations"
  },
  
  "dynamic_strategies": {
    "when_direct_replacement_possible": {
      "approach": "Seamlessly replace existing item while maintaining all surrounding elements",
      "focus": "Perfect edge blending, lighting consistency, and natural interaction with adjacent areas"
    },
    
    "when_perspective_adjustment_needed": {
      "approach": "Reconstruct item appearance to match user's pose and viewing angle",
      "focus": "Maintain item's essential visual properties while adapting to new perspective"
    },
    
    "when_body_extension_required": {
      "approach": "Naturally extend visible anatomy while preserving established proportions and style",
      "focus": "Seamless continuation of user's body characteristics and environmental context"
    },
    
    "when_creative_adaptation_needed": {
      "approach": "Generate contextually appropriate solution that honors both user and item characteristics",
      "focus": "Believable integration that feels natural and intentional"
    }
  },
  
  "quality_assurance_criteria": {
    "visual_coherence": "Result should look like a single, naturally-taken photograph",
    "anatomical_accuracy": "All body proportions and item fit should appear realistic and natural",
    "lighting_consistency": "All elements should share the same lighting environment",
    "style_harmony": "New item should feel like it belongs in the user's context",
    "perspective_accuracy": "All elements should share consistent viewing angles and spatial relationships"
  },
  
  "forbidden_approaches": [
    "Simple copy-paste without perspective adjustment",
    "Ignoring user's body proportions or pose",
    "Maintaining item's original perspective when it conflicts with user's pose", 
    "Adding items that don't match the environmental lighting",
    "Creating results that look obviously edited or artificial",
    "Forcing items to fit without considering anatomical reality"
  ],
  
  "success_definition": "The final image should appear as if the user was naturally photographed wearing the target item in their original environment, with no indication of digital manipulation"
}`;
    const detailedPrompt = `{
      "prompt_version": "2.0", // Updated version
      "objective": "Generate a photorealistic virtual try-on image, seamlessly integrating a specified clothing item onto a person while rigidly preserving their facial identity, the clothing's exact appearance, and placing them in a completely new, distinct background.",
      "task": "High-Fidelity Virtual Try-On with Identity/Garment Preservation and Background Replacement", // Updated task name

      "inputs": {
        "person_image": {
          "description": "Source image containing the target person. Used *primarily* for identity (face, skin tone), pose, body shape, hair, and accessories. The original background will be DISCARDED.",
          "id": "input_1"
        },
        "garment_image": {
          "description": "Source image containing the target clothing item. May include a model, mannequin, or be flat-lay. Used *strictly* for the clothing's visual properties (color, style, texture, pattern).",
          "id": "input_2"
        },
        "background_preference": { // NEW Optional Input
          "description": "Optional textual description or style reference for the desired new background (e.g., 'neutral studio', 'outdoor park scene', 'blurred cityscape'). If unspecified, generate a plausible, non-distracting, photorealistic background.",
          "id": "input_3",
          "required": false
        }
      },

      "processing_steps": [
        "Isolate the clothing item from 'garment_image' (input_2), discarding any original model, mannequin, or background. Extract exact color, pattern, texture, and style information.",
        "Identify the person (face, body shape, skin tone), pose, hair, and accessories from 'person_image' (input_1).",
        "Segment the person from the original background in 'person_image'.",
        "Determine the desired new background based on 'background_preference' or generate a suitable default.",
        "Analyze lighting cues from 'person_image' to inform initial lighting on the subject, but adapt lighting for consistency with the *new* background." // Adjusted lighting focus
      ],

      "output_requirements": {
        "description": "Generate a single, high-resolution image where the person from 'person_image' appears to be naturally and realistically wearing the clothing item from 'garment_image', situated within a **completely new and different background**.", // Updated description
        "format": "Image (e.g., PNG, JPG)",
        "quality": "Photorealistic, free of obvious artifacts, blending issues, or inconsistencies between subject, garment, and the new background."
      },

      "core_constraints": {
        "identity_lock": {
          "priority": "ABSOLUTE CRITICAL", // Stronger priority term
          "instruction": "Maintain the **PERFECT** facial identity, features, skin tone, and expression of the person from 'person_image'. **ZERO alterations** to the face are permitted. Treat the head region (including hair) as immutable unless directly and logically occluded by the garment. DO NOT GUESS OR HALLUCINATE FACIAL FEATURES." // Explicitly added "DO NOT GUESS" and strengthened language
        },
        "garment_fidelity": {
          "priority": "ABSOLUTE CRITICAL", // Stronger priority term
          "instruction": "Preserve the **EXACT** color (hue, saturation, brightness), pattern, texture, material properties, and design details of the clothing item from 'garment_image'. **ZERO deviations** in style, color, or visual appearance are allowed. Render the garment precisely as depicted in input_2." // Strengthened language
        },
        "background_replacement": { // NEW Constraint (Replaces background_preservation)
          "priority": "CRITICAL",
          "instruction": "Generate a **COMPLETELY NEW and DIFFERENT** background that is distinct from the original background in 'person_image'. The new background should be photorealistic and contextually plausible for a person/fashion image unless otherwise specified by 'background_preference'. Ensure the person is seamlessly integrated into this new environment. **NO elements** from the original background should remain visible."
        },
        "pose_preservation": {
          "priority": "HIGH",
          "instruction": "Retain the **exact** body pose and positioning of the person from 'person_image'."
        },
        "realistic_integration": {
          "priority": "HIGH",
          "instruction": "Simulate physically plausible draping, folding, and fit of the garment onto the person's body according to their shape and pose. Ensure natural interaction with the body within the context of the *new* background." // Added context mention
        },
        "lighting_consistency": {
          "priority": "HIGH",
          "instruction": "Apply lighting, shadows, and highlights to the rendered garment AND the person that are **perfectly consistent** with the direction, intensity, and color temperature implied by the **NEW background**. Adjust subject lighting subtly if necessary to match the new scene, but prioritize maintaining a natural look consistent with the original subject's lighting where possible." // Adjusted for new background lighting dominance
        }
      },

      "additional_constraints": {
        "body_proportion_accuracy": "Scale the garment accurately to match the person's body proportions.",
        "occlusion_handling": "Render natural and correct occlusion where the garment covers parts of the body, hair, or existing accessories from 'person_image'. Preserve visible unique features (tattoos, scars) unless occluded.",
        "hair_and_accessory_integrity": "Maintain hair and non-clothing accessories (glasses, jewelry, hats) from 'person_image' unless logically occluded by the new garment. Integrate them seamlessly with the person and the new background.",
        "texture_and_detail_rendering": "Render fine details (e.g., embroidery, seams, buttons, lace, sheer fabric properties) from the garment with high fidelity.",
        "scene_coherence": "Ensure the person logically fits within the generated background environment (e.g., appropriate scale, perspective, interaction with ground plane if applicable)." // New constraint for background coherence
      },

      "edge_case_handling": {
        "tight_fitting_clothing": "Accurately depict fabric stretch and conformity to body contours.",
        "transparent_sheer_clothing": "Realistically render transparency, showing underlying skin tone or layers appropriately.",
        "complex_garment_geometry": "Handle unusual shapes, layers, or asymmetrical designs with correct draping.",
        "unusual_poses": "Ensure garment drape remains physically plausible even in non-standard or dynamic poses.",
        "garment_partially_out_of_frame": "Render the visible parts of the garment correctly; do not hallucinate missing sections.",
        "low_resolution_inputs": "Maximize detail preservation but prioritize realistic integration over inventing details not present in the inputs.",
        "mismatched_lighting_inputs": "Prioritize generating a coherent lighting environment based on the **NEW background**, adapting the garment and slightly adjusting the person's apparent lighting for a unified final image. Avoid harsh lighting clashes." // Updated for new background
      },

      "prohibitions": [ // Updated prohibitions
        "DO NOT alter the person's facial features, identity, expression, or skin tone.",
        "DO NOT modify the intrinsic color, pattern, texture, or style of the clothing item.",
        "DO NOT retain ANY part of the original background from 'person_image'.",
        "DO NOT change the person's pose.",
        "DO NOT introduce elements not present in the input images (person, garment) except for the generated background and necessary shadows/lighting adjustments for integration.",
        "DO NOT hallucinate or guess facial details; if obscured, maintain the integrity of visible parts based on identity lock.",
        "DO NOT generate a background that is stylistically jarring or contextually nonsensical without explicit instruction via 'background_preference'."
      ]
    }
  `;

    // --- Convert Files to Base64 ---
    const userImageBuffer = await userImageFile.arrayBuffer();
    const userImageBase64 = arrayBufferToBase64(userImageBuffer);
    const userImageMimeType = userImageFile.type || "image/jpeg"; // Default or derive from file

    const clothingImageBuffer = await clothingImageFile.arrayBuffer();
    const clothingImageBase64 = arrayBufferToBase64(clothingImageBuffer);
    const clothingImageMimeType = clothingImageFile.type || "image/png"; // Default or derive from file

    console.log(
      `User Image: ${userImageMimeType}, size: ${userImageBase64.length}`
    );
    console.log(
      `Clothing Image: ${clothingImageMimeType}, size: ${clothingImageBase64.length}`
    );


    let response;

    try {
      // --- Prepare Contents for Gemini API ---
      // Simplified structure: Prompt + User Image + Clothing Image
      const contents = [
        {
          role: "user",
          parts: [
            { text: optimizedPrompt },
            {
              inlineData: {
                mimeType: userImageMimeType,
                data: userImageBase64,
              },
            },
            {
              inlineData: {
                mimeType: clothingImageMimeType,
                data: clothingImageBase64,
              },
            },
          ],
        },
      ];


      // --- Generate the content ---
      response = await ai.models.generateContent({
        model: MODEL_ID,
        contents: contents, // Use the new contents structure
        // Generation Config - adjust as needed
        config: {
          temperature: 0.6,
          topP: 0.95,
          topK: 40,
          responseModalities: ["Text", "Image"],
          responseSchema: {
            type: "object",
            properties: {
              image: { 
                type: "string", 
                description: "Base64 encoded generated image data" 
              },
              description: { 
                type: "string", 
                description: "Detailed description of the try-on result and how well the clothing fits" 
              },
              confidence: { 
                type: "number", 
                description: "Confidence score between 0 and 1 for the generation quality",
                minimum: 0,
                maximum: 1
              }
            },
            required: ["image", "description"]
          }
        },
      });

      // Add this line to log the full API response for debugging
      console.log("Full Gemini API Response:", JSON.stringify(response, null, 2));

    } catch (error) {
      console.error("Error in Gemini API call (generateContent):", error);
      // Add specific error handling or re-throw as needed
      if (error instanceof Error) {
        throw new Error(`Failed during API call: ${error.message}`);
      }
      throw new Error("An unknown error occurred during the API call");
    }

    let textResponse = null;
    let imageData = null;
    let imageMimeType = "image/png";
    let confidence = 0.8;

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0]?.content?.parts;
      if (parts) {
        console.log("Number of parts in response:", parts.length);

        for (const part of parts) {
          if ("inlineData" in part && part.inlineData) {
            imageData = part.inlineData.data;
            imageMimeType = part.inlineData.mimeType || "image/png";
            if (imageData) {
              console.log(
                "Image data received, length:", imageData.length,
                "MIME type:", imageMimeType
              );
            }
          } else if ("text" in part && part.text) {
            textResponse = part.text;
            console.log(
              "Text response received:",
              textResponse.substring(0, 100) + (textResponse.length > 100 ? "..." : "")
            );
            
            try {
              const structuredResponse = JSON.parse(part.text);
              if (structuredResponse.confidence && typeof structuredResponse.confidence === 'number') {
                confidence = Math.max(0, Math.min(1, structuredResponse.confidence));
              }
              if (structuredResponse.description) {
                textResponse = structuredResponse.description;
              }
            } catch (e) {
              console.log("Response is not structured JSON, using as plain text");
            }
          }
        }
      } else {
        console.log("No parts found in the response candidate.");
      }
    } else {
      console.log("No candidates found in the API response.");
      const safetyFeedback = response?.promptFeedback?.blockReason;
      if (safetyFeedback) {
        console.error("Content generation blocked:", safetyFeedback);
        throw new Error(`Content generation failed due to safety settings: ${safetyFeedback}`);
      }
      const responseText = JSON.stringify(response, null, 2);
      console.error("Unexpected API response structure:", responseText);
      throw new Error("Received an unexpected or empty response from the API.");
    }

    return NextResponse.json({
      image: imageData ? `data:${imageMimeType};base64,${imageData}` : null,
      description: textResponse || "AI description not available.",
      confidence: confidence,
      model: "gemini-2.5-flash-image-preview",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error processing virtual try-on request:", error);
    return NextResponse.json(
      {
        error: "Failed to process virtual try-on request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
