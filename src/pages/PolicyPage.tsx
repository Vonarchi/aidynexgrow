import { Link } from 'react-router-dom'
import { Footer, PageShell, SiteHeader } from '../components/Layout'
import { Badge } from '../components/UI'

export type PolicyKey = 'terms' | 'privacy' | 'program-guidelines' | 'acceptable-use' | 'refund-cancellation' | 'accessibility' | 'contact'

const policies: Record<PolicyKey, { title: string; summary: string; sections: string[] }> = {
  terms: {
    title: 'Terms',
    summary: 'Draft terms placeholder for the Business Launch Initiative.',
    sections: ['This page is placeholder content for legal review and is not legal advice.', 'Approved applicants may receive standard website design and initial build services with no upfront website design fee.', 'Domain registration, hosting, premium integrations, maintenance, additional revisions, and custom functionality may require separate payment.', 'Final program terms should be reviewed by qualified counsel before launch.'],
  },
  privacy: {
    title: 'Privacy Policy',
    summary: 'Draft privacy placeholder for applicant, client, and project data.',
    sections: ['This page is placeholder content for legal review and is not legal advice.', 'The platform may collect contact information, business details, uploaded assets, project messages, and application information.', 'Private files and client records should remain accessible only to the appropriate account owner and authorized staff.', 'A production policy should explain data retention, third-party services, email preferences, and user rights.'],
  },
  'program-guidelines': {
    title: 'Program Guidelines',
    summary: 'Draft guidelines for eligibility, scope, onboarding, and launch readiness.',
    sections: ['This page is placeholder content for legal review.', 'Approval is not guaranteed and may depend on eligibility, project scope, content readiness, and production capacity.', 'Applicants are expected to provide accurate information, business assets, and timely feedback.', 'Advanced features, custom software, and third-party costs are outside the standard website build unless separately approved.'],
  },
  'acceptable-use': {
    title: 'Acceptable Use',
    summary: 'Draft acceptable-use expectations for participating businesses.',
    sections: ['This page is placeholder content for legal review.', 'Participants should not submit unlawful, misleading, infringing, abusive, or harmful content.', 'Uploaded files should be owned by the applicant or properly licensed for website use.', 'The program may decline work that violates platform, hosting, payment, or legal requirements.'],
  },
  'refund-cancellation': {
    title: 'Refund and Cancellation Policy',
    summary: 'Draft payment and cancellation placeholder for paid add-ons and services.',
    sections: ['This page is placeholder content for legal review and is not legal advice.', 'The standard website design offer should clearly distinguish included work from paid hosting, domains, premium services, and custom functionality.', 'Refund, cancellation, hosting, and recurring service terms should be finalized before accepting payments.', 'Stripe-backed billing policies should match the final product, service, and subscription configuration.'],
  },
  accessibility: {
    title: 'Accessibility',
    summary: 'Draft accessibility commitment placeholder.',
    sections: ['This page is placeholder content for review.', 'The Business Launch Initiative should aim for readable contrast, keyboard navigation, semantic structure, and mobile-friendly form controls.', 'Users should have a clear way to request accessibility support or report an issue.', 'Accessibility practices should be reviewed regularly as new portal and admin features are added.'],
  },
  contact: {
    title: 'Contact',
    summary: 'Contact placeholder for applicants, clients, and support requests.',
    sections: ['Use the application form to apply for a sponsored website build.', 'Signed-in clients can use the dashboard message thread for project-specific questions.', 'A production contact email, phone number, and support process should be added before launch.', 'Do not publish placeholder contact details as final business contact information.'],
  },
}

export function PolicyPage({ pageKey }: { pageKey: PolicyKey }) {
  const policy = policies[pageKey]
  return <PageShell><SiteHeader /><main className="bg-cloud-50 px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-6 shadow-xl sm:p-10"><Badge tone="gold">Draft placeholder for legal review</Badge><h1 className="mt-5 text-4xl font-bold tracking-tight text-navy-950">{policy.title}</h1><p className="mt-4 text-lg leading-8 text-slate-700">{policy.summary}</p><div className="mt-8 grid gap-4">{policy.sections.map((section) => <div key={section} className="rounded-2xl border bg-cloud-50 p-5 text-sm leading-7 text-slate-700">{section}</div>)}</div><div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">This generated placeholder is for planning and legal review only. It should not be treated as final policy language or legal advice.</div><Link to="/" className="mt-8 inline-flex rounded-full bg-navy-950 px-5 py-3 text-sm font-bold text-white">Back to Business Launch Initiative</Link></div></main><Footer /></PageShell>
}
