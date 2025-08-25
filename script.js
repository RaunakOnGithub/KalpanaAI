document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".prompt-form");
  const promptInput = document.querySelector("#prompt-input");
  const gallery = document.querySelector(".gallery-grid");
  const generateBtn = document.querySelector(".generate-btn");
  const randomBtn = document.querySelector(".prompt-btn");
  const imageCountSelect = document.querySelector("#image-count");
  const aspectRatioSelect = document.querySelector("#aspect-ratio");

  // Random Prompts
  const randomPrompts = [
    "A futuristic cyberpunk city at night, neon lights glowing, rainy streets, ultra-realistic 4K render",
    "A majestic lion sitting on a mountain cliff at sunset, cinematic 4K ultra-detailed",
    "An astronaut floating inside a crystal cave on Mars, glowing crystals, 8K ultra-HD",
    "A magical forest with glowing mushrooms and fairies, fantasy concept art, 4K quality",
    "A luxury sports car racing through a futuristic tunnel with neon lights, cinematic 4K",
    "A Japanese samurai standing under cherry blossom trees in spring, 4K ultra-realistic",
    "A cozy cabin in snowy mountains at night, warm lights inside, photorealistic 4K"
  ];

  randomBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const randomIndex = Math.floor(Math.random() * randomPrompts.length);
    promptInput.value = randomPrompts[randomIndex];
  });

  // Loading Indicator
  const showLoadingIndicator = (count) => {
    gallery.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const loadingCard = document.createElement("div");
      loadingCard.className =
        "flex flex-col items-center justify-center rounded-2xl border border-gray-700 bg-gray-800/60 p-6 shadow-lg animate-pulse";
      loadingCard.innerHTML = `
        <div class="w-12 h-12 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
        <p class="text-gray-400 text-sm">Generating...</p>
      `;
      gallery.appendChild(loadingCard);
    }
  };

  // Error Display
  const displayError = (message) => {
    gallery.innerHTML = `
      <div class="col-span-full bg-red-900/40 text-red-300 border border-red-700 rounded-xl p-4 text-center font-medium">
        ❌ ${message}
      </div>`;
  };

  // Render Images
  const renderImages = (images) => {
    gallery.innerHTML = "";
    images.forEach((url, idx) => {
      const imgCard = document.createElement("div");
      imgCard.className =
        "relative rounded-2xl overflow-hidden border border-gray-700 bg-gray-800/60 shadow-lg hover:scale-[1.02] transition";
      
      const img = document.createElement("img");
      img.src = url;
      img.alt = `Generated Image ${idx + 1}`;
      img.className = "w-full h-full object-cover";

      const overlay = document.createElement("div");
      overlay.className =
        "absolute bottom-0 left-0 w-full p-3 flex justify-end bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition";

      const downloadBtn = document.createElement("a");
      downloadBtn.href = url;
      downloadBtn.download = `ai-image-${Date.now()}-${idx + 1}.png`;
      downloadBtn.className =
        "h-11 w-11 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition";
      downloadBtn.innerHTML = `<i class="fa-solid fa-download"></i>`;

      overlay.appendChild(downloadBtn);
      imgCard.appendChild(img);
      imgCard.appendChild(overlay);
      gallery.appendChild(imgCard);
    });
  };

  // Convert aspect ratio (1/1 → 1:1)
  const slashToColon = (val = "1/1") => val.replace("/", ":");

  // Submit Handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const prompt = promptInput.value.trim();
    if (!prompt) {
      displayError("Please enter a prompt.");
      return;
    }

    const imageCount = parseInt(imageCountSelect.value, 10);
    const uiAspect = aspectRatioSelect.value;
    const aspect_ratio = slashToColon(uiAspect);
    const seedBase = Math.floor(Math.random() * 100000);

    generateBtn.disabled = true;
    generateBtn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i>&nbsp;Generating...';
    showLoadingIndicator(imageCount);

    try {
      const urls = [];
      for (let i = 0; i < imageCount; i++) {
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("style", "realistic");
        formData.append("aspect_ratio", aspect_ratio);
        formData.append("seed", String(seedBase + i));

        const response = await fetch(
          " ", //api-key endpoint here
          {
            method: "POST",
            headers: {
              Authorization:
                " "  //your api-key here
            },
            body: formData
          }
        );

        if (!response.ok) {
          const errText = await response.text().catch(() => "");
          throw new Error(errText || "Vyro API error");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        urls.push(imgUrl);
      }
      renderImages(urls);
    } catch (err) {
      console.error("API Call Failed:", err);
      displayError(err.message || "Failed to generate images.");
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML =
        '<i class="fa-solid fa-wand-magic-sparkles"></i>&nbsp;Generate';
    }
  });
});



 