import Image from "next/image";
import Link from "next/link";

const ContactPage = () => {
  return (
    <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 min-h-[70vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-600">We'd love to hear from you. Get in touch with our team.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        {/* Contact Form */}
        <div className="lg:w-2/3">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="youremail@example.com"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="How can we help you?"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-6 md:p-8 rounded-lg h-full">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Store Location</h3>
              <p className="text-gray-600">
                42 Cleopatra Street<br />
                Heliopolis, Cairo<br />
                Egypt
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Customer Support</h3>
              <p className="text-gray-600">
                Email: support@vistora.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Business Hours</h3>
              <p className="text-gray-600">
                Monday - Friday: 9am - 6pm<br />
                Saturday: 10am - 4pm<br />
                Sunday: Closed
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-black">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-black">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-black">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Find Us in Heliopolis, Cairo</h2>
        <div className="w-full h-[400px] bg-gray-100 rounded-lg relative overflow-hidden">
          {/* Google Maps iframe embedding Heliopolis, Cairo location */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27627.98553297524!2d31.335746899999997!3d30.089577099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e0145922073%3A0x9e21b1d0ee0ae8d9!2sHeliopolis%2C%20Cairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1683982164522!5m2!1sen!2sus" 
            className="absolute inset-0 w-full h-full" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
        <div className="mt-4 flex gap-4">
          <div className="bg-gray-50 p-4 rounded-lg flex-1">
            <h3 className="font-medium text-lg mb-2">Opening Hours</h3>
            <p className="text-gray-600">Monday-Friday: 9am-9pm</p>
            <p className="text-gray-600">Saturday-Sunday: 10am-7pm</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg flex-1">
            <h3 className="font-medium text-lg mb-2">Public Transport</h3>
            <p className="text-gray-600">Metro: Heliopolis Station</p>
            <p className="text-gray-600">Bus Routes: 173, 208, 356</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg flex-1">
            <h3 className="font-medium text-lg mb-2">Parking</h3>
            <p className="text-gray-600">Free customer parking available at our location</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              question: "What are your shipping policies?",
              answer: "We offer free shipping on all orders over $50. Standard shipping typically takes 3-5 business days, while express shipping delivers within 1-2 business days."
            },
            {
              question: "How can I track my order?",
              answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also sign in to your account to view your order status."
            },
            {
              question: "What is your return policy?",
              answer: "We accept returns within 30 days of purchase. Items must be in their original condition with tags attached. Please visit our Returns page for detailed instructions."
            },
            {
              question: "Do you ship internationally?",
              answer: "Yes, we ship to select countries internationally. Shipping rates and delivery times vary by location."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
