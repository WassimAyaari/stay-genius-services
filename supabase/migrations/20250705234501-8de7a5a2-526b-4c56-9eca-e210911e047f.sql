-- Add additional hotel guest service templates
INSERT INTO public.chat_templates (category, title, message, sort_order, is_active) VALUES
('spa_wellness', 'Spa Services', 'Our spa offers a wide range of relaxing treatments including massages, facials, and wellness services. Would you like me to help you book a treatment or check availability?', 1, true),
('spa_wellness', 'Pool & Fitness', 'Our swimming pool is open from 7:00 AM to 10:00 PM, and the fitness center is available 24/7. The spa facilities are located on Level 4. Would you like directions?', 2, true),
('technical_support', 'WiFi Assistance', 'Our WiFi network is "HotelGenius-Guest" and the password is provided in your welcome packet. If you''re having connection issues, I can send our IT team to assist you.', 1, true),
('technical_support', 'TV & Entertainment', 'Your room TV has access to premium channels and streaming services. If you need help with the remote or have any technical issues, I can arrange assistance.', 2, true),
('guest_services', 'Checkout Assistance', 'Checkout time is 12:00 PM. If you need a late checkout or assistance with luggage and transportation, I''m here to help arrange that for you.', 1, true),
('guest_services', 'Local Information', 'I can provide information about local attractions, restaurants, shopping, and transportation options. What would you like to know about the area?', 2, true),
('guest_services', 'Amenities Info', 'Our hotel features a pool, fitness center, spa, business center, and multiple dining options. Would you like information about any specific amenity?', 3, true),
('emergency', 'Medical Assistance', 'For medical emergencies, please dial 9 immediately. For non-emergency medical assistance or pharmacy needs, contact reception and we''ll help coordinate care.', 1, true),
('emergency', 'Security', 'For any security concerns or to report suspicious activity, please contact our security team immediately. Your safety is our top priority.', 2, true);