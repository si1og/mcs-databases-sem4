CREATE TABLE OS (
    id_OS SERIAL PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Version VARCHAR(30) NOT NULL,
    Bitness SMALLINT NOT NULL,
    Release_year SMALLINT NOT NULL
);

CREATE TABLE Workstation (
    id_Workstation SERIAL PRIMARY KEY,
    Inventory_number VARCHAR(20) NOT NULL UNIQUE,
    Processor VARCHAR(80) NOT NULL,
    Memory_size INT NOT NULL,
    Storage_type VARCHAR(30) NOT NULL,
    Graphics_adapter VARCHAR(80) NOT NULL,
    id_OS INT NOT NULL REFERENCES OS(id_OS)
);

CREATE TABLE Publisher (
    id_Publisher SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Country VARCHAR(60) NOT NULL,
    Website TEXT,
    Foundation_year SMALLINT NOT NULL,
    Email VARCHAR(254)
);

CREATE TABLE Category (
    id_Category SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Icon TEXT,
    Font_family_count INT NOT NULL DEFAULT 0
);

CREATE TABLE Font_family (
    id_Font_family SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Year_created SMALLINT,
    Description TEXT,
    Typeface_count SMALLINT NOT NULL DEFAULT 0,
    id_Publisher INT NOT NULL REFERENCES Publisher(id_Publisher),
    id_Category INT NOT NULL REFERENCES Category(id_Category)
);

CREATE TABLE License (
    id_License SERIAL PRIMARY KEY,
    Type VARCHAR(30) NOT NULL,
    Expiration_date DATE,
    Max_stations SMALLINT,
    Cost DECIMAL(10,2) NOT NULL,
    Purchase_date DATE NOT NULL,
    id_Publisher INT NOT NULL REFERENCES Publisher(id_Publisher),
    id_Font_family INT NOT NULL REFERENCES Font_family(id_Font_family)
);

CREATE TABLE Format (
    id_Format SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Extension VARCHAR(10) NOT NULL,
    Year_released SMALLINT,
    Description TEXT,
    Web_support BOOLEAN NOT NULL
);

CREATE TABLE Typeface (
    id_Typeface SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Weight VARCHAR(30) NOT NULL,
    Slope VARCHAR(30) NOT NULL,
    File_size INT NOT NULL,
    id_Font_family INT NOT NULL REFERENCES Font_family(id_Font_family),
    id_Format INT NOT NULL REFERENCES Format(id_Format)
);

CREATE TABLE Language (
    id_Language SERIAL PRIMARY KEY,
    Name VARCHAR(60) NOT NULL,
    ISO_code CHAR(3) NOT NULL UNIQUE,
    Writing_direction VARCHAR(30) NOT NULL,
    Script_type VARCHAR(30) NOT NULL
);

CREATE TABLE Alphabet (
    id_Alphabet SERIAL PRIMARY KEY,
    Typeface_count_in_system INT NOT NULL DEFAULT 0,
    Supported_family_count INT NOT NULL DEFAULT 0,
    Verification_date DATE,
    Status VARCHAR(30) NOT NULL,
    id_Typeface INT NOT NULL REFERENCES Typeface(id_Typeface),
    id_Language INT NOT NULL REFERENCES Language(id_Language)
);

CREATE TABLE Installation (
    id_Installation SERIAL PRIMARY KEY,
    Installation_date DATE NOT NULL,
    Removal_date DATE,
    File_path TEXT NOT NULL,
    Status VARCHAR(30) NOT NULL,
    Last_used_date DATE,
    id_Typeface INT NOT NULL REFERENCES Typeface(id_Typeface),
    id_Workstation INT NOT NULL REFERENCES Workstation(id_Workstation)
);
