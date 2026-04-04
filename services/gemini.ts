
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Using gemini-3-pro-preview for complex coding tasks and large context handling.
const GEMINI_MODEL = 'gemini-3-pro-preview';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert AI Engineer and Product Designer specializing in "bringing artifacts to life".
Your goal is to take user uploaded files—which might be polished UI designs, messy napkin sketches, photos of whiteboards, or **Classroom PDFs**—and instantly generate a fully functional, interactive, single-page HTML/JS/CSS application.

CORE DIRECTIVES:
1. **Analyze & Abstract**: Look at the image(s)/document(s) with EXTREME ATTENTION TO DETAIL.
    - **CONTENT PRIORITY**: The EDUCATIONAL CONTENT (questions, vocabulary, text) MUST come from the uploaded file. The user's prompt primarily defines the THEME/STYLE.
    - **CONFLICT RESOLUTION**: If the PDF is about "Ancient Rome" and the User Prompt is "Space Theme", you must generate a Space-themed app about Ancient Rome.
    - **Classroom/Education (PDFs/Worksheets)**:
        - **Goal**: Create a comprehensive **Interactive Review Platform** for students.
        - **Dynamic Title**: Extract the student or class name from the filename.
        - **Volume of Content**: Do NOT summarize. Use ALL content provided.
    - **Sketches/Wireframes**: Detect buttons, inputs, and layout. Turn them into a modern, clean UI.

2. **NO EXTERNAL IMAGES**:
    - **CRITICAL**: Do NOT use <img src="..."> with external URLs. Use **CSS shapes**, **inline SVGs**, **Emojis**, or **CSS gradients**.

3. **Make it Interactive**: The output MUST NOT be static. It needs buttons, sliders, drag-and-drop, or dynamic visualizations.
   - **AUDIO REQUIREMENT**: Whenever generating audio or using \`speechSynthesis\`, you MUST ALWAYS force the language to \`en-US\` (e.g., \`msg.lang = 'en-US'\`). This applies to every sound of every part.
4. **Self-Contained**: The output must be a single HTML file with embedded CSS (<style>) and JavaScript (<script>). Tailwind via CDN is allowed.
5. **Robust & Creative**: Build something fun and functional.

RESPONSE FORMAT:
Return ONLY the raw HTML code. Do not wrap it in markdown code blocks. Start immediately with <!DOCTYPE html>.`;

