import patientData from '../../data/patients';
import uuid = require('uuid');
import { NonSensitivePatient, NewPatient, Patient } from '../types';

const getPatients = (): Array<NonSensitivePatient> => {
  /*
    TypeScript only checks whether we have all of the required fields or not,
    but excess fields are not prohibited. function getPatients maps the patientData type Patient[]
    to return type NonSensitivePatient[] but must manually remove field ssn
  */
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id, name, dateOfBirth, gender, occupation
  }));
};

const addPatient = (patient: NewPatient): Patient => {

  // https://stackoverflow.com/a/43837860
  const id: string = uuid.v4();

  const newPatient = {
    ...patient,
    id
  };

  patientData.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  addPatient
};