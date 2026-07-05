import React, { useEffect, useRef, useState } from 'react';
import Hero from '../components/Hero';
import ServicesGrid from '../components/ServicesGrid';
import HowItWorks from '../components/HowItWorks';
import Faq from '../components/Faq';
import BookingDialog from '../components/BookingDialog';
import { SERVICES } from '../mock';
import { fetchServices } from '../lib/api';

export default function HomePage() {
  const [services, setServices] = useState(SERVICES);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const servicesRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchServices()
      .then((d) => {
        if (!cancelled && Array.isArray(d) && d.length) setServices(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onBook = (svc) => {
    setSelected(svc);
    setOpen(true);
  };

  return (
    <>
      <Hero onPrimary={scrollToServices} />
      <div ref={servicesRef}>
        <ServicesGrid services={services} onBook={onBook} />
      </div>
      <HowItWorks />
      <Faq />
      <BookingDialog service={selected} open={open} onOpenChange={setOpen} />
    </>
  );
}
