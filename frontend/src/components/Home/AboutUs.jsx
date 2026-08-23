import React, { useState } from "react";
import { Link } from "react-router-dom";
import MetaData from "../Layouts/MetaData";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  Store,
} from "lucide-react";

const policySections = [
  [
    "Buyer Protection and Product Authenticity",
    "Sellers must provide accurate descriptions, images, prices and stock information. Report a damaged, incorrect or counterfeit item through Contact Us so our support team can review the order and seller response.",
  ],
  [
    "Shipping, Delivery and Order Tracking",
    "Delivery time depends on the seller, product availability and destination. Customers can review order status from My Orders. Delays, failed delivery and address issues should be reported as soon as possible.",
  ],
  [
    "Returns, Refunds and Cancellations",
    "Return eligibility depends on product condition and the seller's return terms. Keep the original packaging and proof of purchase. Approved refunds are processed through the original payment method or applicable platform process.",
  ],
  [
    "Seller Standards and Commission",
    "Sellers are responsible for lawful products, correct fulfillment, customer communication, invoices and after-sale support. Ma-Cart may review, pause or remove listings that breach marketplace rules.",
  ],
  [
    "Privacy and Account Security",
    "Use a strong password and never share login or payment credentials. Account, order and contact information should only be used to provide marketplace services, support, delivery and payment processing.",
  ],
  [
    "Payments, Fraud and Disputes",
    "Complete payments only through the checkout options shown on Ma-Cart. Never send money directly to a seller outside the platform. Contact support immediately for suspicious activity or an unresolved order dispute.",
  ],
];

const workflow = [
  ["01", "Discover", "Browse products, categories and seller stores."],
  ["02", "Compare", "Review price, stock, ratings and details."],
  ["03", "Order", "Use secure checkout and track progress."],
  ["04", "Resolve", "Reach support when something needs attention."],
];
const audiences = [
  [
    "For Customers",
    "Search, compare, order, track and review products in one place.",
    "/products",
    "Explore Products",
  ],
  [
    "For Sellers",
    "Create a store, publish products, manage orders and reach new buyers.",
    "/become-seller",
    "Join Ma-Cart",
  ],
  [
    "Need Help?",
    "Our support channel is available for account, order and marketplace questions.",
    "/contact-us",
    "Contact Support",
  ],
];

