from sqlalchemy import create_engine, text

DATABASE_URL = "mysql+pymysql://root:@localhost:3307/liverai_db"
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE scans ADD COLUMN patient_cnic VARCHAR(255) NULL"))
        conn.commit()
        print("Column 'patient_cnic' added successfully to scans table!")
    except Exception as e:
        print(f"Error adding column: {e}")
