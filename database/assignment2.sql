-- insert Tony Stark's info into the account table
INSERT INTO public.account (first_name, last_name, email, password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- modify the Stark record to account_type = Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- delete the Stark record
DELETE FROM account
WHERE first_name = 'Tony'
AND account_id = 1;

-- modify the record 
UPDATE inventory
SET description = REPLACE(description, 'a huge interior', 'a small interior')
WHERE inventory_id = 10;

-- select make and model, join classification and inventory, where classification == "Sport"
SELECT make, model, classification_name FROM inventory
INNER JOIN classification
ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- update image paths
UPDATE inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/'), 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/')
WHERE inv_thumbnail NOT LIKE '/images/vehicles/%'
AND inv_image NOT LIKE '/images/vehicles/%';