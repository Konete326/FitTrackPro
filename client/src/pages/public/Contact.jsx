import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import PublicLayout from '../../layouts/PublicLayout';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { submitFeedback } from '../../services/feedbackService';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email'),
  message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
});

function Contact() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: { name: user?.Profile?.Name || '', email: user?.Email || '', message: '' },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (user) {
        await submitFeedback(data.message);
      }
      toast.success('Your message has been sent! We will get back to you soon.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tighter mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Have a question or feedback? We'd love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-2">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-xs p-6 md:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Name" {...register('name')} error={errors.name?.message} placeholder="Your name" />
                    <Input label="Email" type="email" {...register('email')} error={errors.email?.message} placeholder="your@email.com" />
                  </div>
                  <Textarea label="Message" {...register('message')} error={errors.message?.message} placeholder="Tell us what's on your mind..." rows={5} maxLength={1000} />
                  <Button type="submit" loading={submitting} className="w-full">Send Message</Button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { icon: <FiMail className="w-5 h-5" />, title: 'Email', value: 'sameerdevexpert@gmail.com' },
                { icon: <FiPhone className="w-5 h-5" />, title: 'Phone', value: '0321-3265524' },
                { icon: <FiMapPin className="w-5 h-5" />, title: 'Location', value: 'Nazimabad, Gole Market, Street 7, Karachi' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-xs p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-violet-500/10 text-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export default Contact;
