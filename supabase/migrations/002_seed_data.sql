-- 002_seed_data.sql

-- Insert default user for Adarsh
INSERT INTO users (id, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'adarsh@example.com')
ON CONFLICT DO NOTHING;

-- Insert Pixie
INSERT INTO pets (id, user_id, name, breed, sex, dob, coat_color, eye_color, nose_color, distinguishing_marks)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  '00000000-0000-0000-0000-000000000001', 
  'Pixie', 
  'English Golden Retriever', 
  'Female', 
  '2026-04-10', 
  'White Cream', 
  'Black', 
  'Black', 
  'Three whiskers near nose on both sides'
) ON CONFLICT DO NOTHING;

-- Insert Owner
INSERT INTO owners (user_id, pet_id, name, role)
VALUES 
('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Adarsh Kumar Tiwari', 'Primary'),
(NULL, '11111111-1111-1111-1111-111111111111', 'Upasana Shil', 'Secondary Caregiver');

-- Insert Contacts (Emergency, Breeder, Vets)
INSERT INTO contacts (id, pet_id, type, name, phone, email, notes)
VALUES 
('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Emergency', 'Adarsh Kumar Tiwari', '9131620063', NULL, 'Primary Emergency Contact'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Emergency', 'Upasana Shil', '8484846980', NULL, 'Secondary Emergency Contact'),
('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'Breeder', 'Sooraj Furry Tails', '9886061208', NULL, 'Purchased From: Waggles Up Pet Store and Spa'),
('22222222-2222-2222-2222-222222222224', '11111111-1111-1111-1111-111111111111', 'Veterinarian', 'Dr Yatish Gowda', NULL, NULL, 'Leela Pet Clinic HSR Layout'),
('22222222-2222-2222-2222-222222222225', '11111111-1111-1111-1111-111111111111', 'Veterinarian', 'Dr Anushka Upadhyay', NULL, NULL, 'Remote Consultation');

-- Insert Breeders
INSERT INTO breeders (contact_id, purchase_date, purchased_from)
VALUES ('22222222-2222-2222-2222-222222222223', '2026-05-26', 'Waggles Up Pet Store and Spa');

-- Insert Veterinarians
INSERT INTO veterinarians (contact_id, registration_number, role)
VALUES 
('22222222-2222-2222-2222-222222222224', 'KVC 5647', 'Primary'),
('22222222-2222-2222-2222-222222222225', NULL, 'Secondary');

-- Insert Medical Events
INSERT INTO medical_events (pet_id, event_date, type, title, description, status)
VALUES 
('11111111-1111-1111-1111-111111111111', '2026-06-12', 'Injury', 'Left eye swelling after play injury', 'Left eye swelling observed. Current medication: Digyton Plus.', 'Improving naturally');

-- Insert Vaccinations
INSERT INTO vaccinations (pet_id, vaccine_name, administered_date, next_due_date, status)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Nobivac DHPPI', '2026-06-04', '2026-06-25', 'Completed'),
('11111111-1111-1111-1111-111111111111', 'Nobivac L4', '2026-06-04', NULL, 'Completed');

-- Insert Deworming
INSERT INTO deworming_records (pet_id, administered_date, next_due_date, status)
VALUES 
('11111111-1111-1111-1111-111111111111', '2026-05-26', '2026-06-25', 'Completed');

-- Insert Medications
INSERT INTO medications (pet_id, medication_name, start_date, status, instructions)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Digyton Plus', '2026-06-12', 'Active', 'For left eye swelling');

-- Insert Initial Growth Record
INSERT INTO growth_records (pet_id, record_date, weight_kg)
VALUES 
('11111111-1111-1111-1111-111111111111', '2026-06-12', 4.5); -- Example weight

-- Insert Reminders
INSERT INTO reminders (pet_id, title, due_date, category, status)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Deworming', '2026-06-25', 'Deworming', 'Upcoming'),
('11111111-1111-1111-1111-111111111111', 'Vaccination Booster', '2026-06-25', 'Vaccination', 'Upcoming');
