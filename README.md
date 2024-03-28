# Webper

Webper is a versatile image processing tool designed to help you optimize and convert images efficiently for web usage. With Webper, you can resize, compress, and convert images to .webp format, ensuring optimal performance and visual quality for your web projects.

## Mentions
"Webper utilizes the [Sharp](https://www.npmjs.com/package/sharp) library, an API designed for image conversion and resizing. Webper serves as a graphical user interface (GUI) for utilizing the functionality provided by the Sharp library. 
It simplifies the process of converting and resizing images, making it accessible to users without requiring them to interact directly with the library's API."

## Features

- **Image Compression**: Reduce image file sizes without compromising visual quality, making your web pages load faster.
- **Format Conversion**: Convert images from JPEG, PNG, GIF, AVIF to a more websites friedly WebP format.
- **Resize Images**: Adjust the dimensions of images to fit different screen sizes and layouts(The resizing is based on sharp's library strategy - "inside" which preserves aspect ratio of a image to be as large as possible while ensuring its dimensions are less than or equal to both those specified).
- **Easy to Use**: Simple and intuitive user interface, suitable for both beginners and advanced users.

## Installation

To use Webper, simply download the latest version setup from the [releases page](https://github.com/SliskiPlumek/webper/releases).
Then unpack the **Webper.exe** file, open it and proceed with instalations instruction.

## Usage

1. Launch Webper after installation.
2. Add images you want to process using the file picker.
3. Select the dimensions of your image or, if you want to bypass this feature, leave it as is.
4. Click the "Convert" button to start processing the images.
5. Once the processing is complete, the optimized images will be saved to the /webper, which will pop up in explorer after successfull convertion.

## License

Webper is open-source software licensed under the [MIT License](LICENSE).
****
