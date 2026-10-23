import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Award, CheckCircle2, ChevronRight, ChevronLeft, ShieldAlert } from 'lucide-react';

const CategoryCards = ({ categories = [], onSelectCategory = null, selectedCategoryId = null }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback defaults if database is still loading
  const defaultCategories = [
    {
      _id: 'cat-21k',
      slug: '21k-timed',
      name: '21.1 KM — Half Marathon / Timed Ride',
      distanceKm: 21.1,
      timingType: 'TIMED',
      priceInr: 699,
      minAge: 18,
      description: 'Premier endurance challenge for seasoned cyclists along Salem scenic routes. Includes official RFID timing chip and podium eligibility.',
      benefitsIncluded: ['RFID Timing Chip', 'Finisher Medal', 'Event Jersey', 'E-Certificate', 'Breakfast', 'Goodie Bag']
    },
    {
      _id: 'cat-10k',
      slug: '10k-timed',
      name: '10 KM — Challenge Ride / Timed',
      distanceKm: 10.0,
      timingType: 'TIMED',
      priceInr: 499,
      minAge: 16,
      description: 'The sweet spot for fitness enthusiasts and intermediate riders. Test your speed and pacing with timing chip.',
      benefitsIncluded: ['RFID Timing Chip', 'Finisher Medal', 'Event T-Shirt', 'E-Certificate', 'Breakfast', 'Goodie Bag']
    },
    {
      _id: 'cat-5k',
      slug: '5k-fun-ride',
      name: '5 KM — Community Fun Ride',
      distanceKm: 5.0,
      timingType: 'NON_TIMED',
      priceInr: 349,
      minAge: 12,
      description: 'Open community fun ride for families, beginners, and young riders. Celebrate fitness, green mobility, and pure joy.',
      benefitsIncluded: ['Finisher Medal', 'Event T-Shirt', 'Participation Certificate', 'Breakfast', 'Goodie Bag']
    }
  ];

  const items = categories && categories.length > 0 ? categories : defaultCategories;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      {/* Editorial Header matching Melanie Hay reference */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 pb-4 border-b border-[rgba(29,30,32,0.08)]">
        <div>
          <span className="tracking-luxury text-xs text-[#C59A5A]">
            CHOOSE YOUR CHALLENGE
          </span>
          <h2 className="headline-editorial text-3xl md:text-5xl mt-2 text-[#1D1E20]">
            Registration <em>Categories</em>
          </h2>
        </div>

        {/* Circular Carousel Controls (as in the reference image) */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={handlePrev}
            className="btn-circle-nav"
            title="Previous category"
            aria-label="Previous category"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="btn-circle-nav"
            title="Next category"
            aria-label="Next category"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid-responsive-1-2-3">
        {items.map((cat, idx) => {
          const isSelected = Boolean(
            selectedCategoryId && (
              selectedCategoryId === cat._id ||
              selectedCategoryId === cat.slug ||
              selectedCategoryId === cat.code ||
              (cat.distanceKm && String(cat.distanceKm) === String(selectedCategoryId))
            )
          );
          const isHighlighted = idx === 0; // 21.1KM highlighted

          return (
            <div
              key={cat._id || cat.slug}
              className={`editorial-frame flex flex-col justify-between p-8 md:p-10 transition-all duration-300 relative ${
                isSelected
                  ? 'ring-2 ring-[#C59A5A] shadow-2xl bg-[#0E1014] text-[#FAF7F2]'
                  : 'bg-white hover:border-[#C59A5A]'
              }`}
              style={{
                borderRadius: '4px',
                border: isSelected ? '2px solid #C59A5A' : '1px solid rgba(29, 30, 32, 0.08)',
                boxShadow: isSelected
                  ? '0 16px 36px rgba(0, 0, 0, 0.4), 0 0 20px rgba(197, 154, 90, 0.25)'
                  : undefined
              }}
            >
              {/* Highlight Badge */}
              {isHighlighted && !isSelected && (
                <div
                  className="absolute -top-3 left-8 px-3 py-1 bg-[#1D1E20] text-[#FAF7F2] text-[10px] font-semibold tracking-luxury uppercase"
                  style={{ letterSpacing: '0.2em' }}
                >
                  Featured Endurance
                </div>
              )}
              {isSelected && (
                <div
                  className="absolute -top-3 left-8 px-3 py-1 bg-[#C59A5A] text-[#0E1014] text-[10px] font-bold tracking-luxury uppercase"
                  style={{ letterSpacing: '0.2em' }}
                >
                  Selected Pass ✓
                </div>
              )}

              <div>
                {/* Distance & Timing Type */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-4xl md:text-5xl font-serif ${isSelected ? 'text-[#FAF7F2]' : 'text-[#1D1E20]'}`}>
                    {cat.distanceKm} <span className="text-xl font-sans">KM</span>
                  </span>
                  <span
                    className={`px-3 py-1 text-[10px] tracking-wider uppercase font-semibold rounded-full border ${
                      isSelected
                        ? cat.timingType === 'TIMED'
                          ? 'bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/40'
                          : 'bg-blue-400/20 text-blue-300 border-blue-400/40'
                        : cat.timingType === 'TIMED'
                        ? 'bg-[#155E47]/10 text-[#155E47] border-[#155E47]/20'
                        : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                    }`}
                  >
                    {cat.timingType === 'TIMED' ? 'Timed Chip' : 'Open Ride'}
                  </span>
                </div>

                {/* Category Title */}
                <h3 className={`font-heading text-xl md:text-2xl mb-3 ${isSelected ? 'text-[#FAF7F2]' : 'text-[#1D1E20]'}`}>
                  {cat.name}
                </h3>

                {/* Price Display */}
                <div className={`mb-6 pb-6 border-b flex items-baseline gap-2 ${isSelected ? 'border-white/10' : 'border-[rgba(29,30,32,0.06)]'}`}>
                  <span className={`text-3xl font-serif font-semibold ${isSelected ? 'text-[#F3BA63]' : 'text-[#1D1E20]'}`}>
                    ₹{cat.priceInr}
                  </span>
                  <span className={`text-xs uppercase tracking-wider ${isSelected ? 'text-[#A0A4AC]' : 'text-[#64666B]'}`}>
                    per participant
                  </span>
                </div>

                {/* Description */}
                <p className={`text-xs leading-relaxed mb-6 font-sans ${isSelected ? 'text-[#C0C4CC]' : 'text-[#64666B]'}`}>
                  {cat.description}
                </p>

                {/* Age Eligibility & Minor Rule */}
                <div className={`flex items-center gap-2 mb-6 p-3 rounded-sm text-xs ${isSelected ? 'bg-white/10 text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#1D1E20]'}`}>
                  <ShieldAlert size={16} className="text-[#C59A5A] shrink-0" />
                  <span>
                    Minimum Age: <strong>{cat.minAge} Years</strong>{' '}
                    {cat.minAge < 18 ? '(Guardian consent under 18)' : '(Strictly 18+)'}
                  </span>
                </div>

                {/* Benefits Included List */}
                <div className="space-y-2 mb-8">
                  <span className={`text-[10px] tracking-[0.2em] uppercase font-semibold block mb-2 ${isSelected ? 'text-[#C59A5A]' : 'text-[#8B8E96]'}`}>
                    Kit & Benefits:
                  </span>
                  {(cat.benefitsIncluded || ['Finisher Medal', 'Breakfast', 'Certificate']).map((b) => (
                    <div key={b} className={`flex items-center gap-2 text-xs ${isSelected ? 'text-[#FAF7F2]' : 'text-[#2D3036]'}`}>
                      <CheckCircle2 size={14} className={isSelected ? 'text-[#C59A5A] shrink-0' : 'text-[#155E47] shrink-0'} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {onSelectCategory ? (
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={`w-full py-3.5 px-4 text-xs font-semibold tracking-luxury uppercase transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-[#C59A5A] text-white border border-[#C59A5A]'
                      : 'bg-[#1D1E20] text-white hover:bg-[#C59A5A] border border-[#1D1E20]'
                  }`}
                >
                  <span>{isSelected ? 'Category Selected ✓' : 'Select Category'}</span>
                </button>
              ) : (
                <Link
                  to={`/register?category=${cat.slug || cat._id}`}
                  className="w-full py-3.5 px-4 text-xs font-semibold tracking-luxury uppercase transition-all flex items-center justify-center gap-2 bg-[#1D1E20] text-white hover:bg-[#C59A5A] no-underline"
                  style={{ textDecoration: 'none' }}
                >
                  <span>Register for {cat.distanceKm} KM</span>
                  <ChevronRight size={14} />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCards;
