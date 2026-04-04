export const mlService = {
  // Simulate image quality check (simulating laplacian variance/blur detection)
  validateImageQuality: async (file: File): Promise<{ isValid: boolean; reason?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock logic: randomly decide if image is "blurry" for demo purposes, 
        // but let's make it deterministic: if file size is artificially small, or just mock 10% chance.
        // Actually, let's look at the filename. If it contains 'blur', reject it.
        const isBlurry = file.name.toLowerCase().includes('blur') || Math.random() < 0.1;
        
        if (isBlurry) {
          resolve({ isValid: false, reason: "Unclear Information Provided: Image appears blurry or dark." });
        } else {
          resolve({ isValid: true });
        }
      }, 1500); // simulate ML processing dealy
    });
  },

  // Simulate automated classification
  classifyIssue: async (title: string, description: string): Promise<{ category: string; confidence: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const text = (title + " " + description).toLowerCase();
        let category = "Others";
        
        if (text.includes("road") || text.includes("pothole") || text.includes("traffic")) category = "Roads";
        else if (text.includes("water") || text.includes("leak") || text.includes("drain")) category = "Water Supply";
        else if (text.includes("light") || text.includes("power") || text.includes("electric")) category = "Electricity";
        else if (text.includes("garbage") || text.includes("trash") || text.includes("clean")) category = "Sanitation";
        
        // Random confidence between 60% and 98%
        const confidence = Math.floor(Math.random() * (98 - 60 + 1) + 60);

        resolve({ category, confidence });
      }, 1000);
    });
  }
};
