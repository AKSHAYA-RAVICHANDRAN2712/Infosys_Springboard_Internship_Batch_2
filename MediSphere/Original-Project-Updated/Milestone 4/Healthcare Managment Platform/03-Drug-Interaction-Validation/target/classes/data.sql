insert into medicines(name) values('Aspirin') on conflict (name) do nothing;
insert into medicines(name) values('Warfarin') on conflict (name) do nothing;
insert into medicines(name) values('Ibuprofen') on conflict (name) do nothing;
insert into medicines(name) values('Paracetamol') on conflict (name) do nothing;
insert into drug_interactions(drug1,drug2,severity,description,recommendation) values('Aspirin','Warfarin','HIGH','Potentially increased bleeding risk.','Consult a healthcare professional before combining these medicines.') on conflict do nothing;
insert into drug_interactions(drug1,drug2,severity,description,recommendation) values('Aspirin','Ibuprofen','MODERATE','Concurrent use may increase certain adverse effects.','Use only under appropriate medical advice.') on conflict do nothing;
insert into drug_interactions(drug1,drug2,severity,description,recommendation) values('Warfarin','Ibuprofen','HIGH','Potentially increased bleeding risk.','Consult a healthcare professional before combining these medicines.') on conflict do nothing;
