# Arthouse Font Installation

## Required Font Files

Place the following Arthouse font files in this directory:

### Light (300)
- `Arthouse-Light.woff2`
- `Arthouse-Light.woff`

### Regular (400)
- `Arthouse-Regular.woff2`
- `Arthouse-Regular.woff`

### Bold (700)
- `Arthouse-Bold.woff2`
- `Arthouse-Bold.woff`

## Font Formats

- **WOFF2**: Modern format, best compression, supported by all modern browsers
- **WOFF**: Fallback for older browsers

## Usage in CSS

The fonts are already configured in `/assets/css/fonts.css` and will be used automatically throughout the site via CSS variables:

```css
--font-heading: 'Arthouse', 'Arial Black', sans-serif;
--font-body: 'Arthouse', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

## Font Weights

- **Light (300)**: `font-weight: 300` or `font-weight: var(--font-light)`
- **Regular (400)**: `font-weight: 400` or `font-weight: var(--font-normal)`
- **Bold (700)**: `font-weight: 700` or `font-weight: var(--font-bold)`

## Converting Fonts

If you only have TTF/OTF files, convert them to WOFF2/WOFF using:
- https://cloudconvert.com/ttf-to-woff2
- https://transfonter.org/

## License

Make sure you have the proper license to use Arthouse font on the web.
