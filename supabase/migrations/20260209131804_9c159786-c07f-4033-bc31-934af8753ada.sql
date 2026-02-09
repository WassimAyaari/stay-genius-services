
-- Delete duplicates, keeping the most recent per user_id
DELETE FROM guests
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM guests
  WHERE user_id IS NOT NULL
  ORDER BY user_id, created_at DESC
)
AND user_id IS NOT NULL;

-- Prevent future duplicates
CREATE UNIQUE INDEX idx_guests_user_id_unique 
ON guests (user_id) 
WHERE user_id IS NOT NULL;
