import React, { useState } from "react";
import { Link } from "react-router-dom";
import MetaData from "../Layouts/MetaData";

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
    "Return eligibility depends on product condition and the seller's return terms. Keep the original packaging and proof of purchase. Approved refunds are processed through the original payment method or the applicable platform process.",
  ],
  [
    "Seller Standards and Commission",
    "Sellers are responsible for lawful products, correct fulfillment, customer communication, invoices and after-sale support. Ma-Cart may review, pause or remove listings that breach marketplace rules or customer safety requirements.",
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

const AboutUs = () => {
  const [openPolicy, setOpenPolicy] = useState(0);
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

  return (
    <>
      <MetaData title="About Ma-Cart | Marketplace Information and Policies" />
      <main className="min-h-screen bg-slate-50 text-slate-800">
        <section className="bg-[#173b67] px-4 py-16 text-center text-white sm:py-24">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-sky-200">
            A marketplace built on trust
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            About Ma-Cart
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            A practical, secure place where customers discover products and
            independent sellers grow their businesses.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="rounded-full bg-[#2bbef9] px-6 py-3 text-sm font-bold text-white hover:bg-sky-500"
            >
              Start Shopping
            </Link>
            <Link
              to="/become-seller"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-bold text-white hover:bg-white hover:text-[#173b67]"
            >
              Become a Seller
            </Link>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <section className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
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
              {workflow.map(([number, title, text]) => (
                <div
                  key={number}
                  className="border-t-4 border-sky-400 bg-white p-5 shadow-sm"
                >
                  <span className="text-2xl font-black text-sky-500">
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
            {audiences.map(([title, text, path, action]) => (
              <article
                key={title}
                className="bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <h2 className="text-xl font-black text-slate-900">{title}</h2>
                <p className="mt-3 min-h-16 text-sm leading-6 text-slate-600">
                  {text}
                </p>
                <Link
                  to={path}
                  className="mt-5 inline-block text-sm font-bold text-sky-600 hover:text-sky-800"
                >
                  {action} &rarr;
                </Link>
              </article>
            ))}
          </section>

          <section
            className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"
            id="policies"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
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
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-slate-800 hover:bg-slate-50"
                  >
                    <span>{title}</span>
                    <span className="text-xl text-sky-500">
                      {openPolicy === index ? "−" : "+"}
                    </span>
                  </button>
                  {openPolicy === index && (
                    <p className="px-5 pb-5 text-sm leading-7 text-slate-600">
                      {text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 bg-[#e9f8ff] px-6 py-10 text-center sm:px-12">
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
    </>
  );
};

export default AboutUs;
