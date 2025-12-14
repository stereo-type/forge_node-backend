-- Initial database setup
-- This script runs automatically when the container is first created

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set default search configuration to Russian
ALTER DATABASE forge_node SET default_text_search_config = 'pg_catalog.russian';

