"use client";

import React, { useState } from "react";
import { useToastStore } from "@/hooks/useToastStore";
import { isValidEmail, sanitizePlainText } from "@/lib/securityHelpers";
import Button from "@/components/ui/Button";
import CustomSelect from "@/components/ui/CustomSelect";
import Input from "@/components/ui/Input";

const TOPIC_OPTIONS = [
  { value: "Client Concierge & Sizing", label: "Client Concierge & Sizing" },
  { value: "Order & Shipping Status", label: "Order & Shipping Status" },
  { value: "Private Appointments & Press", label: "Private Appointments & Press" },
];

export default function ContactPage() {
  const { addToast } = useToastStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Client Concierge & Sizing");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizePlainText(name, 80);
    const cleanMsg = sanitizePlainText(message, 1000);
    if (!cleanName || !cleanMsg || !isValidEmail(email)) {
      addToast("Please check your form details", "error", "Valid name, email, and message are required.");
      return;
    }
    setSubmitted(true);
    addToast("Message Dispatched", "success", "Our concierge team will reply within 24 hours.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="container-shell py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Client Concierge</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-navy-950 mt-1">Get in Touch with Our Atelier</h1>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Whether you have a question about tailored garment sizing, order delivery status, or private showroom appointments, our atelier team is here to assist.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-sm">
            <div><strong className="text-navy-950 block">Atelier Flagship</strong><span className="text-slate-600">Heliopolis (Misr El Gedida), Cairo, Egypt</span></div>
            <div><strong className="text-navy-950 block">Direct Email</strong><a href="mailto:ziaadmoataz@gmail.com" className="text-brand-700 font-medium hover:underline">ziaadmoataz@gmail.com</a></div>
            <div><strong className="text-navy-950 block">Telephone & WhatsApp</strong><a href="tel:+201012766890" className="text-navy-900 font-medium hover:text-brand-600">+20 101 276 6890</a></div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl border border-slate-200 bg-white shadow-soft flex flex-col gap-5">
            <h2 className="text-xl font-bold text-navy-950">Send a Direct Inquiry</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="contact-name" label="Your Name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Zyaad Moataz" />
              <Input id="contact-email" label="Email Address" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-700">Topic</span>
              <CustomSelect id="contact-subject" variant="field" ariaLabel="Inquiry Topic" value={subject} options={TOPIC_OPTIONS} onChange={(val) => setSubject(val)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700">Message</label>
              <textarea id="contact-message" required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help you today?" className="ring-1 ring-slate-300 focus:ring-2 focus:ring-brand-600 rounded-xl px-4 py-3 text-sm text-navy-950 outline-none resize-none" />
            </div>

            {submitted && (
              <div role="status" className="text-xs font-medium text-emerald-700 bg-emerald-50 p-3.5 rounded-xl border border-emerald-100">
                Thank you for reaching out! Your inquiry has been logged with our concierge desk.
              </div>
            )}

            <Button type="submit" size="lg" className="w-max px-8">Send Message</Button>
          </form>
        </div>
      </div>
    </main>
  );
}
