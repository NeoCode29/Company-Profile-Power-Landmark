// app/terms/page.js

export const metadata = {
    title: 'Terms and Conditions - CV POWER LANDMARK',
    description:
      'Terms and Conditions for services including architectural design, private home construction, private villa development, and renovation services.',
  };
  
  export default function TermsPage() {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
          {/* Header */}
          <header className="border-b border-gray-200 py-6 px-8">
            <h1 className="text-center text-4xl font-bold text-gray-800">
              Terms and Conditions
            </h1>
            <p className="text-center text-lg text-gray-600 mt-2">CV POWER LANDMARK</p>
          </header>
  
          {/* Konten */}
          <article className="p-8 text-gray-800">
            <div className="space-y-8">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p
                  className="text-gray-600 text-base"
                  style={{ textAlign: 'justify' }}
                >
                  By using the services of POWER LANDMARK — which include architectural design, private home construction, private villa development, and renovation services — you agree to be bound by the following Terms and Conditions. Every customer must comply with the agreed contractual terms.
                </p>
              </section>
  
              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Ordering Process and Negotiation</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 text-base">
                  <li>
                    <span className="font-semibold">Initial Negotiation:</span> Customers must contact the admin via chat to negotiate and reach an agreement on the desired services.
                  </li>
                  <li>
                    <span className="font-semibold">Order Code:</span> Once an agreement is reached, the admin will provide a unique order code for reference during the payment process.
                  </li>
                  <li>
                    <span className="font-semibold">Compliance:</span> Customers are required to adhere to all agreed terms and conditions throughout the ordering and service process.
                  </li>
                </ul>
              </section>
  
              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Payment Policy</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 text-base">
                  <li>
                    <span className="font-semibold">Payment Deadline:</span> Payment must be completed within 30 minutes after submitting the payment request. Failure to do so will result in cancellation of the order.
                  </li>
                  <li>
                    <span className="font-semibold">Payment Method:</span> Payments can be made in full or via a down payment (DP) as agreed.
                  </li>
                  <li>
                    <span className="font-semibold">Design Submission:</span> Upon receipt of payment, the design will be submitted within 10 days from the payment date.
                  </li>
                </ul>
              </section>
  
              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Delivery Policy</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 text-base">
                  <li>
                    <span className="font-semibold">Service Commencement:</span> Execution of the service begins only after the customer approves the submitted design.
                  </li>
                  <li>
                    <span className="font-semibold">Project Timeline:</span> The duration of the project will be adjusted based on the actual conditions of the property, as agreed.
                  </li>
                  <li>
                    <span className="font-semibold">Mailing Address:</span> Customers must provide the agreed mailing address for any necessary document deliveries or correspondence.
                  </li>
                  <li>
                    <span className="font-semibold">Project Updates:</span> A designated Person in Charge (PIC) will be assigned to provide regular project updates.
                  </li>
                </ul>
              </section>
  
              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Return/Refund Policy</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 text-base">
                  <li>
                    <span className="font-semibold">Order Cancellation:</span> Due to the customized nature of our services, cancellations must be submitted in writing to the admin.
                  </li>
                  <li>
                    <span className="font-semibold">Refund Before Project Commencement:</span> If a cancellation occurs before the project starts, a refund may be negotiated considering incurred costs and efforts.
                  </li>
                  <li>
                    <span className="font-semibold">Refund After Project Commencement:</span> Once the project has begun, refunds are generally not provided unless special circumstances arise and are mutually agreed upon.
                  </li>
                  <li>
                    <span className="font-semibold">Individual Resolution:</span> Each refund or cancellation request will be handled individually per the agreed terms.
                  </li>
                </ul>
              </section>
  
              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Customer Data Privacy Policy</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 text-base">
                  <li>
                    <span className="font-semibold">Data Collection and Use:</span> Personal data (e.g., name, contact details, negotiation information) will be used solely for order processing and service delivery.
                  </li>
                  <li>
                    <span className="font-semibold">Data Security:</span> We are committed to maintaining high standards of data security and confidentiality.
                  </li>
                  <li>
                    <span className="font-semibold">Third-Party Disclosure:</span> Customer data will not be shared with any third party without explicit consent unless required by law.
                  </li>
                  <li>
                    <span className="font-semibold">Customer Rights:</span> Customers have the right to access, correct, or request deletion of their personal data in accordance with our privacy policy.
                  </li>
                </ul>
              </section>
  
              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Security Capabilities and Policy for Transmission of Payment Card Details</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 text-base">
                  <li>
                    <span className="font-semibold">Secure Transmission:</span> All payment transactions are processed via a secure payment gateway employing current encryption technologies (e.g., PCI DSS) to protect card details.
                  </li>
                  <li>
                    <span className="font-semibold">No Sensitive Data Storage:</span> We do not store full payment card details on our systems post-transaction.
                  </li>
                  <li>
                    <span className="font-semibold">Industry Compliance:</span> The payment gateway complies with industry security standards to ensure transaction data integrity.
                  </li>
                </ul>
              </section>
  
              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Additional Terms</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 text-base">
                  <li>
                    <span className="font-semibold">Contract Amendments:</span> Any matters not covered in the initial agreement will be addressed through an addendum as mutually agreed.
                  </li>
                  <li>
                    <span className="font-semibold">Changes and Updates:</span> These Terms and Conditions may be amended or updated at any time, with changes communicated via our website or official channels.
                  </li>
                  <li>
                    <span className="font-semibold">Dispute Resolution:</span> Disputes will be resolved through amicable discussions or, if necessary, through legal channels as per applicable laws.
                  </li>
                </ul>
              </section>
  
              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
                <p
                  className="text-gray-600 text-base"
                  style={{ textAlign: 'justify' }}
                >
                  For any questions or clarifications regarding these Terms and Conditions, please contact our admin through the contact information provided on our website.
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
    );
  }
  