/**
 * Emoji Rendering Test Component
 * 
 * This component tests if all compatibility module emoji render correctly.
 * Use this to verify emoji support in your browser.
 */

import React from 'react';

export function EmojiTest() {
  const emojiTests = [
    { emoji: '🔥', name: 'Fire', code: 'U+1F525' },
    { emoji: '💨', name: 'Air/Wind', code: 'U+1F4A8' },
    { emoji: '💧', name: 'Water', code: 'U+1F4A7' },
    { emoji: '🌍', name: 'Earth', code: 'U+1F30D' },
    { emoji: '🌙', name: 'Moon', code: 'U+1F319' },
    { emoji: '🌊', name: 'Ocean Wave', code: 'U+1F30A' },
    { emoji: '⭐', name: 'Star', code: 'U+2B50' },
    { emoji: '🤝', name: 'Handshake', code: 'U+1F91D' },
    { emoji: '✨', name: 'Sparkles', code: 'U+2728' },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Emoji Rendering Test</h2>
      <p className="mb-6 text-gray-600">
        If you see colored emoji below, your browser supports emoji rendering correctly.
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        {emojiTests.map(({ emoji, name, code }) => (
          <div 
            key={code}
            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="text-4xl w-16 text-center">{emoji}</div>
            <div className="flex-1">
              <div className="font-semibold">{name}</div>
              <div className="text-sm text-gray-500">{code}</div>
            </div>
            <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {emoji}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold mb-2">Test String:</h3>
        <div className="text-lg">
          🌙 Spiritual Destiny | 🌊 Elemental Temperament | ⭐ Planetary Cosmic | 🤝 Daily Interaction
        </div>
      </div>

      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h3 className="font-bold mb-2">Element Test:</h3>
        <div className="text-lg">
          🔥 Fire + 💨 Air = Creative Energy | 💧 Water + 🌍 Earth = Nurturing Growth
        </div>
      </div>
    </div>
  );
}
