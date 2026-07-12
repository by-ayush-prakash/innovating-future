import React from "react";
import { ScrollReveal } from "./components/ScrollReveal";

export function Privacy() {
  const paragraphs = [
    "The Center for Innovating the Future (CIF) respects your privacy and is committed to protecting the personal information you share with us when visiting innovatingfuture.com.",
    "This Privacy Policy explains how we collect, use, and safeguard your information. By using our website, you consent to the data practices described in this statement.",
    "We may collect non-personally identifiable information, such as browser type, operating system, and website usage statistics, to help us understand how visitors use our site and to improve the overall user experience. This information is collected through the use of cookies and similar tracking technologies.",
    "If you choose to contact us or subscribe to our communications, we may collect personal information such as your name and email address. We use this information solely to respond to your inquiries and provide the requested services.",
    "CIF does not sell, rent, or lease its customer lists or personal information to third parties. We may share data with trusted partners to help perform statistical analysis, send you email or postal mail, provide customer support, or arrange for deliveries. All such third parties are prohibited from using your personal information except to provide these services to CIF, and they are required to maintain the confidentiality of your information.",
    "Our website may contain links to other sites. Please be aware that we are not responsible for the content or privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of any other site that collects personally identifiable information.",
    "If you have any questions or concerns about our Privacy Policy or data practices, please contact us.",
  ];

  return (
    <main className="w-full flex-grow flex flex-col">
      <section className="w-full bg-white pt-[96px] md:pt-[120px] px-6 md:px-12 pb-16">
        <div className="max-w-[1100px] mx-auto flex flex-col">
          <div className="max-w-[800px] mx-auto flex flex-col space-y-6 items-center text-center mb-16">
            <h1 className="font-serif text-[40px] md:text-[48px] font-medium leading-tight text-ink text-balance">
              Privacy Policy
            </h1>
          </div>
          <div className="w-full h-px bg-[#D8D5CD]"></div>
        </div>
      </section>

      <ScrollReveal className="w-full py-[72px] px-6 md:px-12 flex-grow bg-paper">
        <div className="max-w-[800px] mx-auto flex flex-col space-y-12">
          <div className="space-y-8 text-[18px] md:text-[20px] text-ink/85 font-sans leading-relaxed text-justify">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="text-balance">
                {para}
              </p>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
