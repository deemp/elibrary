BEGIN TRANSACTION;
CREATE TABLE "book" (
"index" INTEGER,
  "bisac" TEXT,
  "lc" TEXT,
  "publisher" TEXT,
  "year" INTEGER,
  "book_id" INTEGER,
  "authors" TEXT,
  "title" TEXT,
  "imprint_publisher" TEXT,
  "isbn" INTEGER,
  "esbn" INTEGER,
  "oclc" INTEGER,
  "lcc" TEXT,
  "dewey" REAL,
  "format" TEXT
);
INSERT INTO "book" VALUES(0,'MATHEMATICS','General','Princeton University Press',2019,1857555,'Philip Ording','99 Variations on a Proof','Princeton University Press',9780691158839,9780691185422,1077292089,'QA8.4 .O73 2019eb',510.1,'PDF');
INSERT INTO "book" VALUES(1,'BUSINESS & ECONOMICS','Advertising & Promotion','Rowman & Littlefield Publishing',2022,3241753,'Jef I. Richards','A History of Advertising : The First 300,000 Years','Rowman & Littlefield Publishers',9781538141212,9781538141229,1264176461,'HF5811',659.1,'EPUB;PDF');
INSERT INTO "book" VALUES(2,'LANGUAGE ARTS & DISCIPLINES','Linguistics / General','De Gruyter',2018,1819683,'Aina Urdze','Non-Prototypical Reduplication','De Gruyter Mouton',9783110597004,9783110597134,1037981899,'P245',400.0,'EPUB;PDF');
INSERT INTO "book" VALUES(3,'LANGUAGE ARTS & DISCIPLINES','Linguistics / General','De Gruyter',2019,2246475,'Verena Schröter','Null Subjects in Englishes : A Comparison of British English and Asian Englishes','De Gruyter Mouton',9783110633436,9783110645354,1121056326,'PE1072 .S35 2019',420.0,'EPUB;PDF');
INSERT INTO "book" VALUES(4,'SOCIAL SCIENCE','Sociology / General','New York University Press',2014,676913,'Cassandra S. Crawford','Phantom Limb : Amputation, Embodiment, and Prosthetic Technology','NYU Press',9780814789285,9780814764824,865578900,'RD553 .C88 2014eb',617.9,'EPUB;PDF');
INSERT INTO "book" VALUES(5,'SCIENCE','Applied Sciences','CRC Press (Unlimited)',2016,1081010,'Qin Zhang','Precision Agriculture Technology for Crop Farming','CRC Press',9781482251074,9781482251081,924717252,'S494.5.P73 P742 2015eb',631.0,'EPUB;PDF');
INSERT INTO "book" VALUES(6,'LANGUAGE ARTS & DISCIPLINES','Communication Studies','Rowman & Littlefield Publishing',2018,1947642,'Mia Moody-Ramirez-Hazel James Cole','Race, Gender, and Image Repair Theory : How Digital Media Change the Landscape','Lexington Books',9781498568616,9781498568623,1065543387,'P94.5.A37',302.231,'EPUB;PDF');
INSERT INTO "book" VALUES(7,'BUSINESS & ECONOMICS','General','Harvard University Press',2021,2894802,'Richard Pomfret','The Economic Integration of Europe','Harvard University Press',9780674244139,9780674259454,1249693975,'HC241 .P663 2021eb',337.142,'PDF');
INSERT INTO "book" VALUES(8,'POLITICAL SCIENCE','World / Middle Eastern','Rowman & Littlefield Publishing',2018,1891782,'Monte Palmer','The Future of the Middle East : Faith, Force, and Finance','Rowman & Littlefield Publishers',9781538117880,9781538117897,1043977259,'DS62.8',956.04,'EPUB;PDF');
INSERT INTO "book" VALUES(9,'LANGUAGE ARTS & DISCIPLINES','Linguistics / General','De Gruyter',2019,2157092,'Alice Vittrant-Justin Watkins','The Mainland Southeast Asia Linguistic Area','De Gruyter Mouton',9783110401769,9783110401981,1104710557,'PL3501 .M33 2018',495.0,'EPUB;PDF');
CREATE INDEX "ix_book_index"ON "book" ("index");
COMMIT;
