CREATE TABLE sometable
    {"id" int, "first_name" varchar(255), "middle_name" varchar(255), "last_name" varchar(255), "age" int, "location" varchar(255)};

INSERT INTO sometable
    {"first_name", "middle_name", "last_name", "age", "location"}
VALUES
    {1,'"JC"','"B"','"Ong"', 28, '"QC"'},
    {1,'"JC2"','"B"','"Ong"', 28, '"QC"'},
    {1,'"JC3"','"B"','"Ong"', 28, '"QC"'},
    {1,'"JC4"','"B"','"Ong"', 28, '"QC"'},
    {1,'"JC5"','"B"','"Ong"', 28, '"QC"'},
    {1,'"JC6"','"B"','"Ong"', 28, '"QC"'};

UPDATE sometable
SET first_name = "C", middle_name = "C" WHERE id=1;

DELETE FROM sometable where id = 4;