import { FiPhone, FiMail } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";

function Contact() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center bg-gray-800 text-white">
        {/* hero */}
        <div className="relative w-full overflow-hidden p-10 md:p-16 lg:p-20">
          <img
            src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778574440/rccgy/banner3_d7azba.jpg"
            alt="RCCGY banner"
            className="absolute inset-0 h-full w-full object-cover object-[50%_62%]"
          />

          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* content */}
          <div className="relative h-full z-10 flex flex-col items-center justify-center text-center gap-3">
            <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-wide">CONTACT US</h1>
          </div>
        </div>

        {/* contact + location */}
        <section className="w-full xl:w-4/5 px-8 md:px-16 lg:px-24 py-12 flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* contact methods stacked */}
            <div className="flex-1 bg-gray-900/60 backdrop-blur border border-white/5 rounded-xl p-6 shadow-lg flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">Contact</h2>
              <p className="text-lg text-white/90 max-w-3xl">
                Reach out for runs, collabs, or questions. We&apos;ll get back to you soon.
              </p>
              <p className="text-white/80 text-sm">Reach us via phone, email, or Facebook.</p>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-black/20 p-3 shadow-lg shadow-black/30">
                  <span className="text-sm text-white/70">Phone</span>
                  <a
                    href="tel:+639123456789"
                    className="inline-flex items-center gap-2 text-white font-semibold transition duration-200 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  >
                    <FiPhone className="text-secondary" />
                    <span>+63 912 345 6789</span>
                  </a>
                </div>

                <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-black/20 p-3 shadow-lg shadow-black/30">
                  <span className="text-sm text-white/70">Email</span>
                  <a
                    href="mailto:rannncrewcgy@gmail.com"
                    className="inline-flex items-center gap-2 text-white font-semibold transition duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <FiMail className="text-primary" />
                    <span>rannncrewcgy@gmail.com</span>
                  </a>
                </div>

                <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-black/20 p-3 shadow-lg shadow-black/30">
                  <span className="text-sm text-white/70">Facebook</span>
                  <a
                    href="https://www.facebook.com/profile.php?id=61565994238694"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white font-semibold transition duration-200 hover:text-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                  >
                    <FaFacebook className="text-blue-400" />
                    <span>Message on Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            {/* location & map */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-gray-900/60 backdrop-blur border border-white/5 rounded-xl p-6 shadow-lg flex flex-col gap-3">
                <h3 className="text-2xl font-semibold">Visit Us</h3>
                <p className="text-white/80 text-sm">
                  Puntod Boulevard, Cagayan de Oro City
                </p>
                <a
                  href="https://www.google.com/maps/place/8.495258,124.652099"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white text-black font-semibold transition duration-200 hover:scale-105 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Open in Google Maps
                </a>
              </div>

              <div className="w-full rounded-xl overflow-hidden shadow-xl border border-white/5">
                <div className="relative w-full h-72 md:h-96">
                  <iframe
                    title="RCCGY location on Google Maps"
                    src="https://www.google.com/maps?q=8.495258,124.652099&z=16&output=embed"
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Contact;
