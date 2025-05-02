import { Link } from "wouter";
import { Axis3d } from "lucide-react";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope 
} from "react-icons/fa";
import { Newsletter } from "@/components/home/Newsletter";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <Axis3d className="h-8 w-8 text-primary mr-2" />
              <span className="font-heading font-bold text-xl">
                Maroc<span className="text-primary">Voyages</span>
              </span>
            </Link>
            <p className="text-gray-300 mb-4">
              Votre partenaire pour des expériences authentiques au Maroc. Découvrez, explorez et créez des souvenirs inoubliables.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-primary transition-colors">Accueil</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-300 hover:text-primary transition-colors">À propos de nous</a>
                </Link>
              </li>
              <li>
                <Link href="/tours">
                  <a className="text-gray-300 hover:text-primary transition-colors">Destinations</a>
                </Link>
              </li>
              <li>
                <Link href="/store">
                  <a className="text-gray-300 hover:text-primary transition-colors">Boutique artisanale</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-gray-300 hover:text-primary transition-colors">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/custom-request">
                  <a className="text-gray-300 hover:text-primary transition-colors">Sur Mesure</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Top destinations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tours?location=Marrakech">
                  <a className="text-gray-300 hover:text-primary transition-colors">Marrakech</a>
                </Link>
              </li>
              <li>
                <Link href="/tours?location=Fès">
                  <a className="text-gray-300 hover:text-primary transition-colors">Fès</a>
                </Link>
              </li>
              <li>
                <Link href="/tours?location=Chefchaouen">
                  <a className="text-gray-300 hover:text-primary transition-colors">Chefchaouen</a>
                </Link>
              </li>
              <li>
                <Link href="/tours?location=Merzouga">
                  <a className="text-gray-300 hover:text-primary transition-colors">Désert de Merzouga</a>
                </Link>
              </li>
              <li>
                <Link href="/tours?location=Essaouira">
                  <a className="text-gray-300 hover:text-primary transition-colors">Essaouira</a>
                </Link>
              </li>
              <li>
                <Link href="/tours?location=Atlas">
                  <a className="text-gray-300 hover:text-primary transition-colors">Atlas</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contactez-nous</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-2 text-primary" />
                <span className="text-gray-300">
                  123 Avenue Mohammed V, Marrakech, Maroc
                </span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-2 text-primary" />
                <span className="text-gray-300">+212 524 123 456</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-primary" />
                <span className="text-gray-300">info@marocvoyages.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <Newsletter />
        
        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} MarocVoyages. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <Link href="/terms">
              <a className="hover:text-primary transition-colors">Conditions générales</a>
            </Link>
            <Link href="/privacy">
              <a className="hover:text-primary transition-colors">Politique de confidentialité</a>
            </Link>
            <Link href="/legal">
              <a className="hover:text-primary transition-colors">Mentions légales</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
