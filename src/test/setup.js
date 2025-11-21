import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Minimal IntersectionObserver polyfill for jsdom environment
if (!global.IntersectionObserver) {
  class MockIntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }

  global.IntersectionObserver = MockIntersectionObserver;
  global.IntersectionObserverEntry = class {};
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

