import Image from "next/image";
import Link from "next/link";
import FallbackImage from "@/components/FallbackImage";

const AboutPage = () => {
  return (
    <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 min-h-[70vh]">
      {/* Hero Section */}
      <div className="mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About Vistora</h1>
        <p className="text-gray-600 text-lg max-w-3xl">
          Delivering exceptional quality and style since 2015. We're passionate about providing
          our customers with the finest products and an unmatched shopping experience.
        </p>
      </div>

      {/* Our Story */}
      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Vistora began in 2015 in Heliopolis, Cairo with a simple vision: to create a premium online shopping destination where quality, style, and customer satisfaction would be the highest priority. What started as a small local boutique has grown into a trusted e-commerce brand that customers across Egypt and the Middle East return to time and again.
          </p>
          <p className="text-gray-600 mb-4">
            Our journey has been shaped by our commitment to sourcing only the finest products and building meaningful relationships with our customers. We believe that every online purchase should be seamless, secure, and satisfying - from browsing to delivery and beyond.
          </p>
          <p className="text-gray-600">
            Today, we continue to expand our digital presence and product offerings while maintaining the personalized touch that has defined Vistora from the beginning. We're not just an e-commerce platform – we're creating exceptional online shopping experiences and building a community of satisfied customers.
          </p>
        </div>
        <div className="lg:w-1/2 relative h-[400px] rounded-lg overflow-hidden">
          <FallbackImage 
            src="/e-commerce-store.jpg" 
            fallbackSrc="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop&q=60"
            alt="Our E-commerce Store" 
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition">
            <h3 className="text-xl font-medium mb-3">Quality</h3>
            <p className="text-gray-600">
              We never compromise on the quality of our products. Each item in our collection is carefully 
              selected to ensure it meets our high standards.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition">
            <h3 className="text-xl font-medium mb-3">Customer Focus</h3>
            <p className="text-gray-600">
              Our customers are at the heart of everything we do. We listen to your feedback and 
              continuously improve to better serve your needs.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition">
            <h3 className="text-xl font-medium mb-3">Sustainability</h3>
            <p className="text-gray-600">
              We're committed to sustainable practices and minimizing our environmental impact through 
              responsible sourcing and eco-friendly packaging.
            </p>
          </div>
        </div>
      </div>

      {/* Our E-commerce Approach */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">Our E-commerce Approach</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Curated Selection</h3>
            <p className="text-gray-600 mb-4">
              We meticulously select each product in our catalog, working directly with trusted suppliers and manufacturers to ensure that every item meets our stringent quality standards. Our team regularly reviews customer feedback to refine our offerings.
            </p>
            <div className="relative w-full h-48 rounded-lg overflow-hidden mt-6">
              <FallbackImage 
                src="/curated-selection.jpg" 
                fallbackSrc="https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&auto=format&fit=crop&q=60"
                alt="Curated Product Selection" 
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Digital Experience</h3>
            <p className="text-gray-600 mb-4">
              We've built our e-commerce platform with user experience as the top priority. Our website features intuitive navigation, detailed product information, secure payment processing, and responsive customer support to make online shopping effortless.
            </p>
            <div className="relative w-full h-48 rounded-lg overflow-hidden mt-6">
              <FallbackImage 
                src="/digital-experience.jpg" 
                fallbackSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60"
                alt="Digital Shopping Experience" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Customer Testimonials */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600 italic mb-4">"The website is so easy to navigate, and my order arrived faster than expected. The quality exceeded my expectations!"</p>
            <p className="font-medium">- Sarah M.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600 italic mb-4">"Their customer service is exceptional. When I had an issue with my order, they resolved it immediately. I'll definitely be shopping here again."</p>
            <p className="font-medium">- Ahmed K.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600 italic mb-4">"I love the product selection and competitive pricing. Vistora has become my go-to online store for all my shopping needs."</p>
            <p className="font-medium">- Layla H.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 p-8 rounded-xl text-center mb-12">
        <h2 className="text-2xl font-semibold mb-4">We'd Love to Hear From You</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Have questions or feedback? We're always eager to connect with our customers and hear your thoughts.
        </p>
        <Link href="/contact" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
