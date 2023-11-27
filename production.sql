BEGIN TRANSACTION;
CREATE TABLE book (
	read_count JSON, 
	bisac VARCHAR NOT NULL, 
	lc VARCHAR NOT NULL, 
	publisher VARCHAR NOT NULL, 
	year INTEGER NOT NULL, 
	book_id INTEGER NOT NULL, 
	authors VARCHAR, 
	title VARCHAR NOT NULL, 
	imprint_publisher VARCHAR NOT NULL, 
	isbn INTEGER, 
	esbn INTEGER NOT NULL, 
	oclc INTEGER, 
	lcc VARCHAR, 
	dewey FLOAT, 
	format VARCHAR NOT NULL, 
	pages INTEGER NOT NULL, 
	PRIMARY KEY (book_id)
);
INSERT INTO "book" VALUES('{}','SOCIAL SCIENCE','Sociology / General','New York University Press',2014,676913,'Cassandra S. Crawford','Phantom Limb : Amputation, Embodiment, and Prosthetic Technology','NYU Press',9780814789285,9780814764824,865578900,'RD553 .C88 2014eb',617.9,'EPUB;PDF',316);
INSERT INTO "book" VALUES('{}','SCIENCE','Applied Sciences','CRC Press (Unlimited)',2016,1081010,'Qin Zhang','Precision Agriculture Technology for Crop Farming','CRC Press',9781482251074,9781482251081,924717252,'S494.5.P73 P742 2015eb',631.0,'EPUB;PDF',382);
INSERT INTO "book" VALUES('{}','LANGUAGE ARTS & DISCIPLINES','Linguistics / General','De Gruyter',2018,1819683,'Aina Urdze','Non-Prototypical Reduplication','De Gruyter Mouton',9783110597004,9783110597134,1037981899,'P245',400.0,'EPUB;PDF',298);
INSERT INTO "book" VALUES('{"2023-11": 1}','MATHEMATICS','General','Princeton University Press',2019,1857555,'Philip Ording','99 Variations on a Proof','Princeton University Press',9780691158839,9780691185422,1077292089,'QA8.4 .O73 2019eb',510.1,'PDF',272);
INSERT INTO "book" VALUES('{}','POLITICAL SCIENCE','World / Middle Eastern','Rowman & Littlefield Publishing',2018,1891782,'Monte Palmer','The Future of the Middle East : Faith, Force, and Finance','Rowman & Littlefield Publishers',9781538117880,9781538117897,1043977259,'DS62.8',956.04,'EPUB;PDF',234);
INSERT INTO "book" VALUES('{}','LANGUAGE ARTS & DISCIPLINES','Communication Studies','Rowman & Littlefield Publishing',2018,1947642,'Mia Moody-Ramirez; Hazel James Cole','Race, Gender, and Image Repair Theory : How Digital Media Change the Landscape','Lexington Books',9781498568616,9781498568623,1065543387,'P94.5.A37',302.231,'EPUB;PDF',251);
INSERT INTO "book" VALUES('{}','LANGUAGE ARTS & DISCIPLINES','Linguistics / General','De Gruyter',2019,2157092,'Alice Vittrant; Justin Watkins','The Mainland Southeast Asia Linguistic Area','De Gruyter Mouton',9783110401769,9783110401981,1104710557,'PL3501 .M33 2018',495.0,'EPUB;PDF',735);
INSERT INTO "book" VALUES('{}','LANGUAGE ARTS & DISCIPLINES','Linguistics / General','De Gruyter',2019,2246475,'Verena Schröter','Null Subjects in Englishes : A Comparison of British English and Asian Englishes','De Gruyter Mouton',9783110633436,9783110645354,1121056326,'PE1072 .S35 2019',420.0,'EPUB;PDF',312);
INSERT INTO "book" VALUES('{}','BUSINESS & ECONOMICS','General','Harvard University Press',2021,2894802,'Richard Pomfret','The Economic Integration of Europe','Harvard University Press',9780674244139,9780674259454,1249693975,'HC241 .P663 2021eb',337.142,'PDF',272);
INSERT INTO "book" VALUES('{}','BUSINESS & ECONOMICS','Advertising & Promotion','Rowman & Littlefield Publishing',2022,3241753,'Jef I. Richards','A History of Advertising : The First 300,000 Years','Rowman & Littlefield Publishers',9781538141212,9781538141229,1264176461,'HF5811',659.1,'EPUB;PDF',465);
CREATE TABLE book_tmp (
	read_count JSON, 
	bisac VARCHAR NOT NULL, 
	lc VARCHAR NOT NULL, 
	publisher VARCHAR NOT NULL, 
	year INTEGER NOT NULL, 
	book_id INTEGER NOT NULL, 
	authors VARCHAR, 
	title VARCHAR NOT NULL, 
	imprint_publisher VARCHAR NOT NULL, 
	isbn INTEGER, 
	esbn INTEGER NOT NULL, 
	oclc INTEGER, 
	lcc VARCHAR, 
	dewey FLOAT, 
	format VARCHAR NOT NULL, 
	pages INTEGER NOT NULL, 
	PRIMARY KEY (book_id)
);
COMMIT;
