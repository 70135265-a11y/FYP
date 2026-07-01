from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    try:
        # Add reset_token column
        conn.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL"))
        print("Column 'reset_token' added successfully to users table!")
    except Exception as e:
        if "Duplicate column name" in str(e):
            print("Column 'reset_token' already exists.")
        else:
            print(f"Error adding reset_token column: {e}")
    
    try:
        # Add reset_token_expiration column
        conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_expiration DATETIME NULL"))
        print("Column 'reset_token_expiration' added successfully to users table!")
    except Exception as e:
        if "Duplicate column name" in str(e):
            print("Column 'reset_token_expiration' already exists.")
        else:
            print(f"Error adding reset_token_expiration column: {e}")
    
    conn.commit()
    print("\nMigration completed successfully!")
