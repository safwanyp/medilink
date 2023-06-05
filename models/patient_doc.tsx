export interface PatientDoc {
    full_name: string;                  // full name of patient
    registered_email: string;           // email of patient
    address: string;                    // address of patient
    personal_id: string;                // Personal ID of patient
    allergies: string[];                // allergies of patient
    past_treatments: string[];          // past treatments of patient
    current_diagnosis: string[];        // current diagnosis of patient
    past_diagnosis: string[];           // past diagnosis of patient
    administered_meds: string[];        // administered medications of patient
    insurance_company: string;          // insurance company of patient
    policy_number: string;              // policy number of patient's issued insurance
    treatment_scopes: string[];         // treatment scopes of patient under insurance
    occupation: string;                 // occupation of patient
    employer_phone: string;             // patient's employer phone number
    employer_email: string;             // patient's employer email
    employer: string;                   // patient's employer
    patient_id: string;                 // patient's userID
    past_access: string[];              // past access requests
    access_request: string[];           // current access requests
}

// export type Access = {
//     doctor_id: string | null;
//     doctor_name: string | null;
//     patient_id: string | null;
//     patient_name: string | null;
//     access_type: string | null;
//     access_date_time: string | null;
// }

export class Access {
    doctor_id!: string | null;
    doctor_name!: string | null;
    patient_id!: string | null;
    patient_name!: string | null;
    access_type!: string | null;
    access_date_time!: string | null;

    constructor(
        doctor_id: string | null,
        doctor_name: string | null,
        patient_id: string | null,
        patient_name: string | null,
        access_type: string | null,
        access_date_time: string | null
    ) {
        this.doctor_id = doctor_id;
        this.doctor_name = doctor_name;
        this.patient_id = patient_id;
        this.patient_name = patient_name;
        this.access_type = access_type;
        this.access_date_time = access_date_time;
    }
}



export class Patient implements PatientDoc {
    full_name!: string;                  // full name of patient
    registered_email!: string;           // email of patient
    address!: string;                    // address of patient
    personal_id!: string;                // Personal ID of patient
    allergies!: string[];                // allergies of patient
    past_treatments!: string[];          // past treatments of patient
    current_diagnosis!: string[];        // current diagnosis of patient
    past_diagnosis!: string[];           // past diagnosis of patient
    administered_meds!: string[];        // administered medications of patient
    insurance_company!: string;          // insurance company of patient
    policy_number!: string;              // policy number of patient's issued insurance
    treatment_scopes!: string[];         // treatment scopes of patient under insurance
    occupation!: string;                 // occupation of patient
    employer_phone!: string;             // patient's employer phone number
    employer_email!: string;             // patient's employer email
    employer!: string;                   // patient's employer
    patient_id!: string;                 // patient's userID
    past_access!: string[];              // past access requests
    access_request!: string[];           // current access requests

    constructor(
        full_name: string,
        registered_email: string,
        address: string,
        personal_id: string,
        allergies: string[],
        past_treatments: string[],
        current_diagnosis: string[],
        past_diagnosis: string[],
        administered_meds: string[],
        insurance_company: string,
        policy_number: string,
        treatment_scopes: string[],
        occupation: string,
        employer_phone: string,
        employer_email: string,
        employer: string,
        patient_id: string,
        past_access: string[],
        access_request: string[]
    ) {
        this.full_name = full_name;
        this.registered_email = registered_email;
        this.address = address;
        this.personal_id = personal_id;
        this.allergies = allergies;
        this.past_treatments = past_treatments;
        this.current_diagnosis = current_diagnosis;
        this.past_diagnosis = past_diagnosis;
        this.administered_meds = administered_meds;
        this.insurance_company = insurance_company;
        this.policy_number = policy_number;
        this.treatment_scopes = treatment_scopes;
        this.occupation = occupation;
        this.employer_phone = employer_phone;
        this.employer_email = employer_email;
        this.employer = employer;
        this.patient_id = patient_id;
        this.past_access = past_access;
        this.access_request = access_request;
    }
}
