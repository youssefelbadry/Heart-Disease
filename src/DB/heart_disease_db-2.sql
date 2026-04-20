-- =========================
-- TABLE: patients
-- Description: Stores patient/user basic information
-- =========================
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- TABLE: medical_records
-- Description: Stores clinical/tabular data used for ML prediction
-- Relationship: Many records belong to one patient
-- =========================
CREATE TABLE medical_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,

    age INT,
    gender VARCHAR(10),

    systolic_bp FLOAT,
    diastolic_bp FLOAT,
    blood_pressure VARCHAR(50),
    blood_pressure_category VARCHAR(50),

    estimated_ldl FLOAT,
    total_cholesterol FLOAT,
    hdl FLOAT,

    weight FLOAT,
    height FLOAT,
    bmi FLOAT,

    waist_to_height_ratio FLOAT,
    abdominal_circumference FLOAT,

    physical_activity_level VARCHAR(50),
    family_history_of_cvd BOOLEAN,
    diabetes_status VARCHAR(50),
    smoking_status VARCHAR(50),
    fasting_blood_sugar FLOAT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_medical_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE
);

-- =========================
-- TABLE: echo_videos
-- Description: Stores uploaded echo images/videos for DL analysis
-- Relationship: Many videos belong to one patient
-- =========================
CREATE TABLE echo_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,

    view_angle VARCHAR(50),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    video_format VARCHAR(20),
    file_url TEXT NOT NULL,

    CONSTRAINT fk_echo_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE
);

-- =========================
-- TABLE: model_results
-- Description: Stores AI prediction results (ML + DL outputs)
-- Relationships:
-- - Many results per patient
-- - Many results per medical record
-- - One result per echo video (1:1)
-- =========================
CREATE TABLE model_results (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,
    medical_record_id INT NOT NULL,
    echo_video_id INT UNIQUE,

    cvd_risk_score FLOAT,
    heart_failure_chance FLOAT,
    model_metadata JSON,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_result_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_result_medical_record
        FOREIGN KEY (medical_record_id)
        REFERENCES medical_records(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_result_echo
        FOREIGN KEY (echo_video_id)
        REFERENCES echo_videos(id)
        ON DELETE SET NULL
);
