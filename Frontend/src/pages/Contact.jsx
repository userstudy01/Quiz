import { useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Arrow, FieldError, FieldLabel, Input, PageHeader, Section, Textarea } from '../components/ui';
import { buttonClass } from '../lib/styles';
import { errorMessage, sendContactMessage } from '../lib/api';
import useSeo from '../lib/useSeo';

/* ==========================================================================
   Contact.

   The message API is unchanged: POST /contact with { name, email, subject,
   message }. Validation runs on blur-free submit, errors are announced, and a
   sent message swaps the form for a confirmation rather than a toast that
   disappears before it is read.
   ========================================================================== */

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
  const formRef = useRef(null);

  useSeo({ title: 'Contact', description: 'Get in touch about work or collaboration.' });

  const hasDetails = Boolean(
    profile?.email || profile?.phone || profile?.location || profile?.socialLinks?.length
  );

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      // Move focus to the first field that failed.
      const first = Object.keys(nextErrors)[0];
      formRef.current?.querySelector(`#${first}`)?.focus();
      return;
    }

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

  return (
    <Section>
      <PageHeader
        eyebrow="Contact"
        title="Start a conversation"
        lede="Send the details of the project or role and I will reply by email."
        meta={profile?.location || undefined}
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20">
        {/* --- Form --------------------------------------------------------- */}
        <div>
          {status === 'success' ? (
            <div className="rise hairline-t pt-10" role="status">
              <p className="label-mono text-accent">Sent</p>
              <p className="mt-4 measure font-display text-h2 text-ink">
                Thank you — your message is on its way.
              </p>
              <p className="mt-4 measure text-body text-ink-muted">{feedback}</p>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setFeedback('');
                }}
                className={buttonClass('secondary', 'mt-8')}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate className="hairline-t pt-10">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={onChange('name')}
                    invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    placeholder="Your name"
                  />
                  <span id="name-error">
                    <FieldError>{errors.name}</FieldError>
                  </span>
                </div>

                <div>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={onChange('email')}
                    invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    placeholder="you@example.com"
                  />
                  <span id="email-error">
                    <FieldError>{errors.email}</FieldError>
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <Input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={onChange('subject')}
                  invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  placeholder="What is this about?"
                />
                <span id="subject-error">
                  <FieldError>{errors.subject}</FieldError>
                </span>
              </div>

              <div className="mt-6">
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea
                  id="message"
                  name="message"
                  rows={7}
                  value={form.message}
                  onChange={onChange('message')}
                  invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  placeholder="Tell me about the project or role."
                />
                <span id="message-error">
                  <FieldError>{errors.message}</FieldError>
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={buttonClass('primary', 'link-arrow')}
                >
                  {status === 'loading' ? (
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-3.5 animate-spin rounded-full border border-canvas/40 border-t-canvas"
                    />
                  ) : null}
                  {status === 'loading' ? 'Sending…' : 'Send message'}
                  {status === 'loading' ? null : <Arrow />}
                </button>

                {status === 'error' && feedback ? (
                  <p role="alert" className="text-small text-danger">
                    {feedback}
                  </p>
                ) : null}
              </div>
            </form>
          )}
        </div>

        {/* --- Details ------------------------------------------------------ */}
        <aside className="hairline-t pt-10">
          <h2 className="label-mono text-accent">Details</h2>

          <dl className="mt-5">
            {profile?.email ? (
              <div className="border-b border-line py-4">
                <dt className="label-mono">Email</dt>
                <dd className="mt-1.5">
                  <a
                    href={`mailto:${profile.email}`}
                    className="link-underline text-small text-ink hover:text-accent"
                  >
                    {profile.email}
                  </a>
                </dd>
              </div>
            ) : null}

            {profile?.phone ? (
              <div className="border-b border-line py-4">
                <dt className="label-mono">Phone</dt>
                <dd className="mt-1.5 text-small text-ink">{profile.phone}</dd>
              </div>
            ) : null}

            {profile?.location ? (
              <div className="border-b border-line py-4">
                <dt className="label-mono">Location</dt>
                <dd className="mt-1.5 text-small text-ink">{profile.location}</dd>
              </div>
            ) : null}

            {profile?.socialLinks?.length ? (
              <div className="border-b border-line py-4">
                <dt className="label-mono">Elsewhere</dt>
                <dd className="mt-2">
                  <ul className="space-y-2">
                    {profile.socialLinks.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="link-underline text-small text-ink hover:text-accent"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>

          <p className="mt-6 measure text-small text-ink-subtle">
            {hasDetails
              ? 'Messages sent through the form are delivered to the portfolio inbox.'
              : 'The form is the direct line — messages are delivered to the portfolio inbox.'}
          </p>
        </aside>
      </div>
    </Section>
  );
}
