
// Refactor HeroSection to use smaller components
import React, { useState } from 'react';
import HeroBanner from './HeroBanner';
import SearchBar from './SearchBar';
import SearchDialog from './SearchDialog';

const HeroSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative mb-8">
      <HeroBanner />
      <SearchBar onOpen={() => setOpen(true)} />
      <SearchDialog open={open} setOpen={setOpen} />
    </section>
  );
};

export default HeroSection;
