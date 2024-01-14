from dotenv import load_dotenv
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str = "Example Key"
    hash_algorithm: str = "HS256"
    token_life_time: int = 60
    super_user_username: str = "super"
    super_user_password: str = "changeme"

load_dotenv()
    
settings = Settings()