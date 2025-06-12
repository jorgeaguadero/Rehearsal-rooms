function Footer() {
  return (
    <footer className="w-full bg-[#56df9e] text-black flex flex-col md:flex-row justify-between items-center px-6 py-4 fixed bottom-0 left-0 z-40 shadow-inner">
      <div className="flex items-center gap-2 mb-2 md:mb-0">
        <span className="font-semibold">
          &copy; {new Date().getFullYear()} Rehearsal Rooms
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <a href="mailto:jorgeaguaderodev@gmail.com" className="hover:underline">
          Contacto
        </a>

        <a
          href="https://www.linkedin.com/in/jorgeaguadero/"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}

export default Footer;
