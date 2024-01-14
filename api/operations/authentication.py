from typing import Annotated
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from requests import Session
from models.models import AdminUser
from settings import settings
import jwt
import datetime
from database.database import SessionLocal

SECRET_KEY = settings.secret_key
ALGORITHM = settings.hash_algorithm

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str, salt_rounds=12):
    """
    Hashes a password securely using bcrypt.

    :param password: The plaintext password to be hashed.
    :param salt_rounds: The number of salt rounds to use (default is 12).
    :return: The hashed password as a byte string.
    """
    # Generate a salt and hash the password
    salt = bcrypt.gensalt(salt_rounds)
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    return hashed_password.decode('utf-8')


def verify_password(in_password: str, hashed_password: str):
    """
    Verifies a password against its hashed version.

    :param input_password: The plaintext password to be verified.
    :param hashed_password: The previously hashed password to compare against.
    :return: True if the input password matches the hashed password, False otherwise.
    """
    return bcrypt.checkpw(in_password.encode('utf-8'), hashed_password.encode('utf-8'))


def generate_token(user_id: int):
    """
    Generates a JWT token for user authentication.

    :param username: The user's user id.
    :param expiration_minutes: Token expiration time in minutes (default is 30 minutes).
    :return: A JWT token as a string.
    """
    
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=settings.token_life_time)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def verify_token(token: str):
    """
    Verifies a JWT token and returns the user_id if valid.

    :param token: The JWT token to be verified.
    :return: The user_id if the token is valid, None otherwise.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        # Token has expired
        return None
    except jwt.DecodeError:
        # Token is invalid
        return None
    

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    user_id = verify_token(token)

    if user_id == None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(AdminUser).filter(AdminUser.user_id == user_id).first()
    
    return user
    
if __name__ == '__main__':
    print(hash_password("abc"))