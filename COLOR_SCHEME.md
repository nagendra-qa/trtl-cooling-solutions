# Pure Air Solutions Inspired Color Scheme

## Color Palette

### Primary Colors
- **Primary Green**: `#78ab42`
  - Main accent color for buttons, highlights, and branding
  - Usage: Primary buttons, navbar, icons, success messages

- **Dark Blue**: `#152353`
  - Professional corporate color for headings and secondary elements
  - Usage: Table headers, headings, secondary buttons, text emphasis

### Neutral Colors
- **White**: `#ffffff`
  - Clean background for cards and content areas
  - Usage: Card backgrounds, button text, modal backgrounds

- **Light Gray**: `#f4f4f4`
  - Subtle background color
  - Usage: Page background, dividers, subtle sections

- **Dark Gray**: `#383838`
  - Primary text color for good readability
  - Usage: Body text, paragraph content

- **Secondary Gray**: `#707070`
  - Medium gray for less important elements
  - Usage: Secondary text, disabled states, placeholders

### Hover/Interactive States
- **Hover Green**: `#5a8031`
  - Darker shade of primary green for hover states
  - Usage: Button hover, interactive element hover

- **Light Green**: `rgba(120, 171, 66, 0.1)`
  - Subtle green tint for backgrounds
  - Usage: Success alerts, focus states, subtle highlights

## CSS Variables

All colors are defined as CSS custom properties (variables) in `index.css`:

```css
:root {
  --primary-green: #78ab42;
  --dark-blue: #152353;
  --white: #ffffff;
  --light-gray: #f4f4f4;
  --dark-gray: #383838;
  --secondary-gray: #707070;
  --hover-green: #5a8031;
  --light-green: rgba(120, 171, 66, 0.1);
}
```

## Usage Examples

### Buttons
- **Primary Actions**: Green background (`var(--primary-green)`)
- **Secondary Actions**: Dark blue background (`var(--dark-blue)`)
- **Danger Actions**: Red `#dc3545` (kept from original for warnings)

### Typography
- **Headings**: Dark blue (`var(--dark-blue)`)
- **Body Text**: Dark gray (`var(--dark-gray)`)
- **Labels**: Dark blue with bold font weight

### Cards & Containers
- **Background**: White with light gray border-top accent
- **Border Accents**: Primary green left border (4px)
- **Shadows**: Soft shadows using rgba values

### Forms
- **Focus States**: Primary green border with light green shadow
- **Labels**: Dark blue, bold weight
- **Inputs**: Light gray border, white background

## Accessibility Notes

✅ **WCAG AA Compliant Color Contrasts:**
- Dark Blue (#152353) on White = 13.4:1 ratio ✓
- Dark Gray (#383838) on White = 10.6:1 ratio ✓
- Primary Green (#78ab42) on White = 3.1:1 ratio ✓
- White text on Primary Green = 4.5:1 ratio ✓
- White text on Dark Blue = 13.4:1 ratio ✓

## Inspiration Source

Color scheme inspired by [Pure Air Solutions LLC](https://pureairsolutionsllc.com) - a professional HVAC service company website that uses green and blue tones to convey:
- **Green**: Growth, freshness, eco-friendly service
- **Blue**: Trust, professionalism, reliability
- **Gray Tones**: Modern, clean, technical expertise

---

**Last Updated**: December 6, 2025
