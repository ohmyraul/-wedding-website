# Cookie Chase Game - Redesign Prompt

## CURRENT GAME MECHANICS

**Game Type:** Flappy Bird-style vertical lane switcher

**Current Implementation:**
- Player (Cookie the dog) is positioned at the CENTER of the screen horizontally (50% from left)
- Player can only move UP and DOWN between 4 horizontal lanes
- Obstacles and food items spawn from the RIGHT side of the screen
- Obstacles/food move from RIGHT to LEFT across the screen
- Player stays in the center, items move horizontally past them
- Collision detection: when an obstacle/food item reaches the player's lane and horizontal position
- Controls: Up/Down arrow keys or W/S keys (mobile: up/down buttons)
- Score system: collect food items (points), avoid obstacles (game over)
- Visual: Beach background with animated ground, palm trees, lanes are horizontal rows

**Issues:**
- Player is centered, making it feel static
- Not feeling like a "chase" or racing game
- Movement feels limited and not engaging

---

## DESIRED GAME MECHANICS

**Game Type:** Classic 2D Top-Down Racing Game (like old arcade racing games)

**Desired Implementation:**
- Player (Cookie the dog) should be positioned on the LEFT side of the screen (e.g., 10-15% from left edge)
- Player stays fixed horizontally on the left side
- Player can move UP and DOWN to switch between lanes (3-4 lanes)
- Road/racetrack perspective: items come from AHEAD (top of screen) and move TOWARD the player (top to bottom)
- Visual perspective: Like you're driving forward on a road, with obstacles coming at you
- Obstacles and food items spawn at the TOP of the screen
- Items move from TOP to BOTTOM (toward the player)
- Player dodges obstacles and collects food items as they approach
- Creates the feeling of moving forward/chasing through a Goan beach/road
- Controls: Up/Down arrow keys or W/S keys (mobile: up/down buttons)
- Score system: collect food items (points), avoid obstacles (game over)
- Visual: Road/beach path perspective with lanes, items approaching from ahead

**Key Differences:**
1. Player position: LEFT side (not center)
2. Item movement: TOP to BOTTOM (not right to left)
3. Perspective: Forward-moving racing game (not side-scrolling)
4. Feel: Classic arcade racing game where you're driving forward

---

## TECHNICAL REQUIREMENTS

**Framework:** React component using:
- React hooks (useState, useRef, useEffect, useCallback)
- Framer Motion for animations
- Tailwind CSS for styling
- Existing dialogue system and score tracking should be preserved
- Same food items, obstacles, and dialogue system
- Same high score localStorage functionality
- Mobile-friendly touch controls

**Visual Style:**
- Maintain the current Goan beach/wedding theme
- Sketchy-border styling (organic, hand-drawn feel)
- Warm color palette: #D88D66 (peach), #3B2F2A (navy), #FDF9F4 (canvas)
- Cookie the dog image: `/images/cookie.png` (fallback: `/images/cookie.jpg`)

**Game Loop:**
- Items spawn at top of screen
- Items move down toward player
- Collision when item reaches player's lane and vertical position
- Score increases when food collected
- Game over when obstacle hit
- Speed increases with level/score

---

## EXAMPLE GAMES FOR REFERENCE

Think of games like:
- Classic arcade racing games (Top Gear, Out Run style)
- Endless runner games but from top-down perspective
- Temple Run but vertical scrolling with player on left
- Subway Surfers but with player fixed on left side

The key is: **Player stays on left, items come from top, you move up/down to dodge/collect**

