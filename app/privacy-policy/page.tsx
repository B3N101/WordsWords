import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MX Words Words | Policy",
  description: "MX Words Words Privacy Policy",
};

export default function PolicyPage() {
  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Our Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
        <p>
          We respect your privacy and are committed to protecting your personal
          data. This privacy policy will inform you about how we look after your
          personal data and tell you about your privacy rights and how the law
          protects you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
        <p>
          By accessing our website, you are agreeing to be bound by these terms
          of service, all applicable laws and regulations, and agree that you
          are responsible for compliance with any applicable local laws.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Cookie Policy</h2>
        <p>
          Our website uses cookies to enhance your browsing experience. By
          continuing to use our site, you agree to our use of cookies in
          accordance with our Cookie Policy.
        </p>
      </section>
    </main>
  );
}
