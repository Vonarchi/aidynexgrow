import { Link } from 'react-router-dom'
import { Footer, PageShell, SiteHeader } from '../components/Layout'
import { Badge } from '../components/UI'

export type PolicyKey = 'terms' | 'privacy' | 'program-guidelines' | 'acceptable-use' | 'refund-cancellation' | 'accessibility' | 'contact'
type PolicySection = string | { title: string; body?: string[]; items?: string[] }

const policies: Record<PolicyKey, { title: string; summary: string; sections: PolicySection[] }> = {
  terms: {
    title: 'Terms & Conditions',
    summary: 'Business Launch Initiative. Last Updated: [Insert Date]',
    sections: [
      {
        title: 'Important Notice',
        body: ['This document is a preliminary draft for planning purposes only and is not intended as legal advice. Final terms should be reviewed and approved by qualified legal counsel before public launch.'],
      },
      {
        title: '1. Program Overview',
        body: ['The Business Launch Initiative is designed to help qualifying businesses establish a professional online presence by providing a standard website build with no upfront website design fee for approved applicants.', 'Participation is subject to availability, application review, and acceptance by Adynex Systems.', 'Approval is not guaranteed.'],
      },
      {
        title: '2. Eligibility',
        body: ['Applicants must:', 'Adynex Systems reserves the right to approve or decline any application at its sole discretion.'],
        items: ['Provide accurate and complete business information.', 'Be authorized to act on behalf of the business.', 'Agree to these Terms & Conditions.', 'Maintain an active hosting subscription for the website to be published and remain online.'],
      },
      {
        title: '3. Included Services',
        body: ['Approved participants may receive:', 'The included services are limited to the standard website package unless otherwise agreed in writing.'],
        items: ['Professional website design', 'Up to five standard pages', 'Mobile-responsive layout', 'Contact form', 'Basic SEO setup', 'Standard production queue', 'One round of revisions', 'Standard website launch'],
      },
      {
        title: '4. Services Not Included',
        body: ['Unless specifically included in your selected plan or purchased separately, the following are not included:', 'These services may be available for an additional fee.'],
        items: ['Domain registration', 'Website hosting', 'Premium integrations', 'Ongoing maintenance', 'Content creation', 'Professional photography', 'Logo design', 'Copywriting', 'Email services', 'Additional revisions', 'Search engine optimization campaigns', 'Marketing services', 'AI automation', 'CRM implementation', 'E-commerce functionality', 'Membership systems', 'Custom software development', 'Mobile applications', 'Third-party software licensing'],
      },
      {
        title: '5. Hosting Requirement',
        body: ['Websites created through the Business Launch Initiative require an active Adynex Systems hosting subscription or another approved hosting arrangement before publication.', 'Websites will not be launched until hosting has been activated and any required onboarding steps have been completed.'],
      },
      {
        title: '6. Client Responsibilities',
        body: ['Clients agree to provide:', 'Project timelines may be delayed if required materials are not provided.'],
        items: ['Final website content', 'Business information', 'Logos', 'Images', 'Licenses or certifications, if applicable', 'Approval of final website content'],
      },
      {
        title: '7. Revisions',
        body: ['The standard website package includes one revision round unless otherwise specified.', 'Additional revisions or requests outside the agreed project scope may incur additional charges.'],
      },
      {
        title: '8. Project Scope',
        body: ['The Business Launch Initiative is intended for standard informational business websites.', 'Requests outside the standard scope, including advanced integrations, custom development, extensive design changes, or additional functionality, may require a custom proposal.'],
      },
      {
        title: '9. Intellectual Property',
        body: ['Clients retain ownership of content they provide.', 'Upon full payment of applicable fees, clients receive the right to use the completed website in accordance with the service agreement.', 'Adynex Systems retains ownership of its proprietary software, templates, components, frameworks, design systems, automation tools, and underlying platform technology.'],
      },
      {
        title: '10. Third-Party Services',
        body: ['Websites may utilize third-party services including, but not limited to:', 'Adynex Systems is not responsible for outages, pricing changes, or service interruptions caused by third-party providers.'],
        items: ['Payment processors', 'Email providers', 'Maps', 'Analytics', 'Scheduling platforms', 'AI services', 'Social media integrations'],
      },
      {
        title: '11. Limitation of Liability',
        body: ['To the maximum extent permitted by law, Adynex Systems shall not be liable for indirect, incidental, consequential, or special damages arising from participation in the Program or the use of any website or related services.'],
      },
      {
        title: '12. Program Changes',
        body: ['Adynex Systems reserves the right to modify, suspend, or discontinue the Business Launch Initiative or any associated services at any time.'],
      },
      {
        title: '13. Governing Law',
        body: ['These Terms shall be governed by the laws of the State of Indiana, unless otherwise required by applicable law.'],
      },
      {
        title: '14. Contact',
        body: ['For questions regarding these Terms, please contact Adynex Systems.', 'Email: support@adynexsystems.com', 'Website: https://www.adynexsystems.com'],
      },
      {
        title: 'Legal Notice',
        body: ['This Terms & Conditions page is provided as a working draft for development purposes. It is not legal advice and should be reviewed by qualified legal counsel before being published or relied upon in production.'],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    summary: 'Effective Date: January 1, 2026',
    sections: [
      'Adynex Systems ("Adynex," "we," "our," or "us") values your privacy. This Privacy Policy explains how we collect, use, store, and protect information when you visit our website, submit an application, request services, or communicate with us.',
      {
        title: 'Information We Collect',
        body: ['We may collect information including:'],
        items: ['Name', 'Business name', 'Email address', 'Phone number', 'Business address', 'Website information', 'Uploaded files', 'Payment information processed securely through Stripe', 'Messages submitted through forms', 'Analytics and website usage information', 'Device and browser information'],
      },
      {
        title: 'How We Use Your Information',
        body: ['We use your information to:'],
        items: ['Review Business Launch applications', 'Contact you regarding your application', 'Provide website design and development services', 'Create your client account', 'Process payments', 'Send project updates', 'Improve our services', 'Respond to inquiries', 'Maintain website security'],
      },
      {
        title: 'Third-Party Services',
        body: ['Our website may use trusted providers including:', 'These providers maintain their own privacy practices.'],
        items: ['Stripe', 'Supabase', 'Resend', 'Vercel', 'Google Analytics', 'Google Maps', 'Meta Pixel'],
      },
      {
        title: 'Cookies',
        body: ['Our website may use cookies and similar technologies to:', 'You may disable cookies through your browser settings.'],
        items: ['Improve website performance', 'Remember preferences', 'Analyze website traffic', 'Measure marketing effectiveness'],
      },
      {
        title: 'Data Security',
        body: ['We use commercially reasonable safeguards to protect your information.', 'However, no online transmission or storage system can be guaranteed to be completely secure.'],
      },
      {
        title: 'Your Rights',
        body: ['Depending on your jurisdiction, you may request to:'],
        items: ['Access your personal information', 'Correct inaccurate information', 'Delete your information', 'Withdraw certain communications', 'Request information regarding collected data'],
      },
      {
        title: 'Policy Updates',
        body: ['We may update this Privacy Policy periodically.', 'Changes become effective upon posting.'],
      },
      {
        title: 'Contact',
        body: ['Questions regarding this Privacy Policy may be sent to support@adynexsystems.com.'],
      },
    ],
  },
  'program-guidelines': {
    title: 'Business Launch Initiative Guidelines',
    summary: 'Our Business Launch Initiative is designed to help qualifying businesses establish a professional online presence.',
    sections: [
      'Approval is based on availability, project scope, and our ability to serve your business effectively.',
      {
        title: 'What Is Included',
        items: ['Professional website design', 'Standard page structure', 'Mobile-responsive design', 'Contact form', 'Basic SEO setup', 'One revision round', 'Standard launch process'],
      },
      {
        title: 'What Is Not Included',
        items: ['Domain registration', 'Premium integrations', 'Custom software', 'Mobile applications', 'Advanced automation', 'Unlimited revisions', 'Marketing campaigns', 'Paid advertising', 'Ongoing SEO services'],
      },
      {
        title: 'Client Responsibilities',
        body: ['Clients agree to:', 'Applications may be declined or delayed if required information is incomplete.'],
        items: ['Submit accurate business information', 'Provide logos and images', 'Respond to requests promptly', 'Review the website within requested timeframes', 'Maintain an active hosting subscription for publication'],
      },
    ],
  },
  'acceptable-use': {
    title: 'Acceptable Use',
    summary: 'Clients may not use Adynex Systems services for activities that violate applicable laws or infringe on the rights of others.',
    sections: [
      {
        title: 'Examples',
        body: ['Examples include:'],
        items: ['Fraudulent activities', 'Malware distribution', 'Phishing', 'Illegal products or services', 'Copyright infringement', 'Hate speech', 'Harassment', 'Spam', 'Adult content prohibited by our hosting policies', 'Illegal gambling', 'Unauthorized access to systems'],
      },
      'Adynex Systems reserves the right to suspend or terminate services that violate this policy.',
    ],
  },
  'refund-cancellation': {
    title: 'Refund and Cancellation Policy',
    summary: 'Subscription services may be canceled at any time.',
    sections: ['Cancellation will stop future recurring charges but does not automatically refund payments already made.', 'Monthly subscriptions remain active through the end of the current billing period unless otherwise stated.', 'One-time consultation fees, custom software deposits, and completed project work are generally non-refundable unless required by law or otherwise agreed in writing.', 'If a client cancels during an active website build, completed work, purchased services, or third-party expenses may not be refundable.', 'Custom software projects are governed by their individual project agreements.'],
  },
  accessibility: {
    title: 'Accessibility',
    summary: 'Adynex Systems is committed to making our website accessible to as many users as possible.',
    sections: [
      {
        title: 'Our Goals',
        body: ['We strive to:'],
        items: ['Use semantic HTML', 'Maintain keyboard accessibility', 'Support screen readers where practical', 'Provide meaningful image descriptions where appropriate', 'Maintain readable color contrast', 'Improve accessibility over time'],
      },
      'If you encounter an accessibility issue while using our website, please contact us so we can work toward a solution.',
      'Email: support@adynexsystems.com',
    ],
  },
  contact: {
    title: 'Contact Adynex Systems',
    summary: "We'd love to hear from you.",
    sections: [
      {
        title: 'General Inquiries',
        body: ['Questions about our services, programs, or website.'],
      },
      {
        title: 'Business Launch Initiative',
        body: ['Questions regarding your application or website build.'],
      },
      {
        title: 'Technical Support',
        body: ['Current clients needing website assistance.'],
      },
      {
        title: 'Sales & Custom Software',
        body: ['Interested in custom software, automation, AI solutions, or business consulting.'],
      },
      {
        title: 'Email',
        body: ['support@adynexsystems.com'],
      },
      {
        title: 'Website',
        body: ['AdynexSystems.com'],
      },
      {
        title: 'Business Hours',
        body: ['Monday - Friday', '9:00 AM - 5:00 PM (Central Time)'],
      },
    ],
  },
}

export function PolicyPage({ pageKey }: { pageKey: PolicyKey }) {
  const policy = policies[pageKey]
  return <PageShell><SiteHeader /><main className="bg-cloud-50 px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-6 shadow-xl sm:p-10"><Badge tone="gold">Draft placeholder for legal review</Badge><h1 className="mt-5 text-4xl font-bold tracking-tight text-navy-950">{policy.title}</h1><p className="mt-4 text-lg leading-8 text-slate-700">{policy.summary}</p><div className="mt-8 grid gap-4">{policy.sections.map((section) => typeof section === 'string' ? <div key={section} className="rounded-2xl border bg-cloud-50 p-5 text-sm leading-7 text-slate-700">{section}</div> : <section key={section.title} className="rounded-2xl border bg-cloud-50 p-5 text-sm leading-7 text-slate-700"><h2 className="text-xl font-bold text-navy-950">{section.title}</h2>{section.body?.map((paragraph) => <p key={paragraph} className="mt-3">{paragraph}</p>)}{section.items && <ul className="mt-3 list-disc space-y-1 pl-5">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}</div><Link to="/" className="mt-8 inline-flex rounded-full bg-navy-950 px-5 py-3 text-sm font-bold text-white">Back to Business Launch Initiative</Link></div></main><Footer /></PageShell>
}
