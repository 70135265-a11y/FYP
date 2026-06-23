from sqlalchemy import text
from database import engine
from models import Base
import models

def init_database():
    """Initialize database with all tables and add missing columns if needed"""
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Add missing columns to users table if they don't exist
    with engine.connect() as conn:
        # Check if phone column exists
        result = conn.execute(text("SHOW COLUMNS FROM users LIKE 'phone'"))
        if not result.fetchone():
            conn.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(20)"))
            print("Added 'phone' column to users table")
        
        # Check if address column exists
        result = conn.execute(text("SHOW COLUMNS FROM users LIKE 'address'"))
        if not result.fetchone():
            conn.execute(text("ALTER TABLE users ADD COLUMN address VARCHAR(255)"))
            print("Added 'address' column to users table")
        
        conn.commit()
    
    print("Database initialization complete!")

if __name__ == "__main__":
    init_database()
