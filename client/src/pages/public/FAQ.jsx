import React, { useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import Card from '../../components/common/Card';
import { FiChevronDown, FiChevronUp, FiSearch, FiMessageCircle, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on "Get Started Free" or "Create Account" button. Fill in your username, email, password, and full name. You can also upload a profile picture. Once registered, you\'ll be redirected to your dashboard.'
        },
        {
          q: 'What information do I need to provide during registration?',
          a: 'You need to provide a username (3-30 characters), a valid email address, a password (minimum 8 characters), and your full name. Profile picture and other details are optional.'
        },
        {
          q: 'Can I use FitTrack Pro on my mobile device?',
          a: 'Yes! FitTrack Pro is fully responsive and works on all devices — desktop, tablet, and mobile browsers.'
        }
      ]
    },
    {
      title: 'Workouts & Training',
      questions: [
        {
          q: 'How do I log a workout?',
          a: 'Navigate to the Workouts section from your dashboard. Click "Add Workout", select the type, enter exercises with sets, reps, and weight, then save. You can also add notes for future reference.'
        },
        {
          q: 'Can I create custom workout routines?',
          a: 'Yes! You can create custom workout templates with your preferred exercises, sets, and reps. These templates can be reused for quick logging.'
        },
        {
          q: 'How does the trainer integration work?',
          a: 'You can connect with a certified trainer who can assign workouts, set goals, and monitor your progress. Trainers can also provide feedback and adjust your training plans.'
        }
      ]
    },
    {
      title: 'Nutrition & Hydration',
      questions: [
        {
          q: 'How do I track my meals?',
          a: 'Go to the Nutrition section and click "Add Meal". You can log breakfast, lunch, dinner, and snacks with calorie and macro information.'
        },
        {
          q: 'How does water tracking work?',
          a: 'Use the quick-add buttons in the Hydration section to log water intake throughout the day. You can set a daily water goal in your preferences.'
        },
        {
          q: 'Can I set calorie goals?',
          a: 'Yes, you can set daily calorie and macro goals in the Goals section. The system will track your progress and show visual indicators.'
        }
      ]
    },
    {
      title: 'Progress & Analytics',
      questions: [
        {
          q: 'How do I track my progress?',
          a: 'Use the Progress section to log weight, body measurements, and take progress photos. The analytics dashboard shows trends over time with charts.'
        },
        {
          q: 'What metrics can I track?',
          a: 'You can track weight, body measurements (chest, waist, hips, arms, thighs), body fat percentage, workout stats, and progress photos.'
        },
        {
          q: 'How are streaks calculated?',
          a: 'Streaks are calculated based on consecutive days of logging workouts or meeting your daily goals. Your current and longest streaks are displayed on your dashboard.'
        }
      ]
    },
    {
      title: 'Sleep & Recovery',
      questions: [
        {
          q: 'How do I log my sleep?',
          a: 'Navigate to the Sleep section and enter your sleep duration and quality. You can also add notes about factors affecting your sleep.'
        },
        {
          q: 'Does FitTrack Pro provide sleep recommendations?',
          a: 'Yes, based on your logged sleep data, the system provides personalized recommendations to improve your sleep quality and recovery.'
        }
      ]
    },
    {
      title: 'Account & Privacy',
      questions: [
        {
          q: 'How do I change my password?',
          a: 'Go to Settings > Password tab. Enter your current password, then your new password twice to confirm. Your password must be at least 8 characters.'
        },
        {
          q: 'Can I delete my account?',
          a: 'You can deactivate your account from Settings > Danger Zone. This will log you out and mark your account as inactive. Your data is retained in case you want to reactivate.'
        },
        {
          q: 'Is my data secure?',
          a: 'Yes, we use industry-standard encryption for passwords and secure token-based authentication. Your personal data is stored securely and never shared with third parties.'
        }
      ]
    }
  ];

  const toggleFAQ = (catIndex, qIndex) => {
    const key = `${catIndex}-${qIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  const filteredCategories = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <PublicLayout>
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about FitTrack Pro. Can't find what you're looking for? Feel free to contact us.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
            />
          </div>

          {/* FAQ Sections */}
          <div className="space-y-6">
            {filteredCategories.length === 0 ? (
              <Card className="text-center py-12">
                <FiMessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No results found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Try a different search term or <Link to="/contact" className="text-violet-500 hover:text-violet-600">contact us</Link> directly.
                </p>
              </Card>
            ) : (
              filteredCategories.map((category, catIndex) => (
                <Card key={catIndex} className="!p-0 overflow-hidden">
                  <div className="px-5 py-4 bg-violet-500/5 dark:bg-violet-500/10 border-b border-gray-200 dark:border-gray-700/60">
                    <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">{category.title}</h2>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
                    {category.questions.map((item, qIndex) => {
                      const key = `${catIndex}-${qIndex}`;
                      const isOpen = openIndex === key;
                      return (
                        <div key={qIndex}>
                          <button
                            onClick={() => toggleFAQ(catIndex, qIndex)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900/50 transition"
                          >
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 pr-4">{item.q}</span>
                            {isOpen
                              ? <FiChevronUp className="w-4 h-4 text-violet-500 shrink-0" />
                              : <FiChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                            }
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-4">
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Contact CTA */}
          <div className="mt-10 text-center">
            <Card className="!bg-violet-500/5 dark:!bg-violet-500/10 border-violet-200 dark:border-violet-800/40">
              <FiMessageCircle className="w-10 h-10 text-violet-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Still have questions?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Our support team is here to help. Send us a message and we'll get back to you as soon as possible.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-500/25 transition"
                >
                  <FiMail className="w-4 h-4" />
                  Contact Support
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export default FAQ;
