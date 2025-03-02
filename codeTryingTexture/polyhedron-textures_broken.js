// polyhedron-textures.js
// Defines textures for the polyhedron for each section

const PolyhedronTextures = {
  // Initialize textures - will be loaded on demand
  textures: {},
  
  // Method to load all texture definitions
  initialize: function(THREE) {
    // Create a texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Function to create a canvas texture
    function createCanvasTexture(renderer, width, height) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      
      return { 
        canvas: canvas, 
        context: context,
        getTexture: function() {
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          return texture;
        }
      };
    }
    
    // Function to apply a basic noise pattern
    function applyNoise(context, width, height, intensity, color1, color2) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const value = Math.random() * intensity;
          const r = Math.floor(color1[0] + (color2[0] - color1[0]) * value);
          const g = Math.floor(color1[1] + (color2[1] - color1[1]) * value);
          const b = Math.floor(color1[2] + (color2[2] - color1[2]) * value);
          context.fillStyle = `rgb(${r}, ${g}, ${b})`;
          context.fillRect(x, y, 1, 1);
        }
      }
    }
    
    // Function to create gradients
    function applyGradient(context, width, height, colors, isRadial = false) {
      let gradient;
      
      if (isRadial) {
        gradient = context.createRadialGradient(
          width/2, height/2, 0,
          width/2, height/2, width/2
        );
      } else {
        gradient = context.createLinearGradient(0, 0, width, height);
      }
      
      colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color);
      });
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    }
    
    // Function to add rays
    function addRays(context, width, height, centerX, centerY, count, color) {
      context.save();
      context.translate(centerX, centerY);
      context.fillStyle = color;
      
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        context.rotate(angle);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width * 0.1, -width * 0.02);
        context.lineTo(width, 0);
        context.lineTo(width * 0.1, width * 0.02);
        context.closePath();
        context.globalAlpha = 0.4;
        context.fill();
        context.rotate(-angle);
      }
      
      context.restore();
    }
    
    // Create textures for each section
    
    // Section 1 - Unknown (Static Noise)
    const unknownTexture = createCanvasTexture(renderer, 512, 512);
    applyNoise(unknownTexture.context, 512, 512, 0.5, [20, 20, 20], [80, 80, 80]);
    this.textures[1] = {
      map: unknownTexture.getTexture(),
      material: new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.8,
        metalness: 0.2,
        emissive: 0x111111,
        emissiveIntensity: 0.2,
        side: THREE.DoubleSide, // Ensure texture is visible from both sides
        depthWrite: true,
        flatShading: false, 
        wireframe: false
      })
    };
    
    // Section 2 - Ashes (Embers and Ash)
    const ashesTexture = createCanvasTexture(renderer, 512, 512);
    applyGradient(ashesTexture.context, 512, 512, ['#330000', '#550000', '#220000']);
    
    // Add ember spots
    const emberCount = 50;
    for (let i = 0; i < emberCount; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = 2 + Math.random() * 5;
      const glow = ashesTexture.context.createRadialGradient(x, y, 0, x, y, size * 2);
      glow.addColorStop(0, 'rgba(255, 150, 0, 0.8)');
      glow.addColorStop(0.5, 'rgba(255, 50, 0, 0.3)');
      glow.addColorStop(1, 'rgba(100, 0, 0, 0)');
      
      ashesTexture.context.fillStyle = glow;
      ashesTexture.context.beginPath();
      ashesTexture.context.arc(x, y, size * 2, 0, Math.PI * 2);
      ashesTexture.context.fill();
    }
    
    // Add ash particles
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = 1 + Math.random() * 2;
      ashesTexture.context.fillStyle = `rgba(200, 200, 200, ${Math.random() * 0.2})`;
      ashesTexture.context.fillRect(x, y, size, size);
    }
    
    this.textures[2] = {
      map: ashesTexture.getTexture(),
      material: new THREE.MeshStandardMaterial({
        color: 0xff4500,
        roughness: 0.7,
        metalness: 0.3,
        emissive: 0x441100,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide,
        depthWrite: true,
        flatShading: false, 
        wireframe: false
      })
    };
    
    // Section 3 - Shadow (Dark and Smoky)
    const shadowTexture = createCanvasTexture(renderer, 512, 512);
    applyGradient(shadowTexture.context, 512, 512, ['#000000', '#222222', '#111111', '#000000'], true);
    
    // Add smoke-like swirls
    for (let i = 0; i < 5; i++) {
      const centerX = Math.random() * 512;
      const centerY = Math.random() * 512;
      const radius = 50 + Math.random() * 100;
      
      for (let j = 0; j < 10; j++) {
        const angle = j / 10 * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const glow = shadowTexture.context.createRadialGradient(x, y, 0, x, y, 30);
        glow.addColorStop(0, 'rgba(50, 50, 50, 0.2)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        shadowTexture.context.fillStyle = glow;
        shadowTexture.context.beginPath();
        shadowTexture.context.arc(x, y, 30, 0, Math.PI * 2);
        shadowTexture.context.fill();
      }
    }
    
    this.textures[3] = {
      map: shadowTexture.getTexture(),
      material: new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.9,
        metalness: 0.1,
        emissive: 0x000000,
        emissiveIntensity: 0.1,
        side: THREE.DoubleSide,
        depthWrite: true,
        flatShading: false, 
        wireframe: false
      })
    };
    
    // Section 4 - Fire & Blood (Lava)
    const fireTexture = createCanvasTexture(renderer, 512, 512);
    applyGradient(fireTexture.context, 512, 512, ['#ff0000', '#ff3300', '#ff6600', '#cc0000']);
    
    // Add lava flow patterns
    for (let i = 0; i < 20; i++) {
      const x1 = Math.random() * 512;
      const y1 = Math.random() * 512;
      const x2 = x1 + (Math.random() - 0.5) * 300;
      const y2 = y1 + (Math.random() - 0.5) * 300;
      
      const gradient = fireTexture.context.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, 'rgba(255, 200, 0, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.6)');
      gradient.addColorStop(1, 'rgba(180, 0, 0, 0.3)');
      
      fireTexture.context.strokeStyle = gradient;
      fireTexture.context.lineWidth = 5 + Math.random() * 15;
      fireTexture.context.beginPath();
      fireTexture.context.moveTo(x1, y1);
      
      // Create a curvy line
      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 100;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 100;
      fireTexture.context.quadraticCurveTo(midX, midY, x2, y2);
      fireTexture.context.stroke();
    }
    
    this.textures[4] = {
      map: fireTexture.getTexture(),
      material: new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.5,
        metalness: 0.5,
        emissive: 0xff2200,
        emissiveIntensity: 0.6,
        side: THREE.DoubleSide,
        depthWrite: true,
        flatShading: false, 
        wireframe: false
      })
    };
    
    // Section 5 - Void (Cosmic/Nebula)
    const voidTexture = createCanvasTexture(renderer, 512, 512);
    applyGradient(voidTexture.context, 512, 512, ['#000000', '#110022', '#000000'], true);
    
    // Add nebula swirls
    for (let i = 0; i < 3; i++) {
      const centerX = Math.random() * 512;
      const centerY = Math.random() * 512;
      const radius = 100 + Math.random() * 150;
      
      for (let j = 0; j < 15; j++) {
        const angle = j / 15 * Math.PI * 2;
        const distance = radius * (0.8 + Math.random() * 0.4);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        const size = 30 + Math.random() * 50;
        
        const glow = voidTexture.context.createRadialGradient(x, y, 0, x, y, size);
        glow.addColorStop(0, 'rgba(180, 50, 255, 0.3)');
        glow.addColorStop(0.5, 'rgba(100, 0, 150, 0.2)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        voidTexture.context.fillStyle = glow;
        voidTexture.context.beginPath();
        voidTexture.context.arc(x, y, size, 0, Math.PI * 2);
        voidTexture.context.fill();
      }
    }
    
    // Add stars
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 2;
      const brightness = 0.5 + Math.random() * 0.5;
      
      voidTexture.context.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      voidTexture.context.beginPath();
      voidTexture.context.arc(x, y, size, 0, Math.PI * 2);
      voidTexture.context.fill();
    }
    
    this.textures[5] = {
      map: voidTexture.getTexture(),
      material: new THREE.MeshStandardMaterial({
        color: 0x330066,
        roughness: 0.6,
        metalness: 0.4,
        emissive: 0x220033,
        emissiveIntensity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: true,
        flatShading: false, 
        wireframe: false
      })
    };
    
    // Section 6 - Lion Roar (Regal Gold)
    const lionTexture = createCanvasTexture(renderer, 512, 512);
    applyGradient(lionTexture.context, 512, 512, ['#aa8800', '#ffd700', '#aa7700']);
    
    // Add mane-like patterns
    const centerX = 256;
    const centerY = 256;
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const length = 100 + Math.random() * 100;
      
      const x1 = centerX + Math.cos(angle) * 50;
      const y1 = centerY + Math.sin(angle) * 50;
      const x2 = centerX + Math.cos(angle) * (50 + length);
      const y2 = centerY + Math.sin(angle) * (50 + length);
      
      const gradient = lionTexture.context.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.7)');
      gradient.addColorStop(1, 'rgba(205, 133, 0, 0.2)');
      
      lionTexture.context.strokeStyle = gradient;
      lionTexture.context.lineWidth = 5 + Math.random() * 10;
      lionTexture.context.beginPath();
      lionTexture.context.moveTo(x1, y1);
      lionTexture.context.lineTo(x2, y2);
      lionTexture.context.stroke();
    }
    
    // Add royal blue accents
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 180;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const size = 20;
      
      lionTexture.context.fillStyle = 'rgba(0, 0, 128, 0.5)';
      lionTexture.context.beginPath();
      lionTexture.context.arc(x, y, size, 0, Math.PI * 2);
      lionTexture.context.fill();
    }
    
    this.textures[6] = {
      map: lionTexture.getTexture(),
      material: new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.3,
        metalness: 0.8,
        emissive: 0xaa7700,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: true,
        flatShading: false, 
        wireframe: false
      })
    };
    
    // Section 7 - Abyss (Deep Ocean)
    const abyssTexture = createCanvasTexture(renderer, 512, 512);
    applyGradient(abyssTexture.context, 512, 512, ['#000000', '#000022', '#000033', '#000011']);
    
    // Add pressure gradients
    for (let i = 0; i < 10; i++) {
      const y = i * 51.2;
      const gradient = abyssTexture.context.createLinearGradient(0, y, 512, y);
      gradient.addColorStop(0, `rgba(0, 0, 30, ${Math.random() * 0.3})`);
      gradient.addColorStop(0.5, `rgba(0, 10, 50, ${Math.random() * 0.3})`);
      gradient.addColorStop(1, `rgba(0, 0, 30, ${Math.random() * 0.3})`);
      
      abyssTexture.context.fillStyle = gradient;
      abyssTexture.context.fillRect(0, y, 512, 51.2);
    }
    
    // Add some deep sea particles
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = 1 + Math.random() * 2;
      abyssTexture.context.fillStyle = `rgba(200, 200, 255, ${Math.random() * 0.1})`;
      abyssTexture.context.beginPath();
      abyssTexture.context.arc(x, y, size, 0, Math.PI * 2);
      abyssTexture.context.fill();
    }
    
    this.textures[7] = {
      map: abyssTexture.getTexture(),
      material: new THREE.MeshStandardMaterial({
        color: 0x000033,
        roughness: 0.9,
        metalness: 0.1,
        emissive: 0x000011,
        emissiveIntensity: 0.2,
        side: THREE.DoubleSide,
        depthWrite: true,
        flatShading: false, 
        wireframe: false
      })
    };
    
    // Section 8 - Wilderness (Forest/Nature)
    const wildernessTexture = createCanvasTexture(renderer, 512, 512);
    applyGradient(wildernessTexture.context, 512, 512, ['#553300', '#554400', '#443300']);
    
    // Add bark-like texture
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const width = 5 + Math.random() * 20;
      const height = 20 + Math.random() * 100;
      const color = Math.floor(40 + Math.random() * 30);
      
      wildernessTexture.context.fillStyle = `rgb(${color + 40}, ${color}, ${color - 20})`;
      wildernessTexture.context.fillRect(x, y, width, height);
    }
    
    // Add leaf patterns
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = 5 + Math.random() * 15;
      const colorVariation = Math.floor(Math.random() * 40);
      
      wildernessTexture.context.fillStyle = `rgba(${30 + colorVariation}, ${100 + colorVariation}, ${30}, 0.3)`;
      wildernessTexture.context.beginPath();
      wildernessTexture.context.ellipse(x, y, size, size/2, Math.random() * Math.PI, 0, Math.PI * 2);
      wildernessTexture.context.fill();
    }
    
    this.textures[8] = {
      map: wildernessTexture.getTexture(),
      material: new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.85,
        metalness: 0.1,
        emissive: 0x221100,
        emissiveIntensity: 0.1,
        side: THREE.DoubleSide,
        depthWrite: true,
        flatShading: false, 
        wireframe: false
      })
    };
    
    // Section 9 - Dawn (Sunrise)
    const dawnTexture = createCanvasTexture(renderer, 512, 512);
    applyGradient(dawnTexture.context, 512, 512, ['#001f3f', '#0033aa', '#3a6ea5', '#ff8c00', '#ffcc00']);
    
    // Add sun rays
    addRays(dawnTexture.context, 512, 512, 256, 440, 12, 'rgba(255, 204, 0, 0.6)');
    
    // Add some clouds
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 512;
      const y = 100 + Math.random() * 200;
      const width = 50 + Math.random() * 100;
      const height = 20 + Math.random() * 30;
      
      dawnTexture.context.fillStyle = 'rgba(255, 255, 255, 0.2)';
      dawnTexture.context.beginPath();
      dawnTexture.context.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
      dawnTexture.context.fill();
    }
    
    this.textures[9] = {
      map: dawnTexture.getTexture(),
      material: new THREE.MeshStandardMaterial({
        color: 0x3a6ea5,
        roughness: 0.6,
        metalness: 0.3,
        emissive: 0xff8c00,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: true,
        flatShading: false, 
        wireframe: false
      })
    };
    
    // Section 10 - In Your Arms (Soft Warmth)
    const armsTexture = createCanvasTexture(renderer, 512, 512);
    applyGradient(armsTexture.context, 512, 512, ['#ffe6f2', '#ffcccc', '#fff0e6', '#ffebcc'], true);
    
    // Add soft, fuzzy texture
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = 20 + Math.random() * 30;
      
      const glow = armsTexture.context.createRadialGradient(x, y, 0, x, y, size);
      glow.addColorStop(0, 'rgba(255, 255, 200, 0.2)');
      glow.addColorStop(1, 'rgba(255, 200, 230, 0)');
      
      armsTexture.context.fillStyle = glow;
      armsTexture.context.beginPath();
      armsTexture.context.arc(x, y, size, 0, Math.PI * 2);
      armsTexture.context.fill();
    }
    
    // Add heart shapes
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = 5 + Math.random() * 10;
      
      armsTexture.context.fillStyle = `rgba(255, 180, 180, ${0.1 + Math.random() * 0.2})`;
      armsTexture.context.beginPath();
      // Heart shape
      armsTexture.context.moveTo(x, y + size / 4);
      armsTexture.context.bezierCurveTo(
        x, y, 
        x - size, y, 
        x - size, y - size
      );
      armsTexture.context.bezierCurveTo(
        x - size, y - 2 * size, 
        x, y - 2 * size, 
        x, y - size
      );
      armsTexture.context.bezierCurveTo(
        x, y - 2 * size, 
        x + size, y - 2 * size, 
        x + size, y - size
      );
      armsTexture.context.bezierCurveTo(
        x + size, y, 
        x, y, 
        x, y + size / 4
      );
      armsTexture.context.fill();
    }
    
    this.textures[10] = {
      map: armsTexture.getTexture(),
      material: new THREE.MeshStandardMaterial({
        color: 0xffc0cb,
        roughness: 0.3,
        metalness: 0.1,
        emissive: 0xffb6c1,
        emissiveIntensity: 0.2,
        side: THREE.DoubleSide,
        depthWrite: true,
        flatShading: false, 
        wireframe: false
      })
    };
  },
  
  // Method to get a texture for a specific section
  getTexture: function(section) {
    // Convert section 10 to index 10
    const sectionIndex = section === 10 ? 10 : section;
    return this.textures[sectionIndex] || null;
  }
};

// Export the textures object
window.PolyhedronTextures = PolyhedronTextures;
