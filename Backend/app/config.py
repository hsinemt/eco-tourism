import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Configuration principale de l’application."""

    model_config = SettingsConfigDict(env_file=".env")

    # Endpoints SPARQL Fuseki
    SPARQL_ENDPOINT: str = "http://localhost:3030/Eco-Tourism/sparql"
    SPARQL_UPDATE_ENDPOINT: str = "http://localhost:3030/Eco-Tourism/update"

    # Namespace RDF
    ONTOLOGY_NAMESPACE: str = "http://www.ecotourism.org/ontology#"
    ONTOLOGY_PREFIX: str = "eco"

    # Clé API Google Gemini (depuis ton .env)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "VOTRE_CLE_API_ICI")

    # Variables optionnelles
    AUTO_INIT_DATA: bool = False


settings = Settings()
