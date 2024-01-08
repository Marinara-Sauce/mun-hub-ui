from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str = "Example Key"
    hash_algorithm: str = "HS256"
    token_life_time: int = 60
    
settings = Settings()