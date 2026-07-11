import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { submitAdmission } from '../services/api';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  studentName: z.string().min(2, 'Student name is required'),
  fatherName: z.string().min(2, 'Father name is required'),
  cnicOrBForm: z.string().min(5, 'CNIC/B-Form is required'),
  classApplying: z.string().min(1, 'Please select a class'),
  contactNumber: z.string().regex(/^[0-9+\-\s]{10,15}$/, 'Enter a valid contact number'),
  email: z.string().email('Enter a valid email'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
});

const classes = ['Play Group', 'Pre-Nursery', 'Nursery', 'KG', 'Grade 1-5', 'Grade 6-8', 'Grade 9-10', 'Grade 11-12'];

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-secondary-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent";

export default function AdmissionPortal() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await submitAdmission(data);
      toast.success("Application submitted successfully! We'll contact you soon.");
      reset();
      setTimeout(() => navigate('/'), 2000);
    } catch {
      toast.error('Submission failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-accent-light pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-secondary-800 mb-2">Apply for Admission</h1>
          <p className="text-secondary-500 text-sm mb-8">Fill in the form below and we'll get back to you shortly.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Student Name *" error={errors.studentName?.message}>
                <input {...register('studentName')} className={inputCls} placeholder="Full name" />
              </Field>
              <Field label="Father Name *" error={errors.fatherName?.message}>
                <input {...register('fatherName')} className={inputCls} placeholder="Father's full name" />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="CNIC / B-Form Number *" error={errors.cnicOrBForm?.message}>
                <input {...register('cnicOrBForm')} className={inputCls} placeholder="e.g. 42101-1234567-1" />
              </Field>
              <Field label="Class Applying For *" error={errors.classApplying?.message}>
                <select {...register('classApplying')} className={inputCls}>
                  <option value="">Select class</option>
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Contact Number *" error={errors.contactNumber?.message}>
                <input {...register('contactNumber')} type="tel" className={inputCls} placeholder="+92 3XX-XXXXXXX" />
              </Field>
              <Field label="Email *" error={errors.email?.message}>
                <input {...register('email')} type="email" className={inputCls} placeholder="email@example.com" />
              </Field>
            </div>

            <Field label="Address *" error={errors.address?.message}>
              <textarea {...register('address')} rows={3} className={inputCls} placeholder="Full residential address" />
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
