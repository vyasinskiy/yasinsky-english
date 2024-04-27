
# Create tables
```
CREATE TABLE languages.en
(
    name VARCHAR(100) PRIMARY KEY,
    example VARCHAR(500)
);

CREATE TABLE languages.es
(
    name VARCHAR(100) PRIMARY KEY,
    example VARCHAR(500),
	en_name VARCHAR(100),
    FOREIGN KEY (en_name) REFERENCES languages.en (name) ON DELETE SET NULL
);
```
It's important to firstly define the column (line 3), and then to add FOREIGN KEY for this column (line 4). Otherwise, it will cause an error of column absence.

ON DELETE SET NULL allows us to miss FOREIGN KEY until it will appear in the laguages.en table and will be set in dependent tables.

# OR Add to existing tables COLUMN with the same type to become FOREIGN KEY. Then add CONSTRAINT.
```
ALTER TABLE languages.es ADD COLUMN en_name VARCHAR(100);
ALTER TABLE languages.es ADD CONSTRAINT fk_en_es FOREIGN KEY (en_name) REFERENCES languages.en (name);
```

# If you will try to add VALUES with the FK which doesn't exist in "languages.en" TABLE, it will cause an error:
```
INSERT INTO languages.es VALUES (
	'es',
	'es context',
	'some not existing en key'
);
```
Ключ (en_name)=(some not existing key) отсутствует в таблице "en".INSERT или UPDATE в таблице "es" нарушает ограничение внешнего ключа "fk_en_es"