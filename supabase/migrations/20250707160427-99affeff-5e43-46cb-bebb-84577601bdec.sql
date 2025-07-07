-- Insert events for today and this week to populate Today's Highlights
INSERT INTO events (title, description, category, date, time, location, image, capacity, is_featured) VALUES
-- Events for today (2025-07-07)
('Morning Yoga & Meditation', 'Start your day with mindful movement and meditation. Suitable for all levels. Session includes complimentary herbal tea and healthy breakfast.', 'event', '2025-07-07', '08:00', 'Rooftop Terrace', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80', 20, true),
('Chef''s Special Lunch', 'Experience our executive chef''s signature three-course lunch menu featuring seasonal ingredients and wine pairing recommendations.', 'event', '2025-07-07', '12:30', 'Main Restaurant', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', 25, true),
('Evening Wine Tasting', 'Join our sommelier for an exclusive wine tasting featuring premium selections from our private cellar, paired with artisanal cheeses.', 'event', '2025-07-07', '19:00', 'Wine Cellar', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80', 18, true),

-- Events for tomorrow (2025-07-08)
('Spa Treatment Workshop', 'Learn relaxation techniques and enjoy mini-treatments. Includes aromatherapy, reflexology demonstration, and wellness consultations.', 'event', '2025-07-08', '14:00', 'Serenity Spa Center', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80', 15, true),

-- Events for day after (2025-07-09)
('Live Jazz Performance', 'Enjoy an intimate evening of live jazz music featuring renowned local musicians, with cocktails and light appetizers.', 'event', '2025-07-09', '20:00', 'Azure Lounge', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80', 45, true),

-- Weekend event (2025-07-12)
('Weekend Brunch Special', 'Indulge in our weekend brunch buffet featuring international cuisine, fresh seafood, and unlimited champagne.', 'event', '2025-07-12', '11:00', 'Grand Dining Hall', 'https://images.unsplash.com/photo-1551218372-a8789b81b253?auto=format&fit=crop&w=800&q=80', 60, true);