const AboutUs = () => {
  const [openPolicy, setOpenPolicy] = useState(0);
  return (
    <>
      <MetaData title="About Ma-Cart | Marketplace Information and Policies" />
      <main className="about-page min-h-screen overflow-hidden bg-[#f5f8fc] text-slate-800">
        <section className="relative isolate overflow-hidden bg-[#102f55] px-4 py-20 text-white sm:py-28">
          <div
            className="absolute inset-0 -z-10 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
          <div className="absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full border-[42px] border-cyan-300/20" />
          <div className="mx-auto max-w-5xl text-center">
            <div className="about-reveal mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-cyan-200/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
              <Store size={14} /> Built for every side of commerce
            </div>
            <h1 className="about-reveal text-5xl font-black tracking-[-0.04em] sm:text-7xl">
              Shopping that feels <span className="text-[#ff8b6b]">human.</span>
            </h1>
            <p className="about-reveal mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              Ma-Cart brings customers and independent sellers together with
              clarity, care and confidence at every step.
            </p>
            <div className="about-reveal mt-9 flex flex-wrap justify-center gap-3">
              <Link
                to="/products"
                className="group flex items-center gap-2 rounded-full bg-[#2bbef9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-950/20 transition hover:-translate-y-1 hover:bg-cyan-400"
              >
                Start Shopping{" "}
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/become-seller"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#102f55]"
              >
                Become a Seller
              </Link>
            </div>
          </div>
          <div className="about-reveal mx-auto mt-14 grid max-w-3xl grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-6">
            {[
              ["10k+", "Products"],
              ["24/7", "Support"],
              ["100%", "Secure checkout"],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <strong className="block text-xl font-black text-cyan-200 sm:text-2xl">
                  {value}
                </strong>
                <span className="mt-1 block text-[10px] uppercase tracking-wider text-slate-300 sm:text-xs">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <section className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
                Our mission
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                Better choices for buyers. Better reach for sellers.
              </h2>
              <p className="mt-5 leading-7 text-slate-600">
                Ma-Cart connects customers with trusted vendors across everyday
                categories. We aim to make product discovery, checkout, delivery
                and after-sale support clear at every step.
              </p>
              <p className="mt-4 leading-7 text-slate-600">
                Every seller brings their own catalog and responsibility. Our
                role is to provide the tools, visibility and support that help
                both sides trade with confidence.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {workflow.map(([number, title, text], index) => (
                <div
                  key={number}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="about-reveal group border-t-4 border-sky-400 bg-white p-5 shadow-[0_12px_30px_rgba(20,50,80,.06)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_18px_35px_rgba(20,50,80,.12)]"
                >
                  <span className="text-2xl font-black text-sky-500 transition group-hover:text-[#ff765d]">
                    {number}
                  </span>
                  <h3 className="mt-3 font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-4 sm:grid-cols-3">
            {audiences.map(([title, text, path, action], index) => (
              <article
                key={title}
                style={{ animationDelay: `${index * 120}ms` }}
                className="about-reveal group border-b-4 border-transparent bg-white p-6 shadow-[0_12px_30px_rgba(20,50,80,.06)] transition duration-300 hover:-translate-y-2 hover:border-[#ff765d] hover:shadow-[0_18px_35px_rgba(20,50,80,.12)]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition group-hover:bg-[#fff0eb] group-hover:text-[#ff765d]">
                  {index === 0 ? (
                    <PackageCheck size={21} />
                  ) : index === 1 ? (
                    <Store size={21} />
                  ) : (
                    <ShieldCheck size={21} />
                  )}
                </div>
                <h2 className="text-xl font-black text-slate-900">{title}</h2>
                <p className="mt-3 min-h-16 text-sm leading-6 text-slate-600">
                  {text}
                </p>
                <Link
                  to={path}
                  className="mt-5 flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-800"
                >
                  {action} <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </section>

          <section
            className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"
            id="policies"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
                Marketplace standards
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-900">
                Terms, policies and protection
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                These plain-language summaries explain how Ma-Cart works.
                Product-specific terms, applicable law and seller policies may
                also apply to your order.
              </p>
              <Link
                to="/contact-us"
                className="mt-6 inline-block rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700"
              >
                Ask a policy question
              </Link>
            </div>
            <div className="divide-y divide-slate-200 bg-white shadow-sm ring-1 ring-slate-200">
              {policySections.map(([title, text], index) => (
                <div key={title}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenPolicy(openPolicy === index ? -1 : index)
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-slate-800 transition hover:bg-sky-50"
                  >
                    <span className="flex items-center gap-3">
                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-sky-500"
                      />
                      {title}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-sky-500 transition-transform ${openPolicy === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openPolicy === index && (
                    <p className="px-5 pb-5 pl-14 text-sm leading-7 text-slate-600">
                      {text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 overflow-hidden bg-[#e9f8ff] px-6 py-10 text-center shadow-[0_15px_40px_rgba(43,190,249,.1)] sm:px-12">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-sky-500 shadow-sm">
              <LockKeyhole size={21} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Ready to shop or sell with confidence?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Keep your order details, communicate through the platform and
              contact support whenever you need help.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/orders"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:border-sky-400"
              >
                Track My Orders
              </Link>
              <Link
                to="/contact-us"
                className="rounded-full bg-sky-500 px-5 py-3 text-sm font-bold text-white hover:bg-sky-600"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </main>
      <style>{`.about-reveal{animation:about-rise .7s both cubic-bezier(.22,1,.36,1)}@keyframes about-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </>
  );
};

export default AboutUs;
