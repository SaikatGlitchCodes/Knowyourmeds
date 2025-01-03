import * as Yup from 'yup';

export const medicineValidationSchema = Yup.object().shape({
  medicine: Yup.string().required('Medicine name is required'),
  form: Yup.string().required('Medicine form is required'),
  dose_in_mg: Yup.string().required('Dose is required'),
  quantity: Yup.string().required('Quantity is required'),
  frequency: Yup.array().min(1, 'At least one schedule time is required'),
  treatment_start_date: Yup.string().required('Start date is required'),
  treatment_end_date: Yup.string().required('End date is required'),
  prescription_refills: Yup.number().required('Refills is required'),
  special_instructions: Yup.string()
});