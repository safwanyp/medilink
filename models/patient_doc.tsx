import { Models } from "appwrite";

export interface PatientDoc extends Models.Document {
    full_name: string;                  // full name of patient
    registered_email: string;           // email of patient
    address: string;                    // address of patient
    personal_id: string;                // Personal ID of patient
    allergies: string[];                // allergies of patient
    past_treatments: string[];          // past treatments of patient
    current_diagnosis: string[];        // current diagnosis of patient
    past_diagnosis: string[];           // past diagnosis of patient
    administered_meds: string[];        // administered medications of patient
    insruance_company: string;          // insurance company of patient
    policy_number: string;              // policy number of patient's issued insurance
    treatment_scopes: string[];         // treatment scopes of patient under insurance
    occupation: string;                 // occupation of patient
    employer_phone: string;             // patient's employer phone number
    employer_email: string;             // patient's employer email
    employer: string;                   // patient's employer
    patient_id: string;                 // patient's userID
    past_access: Access;                // past access requests
    access_request: Access;             // current access requests

}

export type Access = {
    doctor_id: string;
    doctor_name: string;
    patient_id: string;
    patient_name: string;
    access_type: string;
    access_date_time: string;
}
