from PIL import Image
import numpy as np
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
out_file = f"{script_dir}/sprites.h"
f_out = open(out_file, "w")
f_out.write("#ifndef SPRITES_H\n")
f_out.write("#define SPRITES_H\n\n")    
f_out.write("const unsigned char sprites[][8*8*3] = {\n")
for i in range(100):
    filename = f"{script_dir}/{i:02}.png"
    print(filename)
    f_out.write(f"\n\t// Sprite {i}\n")
    with open(filename, "rb") as f:
        # Open the image using PIL
        img = Image.open(f)
        
        # Convert to RGB if not already
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Get the pixel data as a numpy array
        rgb_array = np.array(img)
        
        # Flatten the array to get a 1D array of RGB values
        # Shape will be (height * width * 3,)
        rgb_flat = rgb_array.flatten()
        
        # Convert to binary data (bytes)
        rgb_bytes = rgb_flat.tobytes()
        
        # Now rgb_bytes contains the binary RGB data
        # You can save it or process it further
        print(f"Image size: {img.size}")
        print(f"RGB array shape: {rgb_array.shape}")
        print(f"Flattened length: {len(rgb_flat)}")
        print(f"Binary data length: {len(rgb_bytes)} bytes")

        f_out.write("    {" + ", ".join(hex(b) for b in rgb_bytes) + "}")
        if i < 99:
            f_out.write(",\n")
        else:
            f_out.write("\n")
        
        # Example: save the binary data to a file
        #output_filename = f"{i:02}.bin"
        #with open(output_filename, "wb") as out_f:
        #    out_f.write(rgb_bytes)
        
        #print(f"Saved binary RGB data to {output_filename}")
        #print()
f_out.write("};\n\n")
f_out.write("#endif // SPRITES_H\n")
f_out.close()