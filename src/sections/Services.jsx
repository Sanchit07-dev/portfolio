import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ServiceCard from '../components/ServiceCard.jsx';
import { services } from '../data/services.js';
import Button from '../components/Button.jsx';

export default function Services() {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="section-padding bg-white border-b border-neutral-200/80">
      <div className="section-wrapper">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <span className="section-badge mb-4">Freelance Services</span>
            <h2 className="section-heading">
              Custom Development Services for{' '}
              <span className="text-orange-500">Modern Businesses</span>.
            </h2>
            <p className="section-subheading">
              From marketing sites to complete web applications with auth and databases — I engineer reliable solutions tailored to your operational needs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              href="#contact"
              onClick={e => handleNavClick(e, '#contact')}
              size="md"
            >
              Discuss Your Project
              <ArrowRight size={15} />
            </Button>
          </motion.div>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
