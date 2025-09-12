import { JSX } from "react";

function Footer(): JSX.Element {
  return (
    <footer className="relative mt-auto">
      {/* Gradient fade effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
      
      <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            
            {/* Brand section - Left */}
            <div className="text-center md:text-left md:flex-1">
              <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                Taste Tokyo
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Discover authentic Tokyo flavors and hidden culinary gems throughout the city.
              </p>
            </div>

            {/* Quick links - Right */}
            <div className="text-center md:text-right">
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2">
                <a href="#map-section" className="block text-slate-400 hover:text-blue-300 transition-colors duration-200 text-sm">
                  Restaurant Map
                </a>
                <a href="#list-section" className="block text-slate-400 hover:text-blue-300 transition-colors duration-200 text-sm">
                  Full List
                </a>
                <a href="#about" className="block text-slate-400 hover:text-blue-300 transition-colors duration-200 text-sm">
                  About Us
                </a>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-6 border-t border-slate-700/30">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              
              {/* Copyright */}
              <div className="text-slate-400 text-sm">
                © {new Date().getFullYear()} Taste Tokyo. All rights reserved.
              </div>

              {/* Legal links */}
              <div className="flex space-x-6 text-xs">
                <a href="#privacy" className="text-slate-400 hover:text-blue-300 transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#terms" className="text-slate-400 hover:text-blue-300 transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#contact" className="text-slate-400 hover:text-blue-300 transition-colors duration-200">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;