export async function bringToLife(prompt: string, files?: { mimeType: string; data: string }[], iosMode: boolean = false, starMode: boolean = false, deepMode: boolean = false, referenceHtml?: string): Promise<string> {
  const parts: any[] = [];
  
  const fileCount = files ? files.length : 0;
  
  const userInstruction = prompt ? `\n\nUSER VISUAL/THEME REQUEST: "${prompt}"\n\n**CRITICAL INSTRUCTION**: The user has requested a specific style/theme. Apply this theme to the VISUALS. Content must be derived from the files.` : "";

  const referenceInstruction = referenceHtml ? `\n\n**REFERENCE WEBSITE PROVIDED**: The user wants to use a previously created website as a reference/inspiration. Analyze its structure, features, and style, and incorporate them into the new creation where appropriate.\n\n\`\`\`html\n${referenceHtml}\n\`\`\`\n\n` : "";

  const iosInstruction = iosMode ? `
  **CRITICAL iOS IPHONE OPTIMIZATION ENABLED**:
  1. Audio Context Unlock: Add an initial "Start App" overlay button.
  2. Viewport Fix: Use height: 100dvh.
  3. Meta Tags for PWA/Mobile compatibility.
  4. Ensure 44px touch targets.
  ` : "";

  const starModeInstruction = starMode ? `
  **STYLE OVERRIDE: ANIME / HIGH-ENERGY GAMIFICATION**
  Use Bangers/Fredoka fonts, Neon palette (#FF0055, #00E5FF), Glassmorphism, and persistent XP/Streak logic in localStorage.
  ` : "";

  const deepModeInstruction = deepMode ? `
  **ACTIVATING DEEP THINKING & SELF-CORRECTION PROTOCOL (THOROUGH MODE)**:
  1. **FULL PDF ANALYSIS**: Read every single word of the input files. Do not skip details. Extract ALL content.
  2. **ARCHITECTURAL SELF-CHECK**: Before generating code, mentally verify that the Study Mode, Flashcard Mode, Quiz, Reading, and Extra modes are fully interconnected. ensure NO interface parts are missing.
  3. **FLASHCARD OVERHAUL (CRITICAL)**: 
     - The Flashcard mode must be a **DEDICATED FULL-SCREEN INTERFACE** (not just a small section). 
     - It MUST include **FRONT** (Term) and **BACK** (Definition + Example).
     - **Pronunciation Audio**: Every card MUST have a working audio button using \`speechSynthesis\`.
  4. **STRICT QUIZ RULES**: The quiz must be smart and varied (Multiple Choice, True/False, Fill-in-blank).
  5. **READING COMPREHENSION**: EXACTLY 5 questions. No more, no less.
  6. **THE "EXTRA" MODULE**: You MUST generate a list of **NEW, RELATED VOCABULARY** that was *not* in the uploaded text but is highly relevant to the topic. Present this creatively (e.g., "Bonus Level" or "Advanced Lexicon").
  7. **QUALITY ASSURANCE**: Ensure all buttons work. Ensure styles are perfect.
  ` : "";

  // Strong directive for file-only inputs with emphasis on NO external images and Education support
  const finalPrompt = (files && files.length > 0)
    ? `Analyze the ${fileCount} uploaded file(s) DEEPLY.
       
       ${userInstruction}
       ${referenceInstruction}
       ${iosInstruction}
       ${starModeInstruction}
       ${deepModeInstruction}

       **Scenario: EDUCATIONAL CONTENT (English/History/Science Class)**
       Build a **6-MODE INTERACTIVE DASHBOARD**:

       1. 📖 **Study Mode**: Interactive presentation of the content with high-quality typography.
       2. ⚡ **Flashcard Mode**: 
          - **Aesthetic**: Modern, clean, and tactile. Use soft shadows, smooth transitions, and a refined color palette.
          - **Interaction (MANDATORY)**:
            - **Click to Flip**: Flashcards MUST be clickable to flip between the FRONT (Question/Word) and BACK (Answer/Definition).
            - **3D Animation**: Use CSS \`backface-visibility: hidden\` and \`transform-style: preserve-3d\` for a realistic 3D flip effect.
            - **Keyboard Shortcuts**: Allow Arrow keys to navigate and Space to flip.
          - **Audio**: Add a "🔊" button to hear the text using Speech Synthesis. You MUST force the language to \`en-US\` (\`msg.lang = 'en-US'\`).

       3. 📝 **Quiz Mode**: Scored quiz with randomized option order and immediate feedback.
       
       4. 🎮 **Game Mode (2-STAGE)**: 
          - Stage 1: Memory Match (16-card grid). Fix mirrored text on flip using \`rotateY(180deg)\` on back face.
          - Stage 2: Context Sentence Scramble (unlocks after Stage 1).

       5. 📚 **Reading Practice**: 
          - Adaptive Story: Short for beginners, 300+ words for advanced.
          - Interactive Text: Clicking key terms opens a modal with definitions.
          - **AUDIO CONTROLS (STRICTLY REQUIRED)**: 
             - You MUST implement a robust audio player with [▶ Play] AND [⏹ Stop/Pause] buttons.
             - **Logic**: 
                - On Play: \`window.speechSynthesis.cancel()\` (clear queue) -> create SpeechSynthesisUtterance -> set \`lang = 'en-US'\` -> \`window.speechSynthesis.speak(...)\`.
                - On Stop: \`window.speechSynthesis.cancel()\`.
                - Visual Feedback: Highlight the active button.
          - Comprehension: 5 multiple-choice questions.

       6. ✨ **Extra Mode**: Generative tool specific to the topic (e.g. Timeline for History, Lab Report for Science).

       **Visual & Engagement Requirements**:
       - **Navigation**: ALWAYS VISIBLE fixed menu (\`position: fixed; top: 0\`) with opaque background.
       - **Dark Mode Support**: Use Tailwind zinc/slate colors for a professional look.
       - NO external images. Use SVGs/Emojis.` 
    : `${prompt || "Create a demo app that shows off your capabilities."}\n${referenceInstruction}`;

  parts.push({ text: finalPrompt });

  if (files) {
    files.forEach(file => {
        parts.push({
          inlineData: {
            data: file.data,
            mimeType: file.mimeType,
          },
        });
    });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
        // When Deep Mode is on, we use the Thinking feature to allow the model to "think twice" and self-correct.
        ...(deepMode ? { thinkingConfig: { thinkingBudget: 8192 } } : {})
      },
    });

    let text = response.text || "<!-- Failed to generate content -->";
    text = text.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');
    return text;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}

export async function updateCode(currentHtml: string, userInstruction: string): Promise<string> {
  const parts = [
    { text: `You are a Principal Software Architect refining an existing single-page HTML application.
    
    CURRENT HTML CODE:
    ${currentHtml}

    USER REQUEST FOR CHANGES:
    ${userInstruction}

    CORE DIRECTIVES:
    1. **Preserve Integrity**: Do NOT break existing features. If the user asks for a new feature, add it without deleting old ones.
    2. **External Assets**: NO new external images. Use SVGs or CSS.
    3. **Robustness**: If adding interactivity (like audio or games), double-check the logic for edge cases (e.g., overlapping audio, state clearing).
    4. **Output**: Return ONLY the fully updated, raw HTML code. No markdown.

    SPECIFIC FIX FOR AUDIO (If relevant):
    - Always ensure \`window.speechSynthesis.cancel()\` is called before starting new audio or when stopping.
    - ALWAYS force the language to \`en-US\` (\`msg.lang = 'en-US'\`) for every single audio/speech synthesis part.
    - Ensure buttons give visual feedback.` }
  ];

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts },
      config: {
        // Use a slightly lower temperature for updates to ensure stability
        temperature: 0.3
      }
    });

    let text = response.text || currentHtml;
    text = text.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');
    return text;
  } catch (error) {
    console.error("Gemini Update Error:", error);
    throw error;
  }
}
