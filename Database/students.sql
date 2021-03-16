CREATE TABLE students
    ("id" int, "first_name" varchar(255), "middle_name" varchar(255), "last_name" varchar(255), "age" int, "location" varchar(255));

INSERT INTO students
    ("id","first_name", "middle_name", "last_name", "age", "location")
VALUES
    (1,'"JC"','"B"','"Ong"', 28, '"QC"'),
    (2,'"JC2"','"B"','"Ong"', 21, '"Manila"'),
    (3,'"JC3"','"B"','"Ong"', 18, '"Taguig"'),
    (4,'"JC4"','"B"','"Ong"', 26, '"Cavite"'),
    (5,'"JC5"','"B"','"Ong"', 25, '"Manila"'),
    (6,'"JC6"','"B"','"Ong"', 17, '"QC"');

UPDATE students
SET first_name = "C", middle_name = "C" WHERE id=1;

DELETE FROM students where id = 4;


--Display count
SELECT COUNT("id") FROM students;
--Display students with location is manila
SELECT * FROM students WHERE "location"='"Manila"';
--display average age
SELECT AVG("age") FROM students;
--display students by age in descending order
SELECT * FROM students ORDER BY "age" DESC;