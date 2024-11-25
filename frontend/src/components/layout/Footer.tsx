export default function Footer() {
  return (
    <footer className="bg-belgian-black text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Belgian Driving App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}