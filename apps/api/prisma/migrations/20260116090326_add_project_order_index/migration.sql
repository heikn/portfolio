-- Add as nullable first so we can backfill existing rows.
ALTER TABLE "projects" ADD COLUMN "order_index" INTEGER;

-- Backfill existing projects with a stable sequential order (oldest first).
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS rn
  FROM projects
)
UPDATE projects
SET order_index = ordered.rn
FROM ordered
WHERE projects.id = ordered.id;

-- Now enforce NOT NULL.
ALTER TABLE "projects" ALTER COLUMN "order_index" SET NOT NULL;

-- Prevent duplicates.
CREATE UNIQUE INDEX "projects_order_index_key" ON "projects"("order_index");
