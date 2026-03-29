"use client";

import { useState } from "react";
import { Mail, MessageSquare, Clock, Check, Loader2 } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission — replace with actual email API (Resend/EmailJS) later
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors placeholder:text-gray-400";

  return (
    <div className="max-w-5xl mx-auto px-4 mt-10 md:px-8 py-12" >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Get in Touch</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Have a question, need help, or want to share feedback? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
              <Mail size={18} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <a href="mailto:teamwedcraft@gmail.com" className="text-sm text-blue-600 hover:underline">
              teamwedcraft@gmail.com
            </a>
            <p className="text-xs text-gray-400 mt-1">We reply within 24 hours</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center mb-3">
              <FaInstagram size={18} className="text-pink-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Instagram</h3>
            <a href="https://instagram.com/this_is_wedcraft" target="_blank" rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline">
              @this_is_wedcraft
            </a>
            <p className="text-xs text-gray-400 mt-1">DM us for quick questions</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
              <Clock size={18} className="text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Response time</h3>
            <p className="text-sm text-gray-600">Mon – Sat</p>
            <p className="text-sm text-gray-600">9:00 AM – 6:00 PM IST</p>
          </div>

          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
            <h3 className="font-semibold text-amber-900 mb-2 text-sm">Common questions</h3>
            <ul className="space-y-2 text-xs text-amber-800">
              <li>• How do I share my invite link?</li>
              <li>• Can I change details after purchase?</li>
              <li>• How do I view RSVP responses?</li>
              <li>• What payment methods are accepted?</li>
            </ul>
          </div>
        </div>

        {/* Contact form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <Check size={28} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
                <p className="text-gray-500 text-sm">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
                    <MessageSquare size={16} className="text-white" />
                  </div>
                  <h2 className="font-semibold text-gray-900">Send us a message</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                    <input className={inputCls} placeholder="Your name" required
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" className={inputCls} placeholder="you@example.com" required
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <select className={inputCls} value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
                    <option value="">Select a topic</option>
                    <option value="purchase">Purchase / Payment issue</option>
                    <option value="template">Template question</option>
                    <option value="rsvp">RSVP / Dashboard help</option>
                    <option value="edit">Editing my invitation</option>
                    <option value="refund">Refund request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea className={`${inputCls} resize-none`} rows={5} required
                    placeholder="Describe your question or issue in detail..."
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-black text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-colors">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                  {loading ? "Sending..." : "Send Message"}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By submitting, you agree to our{" "}
                  <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}