import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
        
        <div className="text-gray-600 space-y-4 leading-relaxed">
          <p>
            Welcome to our Task Management System. By accessing or using our application, you agree to be bound by these Terms and Conditions.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">1. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">2. Acceptable Use</h2>
          <p>
            You agree not to use the application for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You must not upload or distribute any malicious code or content that infringes on the rights of others.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">3. Data Privacy</h2>
          <p>
            We respect your privacy and are committed to protecting your personal data. Your use of the application is also governed by our Privacy Policy, which outlines how we collect, use, and safeguard your information.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">4. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account at our sole discretion, without prior notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users of the application, us, or third parties, or for any other reason.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">5. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. We will notify you of any significant changes by posting the new terms on the application. Your continued use of the application after such modifications constitutes your acknowledgment and acceptance of the modified terms.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                window.close();
                navigate('/register');
              }
            }}
            className="px-6 py-2.5 bg-[#4285F4] text-white font-medium rounded-full shadow-sm hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
