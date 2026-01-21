import bcrypt

# Maximum password length before bcrypt truncation (72 bytes)
MAX_PASSWORD_LENGTH = 72

def hash_password(password: str) -> str:
    """Hash a plain text password using native bcrypt."""
    # Bcrypt truncates at 72 bytes - validate length for security
    if len(password.encode('utf-8')) > MAX_PASSWORD_LENGTH:
        raise ValueError(f"Password exceeds maximum length of {MAX_PASSWORD_LENGTH} characters")
    
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a hashed password using native bcrypt."""
    try:
        # Check length before verification
        if len(plain_password.encode('utf-8')) > MAX_PASSWORD_LENGTH:
            return False
        
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False

