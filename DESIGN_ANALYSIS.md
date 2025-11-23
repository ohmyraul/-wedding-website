# Design Analysis & Redesign Plan

## Current Issues Identified

### Visual Issues
1. **Inconsistent spacing**: Mixed padding/margin values across sections (py-12, py-16, py-20, etc.)
2. **Type hierarchy**: Multiple heading sizes without clear scale (text-2xl, text-3xl, text-4xl, text-5xl, text-6xl)
3. **Color system**: Colors used inconsistently, some hardcoded hex values instead of CSS variables
4. **Visual density**: Some sections feel cramped, others too sparse
5. **Alignment**: Inconsistent use of max-width containers and centering

### UX Issues
1. **Information order**: Story section comes after RSVP, which breaks the logical flow
2. **Mobile experience**: Some text too small on mobile, touch targets could be larger
3. **RSVP flow**: Form could be clearer with better visual feedback
4. **Scanability**: Long paragraphs without clear breaks, hard to scan quickly
5. **Navigation**: Dot nav only visible on xl screens, mobile users miss section overview

### Technical Issues
1. **Single file**: 4600+ lines in one file makes maintenance difficult
2. **Semantic HTML**: Some sections use divs instead of semantic elements
3. **Accessibility**: Missing ARIA labels in some places, focus states inconsistent
4. **Performance**: Large inline styles object, could be optimized
5. **Component reusability**: Many similar patterns not extracted into reusable components

## Redesign Strategy

### Visual Improvements
- **Consistent spacing scale**: Use Tailwind spacing scale consistently (4, 8, 12, 16, 24, 32)
- **Type scale**: Establish clear hierarchy (h1: 4xl/5xl, h2: 3xl/4xl, h3: 2xl/3xl, body: base/lg)
- **Color system**: Use CSS variables consistently, create a proper color palette
- **White space**: More breathing room between sections, consistent section padding
- **Visual rhythm**: Consistent use of dividers, spacing, and visual breaks

### UX Improvements
- **Clear narrative flow**: Hero → Story → Events → Travel/Stay → RSVP → Footer
- **Mobile-first**: Design for mobile, enhance for larger screens
- **Better form UX**: Clear labels, better error states, success feedback
- **Improved scanability**: Shorter paragraphs, better use of lists and visual breaks
- **Progressive disclosure**: Show key info first, details on demand

### Technical Improvements
- **Modular components**: Split into logical component files
- **Semantic HTML**: Use proper HTML5 semantic elements
- **Accessibility**: ARIA labels, proper heading hierarchy, focus states
- **Performance**: Optimize images, reduce unused CSS, lazy load where appropriate
- **Code quality**: Clean, maintainable, well-commented code

## Component Structure

```
src/
  components/
    shared/
      - FadeInWhenVisible.jsx
      - ParallaxWrapper.jsx
      - SignboardHeading.jsx
      - Postcard.jsx
      - SectionDivider.jsx
      - Nav.jsx
      - DotNav.jsx
      - CountdownTimer.jsx
      - MusicPlayer.jsx
      - FloatingRSVPButton.jsx
    sections/
      - Hero.jsx
      - StorySection.jsx
      - EventsSection.jsx
      - TravelStaySection.jsx
      - RsvpSection.jsx
      - DressCodeSection.jsx
      - ExploreGoaSection.jsx
      - QnASection.jsx
      - Footer.jsx
    - CookieChaseGame.jsx (existing)
```


