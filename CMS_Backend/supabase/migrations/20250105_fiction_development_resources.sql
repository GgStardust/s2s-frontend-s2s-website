-- Fiction Development Resources Schema
-- Character profiles, locations, Orb personalities, wildlife notes

-- Character Profiles Table
CREATE TABLE IF NOT EXISTS character_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  arc TEXT,
  orb_associations INTEGER[],
  personality_traits TEXT[],
  appearance_notes TEXT,
  backstory TEXT,
  development_status VARCHAR(50) DEFAULT 'in_development' CHECK (development_status IN ('concept', 'in_development', 'established')),
  character_type VARCHAR(50) CHECK (character_type IN ('protagonist', 'guide', 'supporting', 'minor', 'wildlife')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Character Appearances (which chapters/scenes)
CREATE TABLE IF NOT EXISTS character_appearances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES character_profiles(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  role_in_chapter TEXT,
  significance VARCHAR(50) CHECK (significance IN ('major', 'minor', 'mentioned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(character_id, chapter_id)
);

-- Sausalito Locations Table
CREATE TABLE IF NOT EXISTS sausalito_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  location_type VARCHAR(100) CHECK (location_type IN ('boardwalk', 'bar', 'cafe', 'houseboat', 'trail', 'landmark', 'microclimate', 'other')),
  description TEXT,
  field_properties TEXT,
  orb_associations INTEGER[],
  authenticity_notes TEXT,
  atmospheric_details TEXT,
  chapter_appearances UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orb Personalities Table
CREATE TABLE IF NOT EXISTS orb_personalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orb_number INTEGER NOT NULL UNIQUE CHECK (orb_number >= 1 AND orb_number <= 13),
  orb_name VARCHAR(255) NOT NULL,
  archetype VARCHAR(255),
  core_traits TEXT[],
  communication_style TEXT[],
  authority_domains TEXT[],
  dialogue_patterns TEXT,
  manifestation_examples TEXT,
  fiction_integration_notes TEXT,
  dashboard_integration_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wildlife Observations Table
CREATE TABLE IF NOT EXISTS wildlife_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species VARCHAR(255) NOT NULL,
  observation_type VARCHAR(100) CHECK (observation_type IN ('behavior', 'pattern', 'interaction', 'field_response', 'transmission')),
  description TEXT NOT NULL,
  location_id UUID REFERENCES sausalito_locations(id) ON DELETE SET NULL,
  orb_associations INTEGER[],
  field_activation_notes TEXT,
  chapter_integration UUID[],
  symbolic_function TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_character_profiles_type ON character_profiles(character_type);
CREATE INDEX IF NOT EXISTS idx_character_profiles_status ON character_profiles(development_status);
CREATE INDEX IF NOT EXISTS idx_character_appearances_character ON character_appearances(character_id);
CREATE INDEX IF NOT EXISTS idx_character_appearances_chapter ON character_appearances(chapter_id);
CREATE INDEX IF NOT EXISTS idx_sausalito_locations_type ON sausalito_locations(location_type);
CREATE INDEX IF NOT EXISTS idx_orb_personalities_number ON orb_personalities(orb_number);
CREATE INDEX IF NOT EXISTS idx_wildlife_observations_species ON wildlife_observations(species);

-- Updated_at triggers
DROP TRIGGER IF EXISTS update_character_profiles_updated_at ON character_profiles;
CREATE TRIGGER update_character_profiles_updated_at
  BEFORE UPDATE ON character_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sausalito_locations_updated_at ON sausalito_locations;
CREATE TRIGGER update_sausalito_locations_updated_at
  BEFORE UPDATE ON sausalito_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orb_personalities_updated_at ON orb_personalities;
CREATE TRIGGER update_orb_personalities_updated_at
  BEFORE UPDATE ON orb_personalities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_wildlife_observations_updated_at ON wildlife_observations;
CREATE TRIGGER update_wildlife_observations_updated_at
  BEFORE UPDATE ON wildlife_observations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
