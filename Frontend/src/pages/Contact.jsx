import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Section, SectionHeading } from '../components/ui';
import { buttonClass, inputClass } from '../lib/styles';
import { errorMessage, sendContactMessage } from '../lib/api';
import useSeo from '../lib/useSeo';

const EMPTY = { name: '', email: '', subject: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (form) => {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email address.';
  if (form.subject.trim().length < 2) errors.subject = 'Please enter a subject.';
  if (form.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';
  return errors;
};

export default function Contact() {
  const { profile } = useOutletContext();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [feedback, setFeedback] = useState('');

  useSeo({ title: 'Contact', description: 'Get in touch about work or collaboration.' });

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus('loading');
    setFeedback('');

    try {
      const data = await sendContactMessage(form);
      setStatus('success');
      setFeedback(data.message || 'Message sent successfully.');
      setForm(EMPTY);
    } catch (error) {
      setStatus('error');
      setFeedback(errorMessage(error, 'Could not send your message. Please try again.'));
    }
  };

  const fieldClass = (field) => inputClass(Boolean(errors[field]));

  return (
    <Section>
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        description="Send a message and I will reply by email."
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={onSubmit} noValidate className="surface-card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-small font-medium text-ink">
                Name
              </label>
              <input
                id="name"
                value={form.name}
                onChange={onChange('name')}
                aria-invalid={Boolean(errors.name)}
                className={fieldClass('name')}
                placeholder="Your name"
              />
              {errors.name ? <p className="mt-1.5 text-meta text-danger">{errors.name}</p> : null}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-small font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={onChange('email')}
                aria-invalid={Boolean(errors.email)}
                className={fieldClass('email')}
                placeholder="you@example.com"
              />
              {errors.email ? <p className="mt-1.5 text-meta text-danger">{errors.email}</p> : null}
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="subject" className="mb-1.5 block text-small font-medium text-ink">
              Subject
            </label>
            <input
              id="subject"
              value={form.subject}
              onChange={onChange('subject')}
              aria-invalid={Boolean(errors.subject)}
              className={fieldClass('subject')}
              placeholder="What is this about?"
            />
            {errors.subject ? <p className="mt-1.5 text-meta text-danger">{errors.subject}</p> : null}
          </div>

          <div className="mt-5">
            <label htmlFor="message" className="mb-1.5 block text-small font-medium text-ink">
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              value={form.message}
              onChange={onChange('message')}
              aria-invalid={Boolean(errors.message)}
              className={fieldClass('message')}
              placeholder="Tell me about the project or role."
            />
            {errors.message ? <p className="mt-1.5 text-meta text-danger">{errors.message}</p> : null}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === 'loading'}
              className={buttonClass('primary')}
            >
              {status === 'loading' ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-contrast/35 border-t-accent-contrast" />
              ) : null}
              {status === 'loading' ? 'Sending…' : 'Send message'}
            </button>

            {feedback ? (
              <p
                role="status"
                className={`text-small ${status === 'success' ? 'text-success' : 'text-danger'}`}
              >
                {feedback}
              </p>
            ) : null}
          </div>
        </form>

        <aside className="space-y-4 text-sm">
          {profile?.email ? (
            <div className="surface-card p-5">
              <p className="text-ink-muted">Email</p>
              <a href={`mailto:${profile.email}`} className="mt-1 block font-medium hover:underline">
                {profile.email}
              </a>
            </div>
          ) : null}

          {profile?.location ? (
            <div className="surface-card p-5">
              <p className="text-ink-muted">Location</p>
              <p className="mt-1 font-medium">{profile.location}</p>
            </div>
          ) : null}

          {profile?.socialLinks?.length ? (
            <div className="surface-card p-5">
              <p className="text-ink-muted">Elsewhere</p>
              <ul className="mt-2 space-y-1.5">
                {profile.socialLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-medium hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </Section>
  );
}
