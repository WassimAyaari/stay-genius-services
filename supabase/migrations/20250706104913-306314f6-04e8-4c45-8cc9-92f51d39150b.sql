-- Update the existing "Muséé" attraction with proper information
UPDATE attractions 
SET 
  name = 'Grand Central Mosque',
  description = 'Historic 16th-century mosque featuring stunning Islamic architecture and peaceful gardens.',
  image = 'https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2834&q=80',
  distance = '800m away',
  opening_hours = 'Open 5 AM - 10 PM'
WHERE name = 'Muséé';

-- Add Royal Opera Theatre attraction
INSERT INTO attractions (name, description, image, distance, opening_hours)
VALUES (
  'Royal Opera Theatre',
  'Elegant 19th-century theatre hosting world-class opera, ballet, and classical performances.',
  'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80',
  '1.1 km away',
  'Box office: 10 AM - 8 PM'
);

-- Add Heritage Stone Bridge attraction
INSERT INTO attractions (name, description, image, distance, opening_hours)
VALUES (
  'Heritage Stone Bridge',
  'Medieval stone bridge with breathtaking waterfall views and historic walking trails.',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=4000&q=80',
  '2.3 km away',
  'Open 24 hours'
);