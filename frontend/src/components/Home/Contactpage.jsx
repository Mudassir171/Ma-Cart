import React, { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import emailjs from '@emailjs/browser';
const ContactPage = () => {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    // .env file se keys utha raha hai (Secure Way)
    // ContactPage.jsx ke andar sendEmail function mein ye tabdeeli karein:
    const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
        setIsSent(true);
        setIsSending(false);
        form.current.reset();
        // 5 second baad success message hide karne ke liye
        setTimeout(() => setIsSent(false), 2000);
      }, (error) => {
        console.log("Email Error:", error.text);
        alert("Message bhejney mein masla hua. Dubara koshish karein.");
        setIsSending(false);
      });
  };
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-500">
        {/* Left Side: Contact Information */ }
        <div className="bg-green-600 w-full md:w-5/12 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Circles */ }
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500 rounded-full opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-400 rounded-full opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Contact Us</h2>
            <p className="text-green-100 text-lg mb-10 leading-relaxed">
              Any questions or any help should be
              sent to the template, our team will
              contact you as soon as possible.            </p>
            <div className="space-y-8">
              <div className="flex items-center space-x-5 group">
                <div className="bg-green-500/50 p-4 rounded-2xl group-hover:bg-white group-hover:text-green-600 transition-all duration-300">
                  <Phone size={ 24 } />
                </div>
                <div>
                  <p className="text-green-200 text-sm font-medium">Phone Number</p>
                  <p className="text-lg font-semibold">+92 349-3395255</p>
                </div>
              </div>
              <div className="flex items-center space-x-5 group">
                <div className="bg-green-500/50 p-4 rounded-2xl group-hover:bg-white group-hover:text-green-600 transition-all duration-300">
                  <Mail size={ 24 } />
                </div>
                <div>
                  <p className="text-green-200 text-sm font-medium">Email Address</p>
                  <p className="text-lg font-semibold">mudassir95255@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-5 group">
                <div className="bg-green-500/50 p-4 rounded-2xl group-hover:bg-white group-hover:text-green-600 transition-all duration-300">
                  <MapPin size={ 24 } />
                </div>
                <div>
                  <p className="text-green-200 text-sm font-medium">Location</p>
                  <p className="text-lg font-semibold">Adda Sheikhan, Chiniot, Pakistan</p>
                </div>
              </div>
            </div>
          </div>
          {/* Social Links */ }
          <div className="relative z-10 mt-12 flex space-x-4">
            { ['FB', 'IG', 'LI', 'TW'].map((social) => (
              <div key={ social } className="h-11 w-11 bg-green-500/50 rounded-xl flex items-center justify-center hover:bg-white hover:text-green-600 cursor-pointer transition-all duration-300 font-bold text-sm">
                { social }
              </div>
            )) }
          </div>
        </div>
        {/* Right Side: Contact Form */ }
        <div className="w-full md:w-7/12 p-10 lg:p-16 bg-white relative">
          { isSent && (
            <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <CheckCircle size={ 60 } className="text-green-600 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Message Sent!</h3>
              <p className="text-gray-600 text-center mt-2">Shukriya Mudassir, aapka message hamein mil gaya hai.</p>
            </div>
          ) }
          <form ref={ form } onSubmit={ sendEmail } className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Full Name</label>
                <input
                  name="name" // EmailJS template {{name}} ke liye
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all duration-200"
                  placeholder="Please Enter The Name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Email Address</label>
                <input
                  name="email" // EmailJS template {{email}} ke liye
                  type="email"
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all duration-200"
                  placeholder="ali@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Message</label>
                <textarea
                  name="message" // EmailJS template {{message}} ke liye
                  rows="5"
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all duration-200 resize-none"
                  placeholder="Enter the message you want to send"
                ></textarea>

              </div>

            </div>



            <button

              type="submit"

              disabled={ isSending }

              className={ `w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-3

                ${isSending ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-green-200 active:scale-95 text-white'}` }
            >
              { isSending ? (
                <>
                  <Loader2 className="animate-spin" size={ 20 } />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={ 20 } />
                </>
              ) }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ContactPage; 

