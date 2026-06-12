-- 003_pgvector_setup.sql

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to documents
ALTER TABLE documents ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Add embedding column to medical events (for searching through history)
ALTER TABLE medical_events ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create a function to search for relevant context (RAG)
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_pet_id UUID
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  -- Search in documents
  SELECT
    d.id,
    d.title || ' ' || COALESCE(d.category, '') AS content,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM documents d
  WHERE d.pet_id = p_pet_id AND d.embedding IS NOT NULL
    AND 1 - (d.embedding <=> query_embedding) > match_threshold

  UNION ALL

  -- Search in medical events
  SELECT
    m.id,
    m.title || ' ' || COALESCE(m.description, '') || ' ' || m.event_date::text AS content,
    1 - (m.embedding <=> query_embedding) AS similarity
  FROM medical_events m
  WHERE m.pet_id = p_pet_id AND m.embedding IS NOT NULL
    AND 1 - (m.embedding <=> query_embedding) > match_threshold

  ORDER BY similarity DESC
  LIMIT match_count;
$$;
