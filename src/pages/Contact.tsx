function Contact() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col bg-gray-800">
        <div className="relative w-full overflow-hidden p-10 md:p-15">
          
          <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778574440/rccgy/banner3_d7azba.jpg" alt="Banner" className="absolute inset-0 h-full w-full object-cover object-[50%_62%]" />
          
          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          { /* content */ }
          <div className="relative h-full z-10 flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-bold font-mono">CONTACT US</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
