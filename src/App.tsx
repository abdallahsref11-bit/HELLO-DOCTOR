import { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  startOfToday, 
  isSameDay, 
  isPast, 
  parse, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  isToday 
} from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Stethoscope, 
  Syringe, 
  Scissors, 
  HeartPulse, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { BUSINESS_HOURS, SERVICES, REVIEWS } from './constants';
import Preloader from './components/Preloader';

// --- Mock Data Helpers ---
const getMockAvailability = (date: Date) => {
  const day = getDay(date);
  if (day === 0) return false; // Sunday busy
  if (day === 6) return Math.random() > 0.4;
  return Math.random() > 0.2;
};

// --- Components ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success'>('idle');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Give the preloader time to shine
    return () => clearTimeout(timer);
  }, []);

  // Dynamic Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine Clinic Status
  const clinicStatus = useMemo(() => {
    const dayName = format(currentTime, 'eeee').toLowerCase() as keyof typeof BUSINESS_HOURS;
    const hours = BUSINESS_HOURS[dayName];
    const nowStr = format(currentTime, 'HH:mm');
    
    if (!hours) return { isOpen: false, todayHours: { open: '09:00', close: '21:00' }, nextOpening: '09:00' };
    
    const isOpen = nowStr >= hours.open && nowStr <= hours.close;
    
    return {
      isOpen,
      todayHours: hours,
      nextOpening: hours.open
    };
  }, [currentTime]);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    setBookingStatus('booking');
    setTimeout(() => {
      setBookingStatus('success');
      const whatsappMsg = `Hi Klinik Hello Doctor, I would like to book an appointment for ${format(selectedDate, 'dd MMM yyyy')} at ${selectedTime}.`;
      window.open(`https://wa.me/60123456789?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
      
      // Reset after some time
      setTimeout(() => setBookingStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader key="preloader" onLoadingComplete={() => window.scrollTo(0, 0)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 bg-pattern">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
              <Stethoscope className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">HELLO DOCTOR</h1>
              <p className="text-[10px] tracking-widest text-slate-500 uppercase font-bold">Desa Mentari</p>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#booking" className="hover:text-blue-600 transition-colors">Booking</a>
            <a href="#hours" className="hover:text-blue-600 transition-colors">Hours</a>
            <a href="#contact" className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-100">Contact Us</a>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-800">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 md:pt-48 md:pb-32 bg-gradient-to-b from-blue-50/50 to-transparent overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              REAL-TIME UPDATES: {format(currentTime, 'do MMMM yyyy')}
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-[1.1] mb-6">
              Your Trusted Family Clinic in <span className="text-blue-600 underline decoration-blue-200 underline-offset-8 italic">Petaling Jaya</span>
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
              Providing professional, friendly, and exceptional healthcare for the Desa Mentari community with minimal waiting times.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="#booking" 
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-100"
              >
                <CalendarIcon className="w-5 h-5" />
                Book Appointment
              </a>
              <a 
                href="tel:+60378770000"
                className="px-8 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-800 rounded-2xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-sm"
              >
                <Phone className="w-5 h-5 text-blue-600" />
                Call Now
              </a>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/doctor_face_${i}/100/100`} className="w-14 h-14 rounded-full border-4 border-white shadow-sm object-cover" referrerPolicy="no-referrer" alt="Patient" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  <span className="font-bold ml-1 text-slate-800">4.9/5</span>
                </div>
                <p className="text-sm text-slate-500">Based on Google Reviews</p>
              </div>
            </div>
          </motion.div>

          {/* ... status card ... */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block relative"
          >
            <div className="absolute inset-0 bg-blue-400/10 blur-[120px] rounded-full" />
            <div className="relative glass rounded-[48px] p-10 shadow-2xl border-white/40">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Clinic Status</p>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full animate-pulse", clinicStatus.isOpen ? "bg-emerald-500" : "bg-rose-500")} />
                    <span className="text-2xl font-bold text-slate-800">{clinicStatus.isOpen ? 'Open Now' : 'Closed'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Local Time</p>
                  <p className="text-2xl font-mono font-bold text-slate-800 tracking-tight">{format(currentTime, 'HH:mm:ss')}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      Peak Hours Analysis
                    </h3>
                    <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">LIVE</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-blue-500 w-[65%]" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>QUIET</span>
                    <span>MODERATE</span>
                    <span>BUSY</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/80 backdrop-blur-sm rounded-2xl border border-emerald-100 text-emerald-800 text-xs flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Sanitized & Safe
                  </div>
                  <div className="p-4 bg-orange-50/80 backdrop-blur-sm rounded-2xl border border-orange-100 text-orange-800 text-xs flex items-center gap-3">
                    <Clock className="w-4 h-4 shrink-0" /> Fast Turnaround
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-blue-600 tracking-[0.2em] uppercase mb-4">Our Services</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">Expert Local Selection</h3>
            </div>
            <p className="text-slate-500 md:mb-6 max-w-sm border-l-2 border-blue-600 pl-6 text-sm">Providing standard clinic procedures with professional excellence and localized care.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service, i) => (
              <motion.div 
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col bg-white/60 backdrop-blur-sm p-10 rounded-[48px] border border-white shadow-soft hover:shadow-xl hover:bg-white transition-all duration-500 h-full"
              >
                <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center mb-10 transition-all duration-300">
                  <div className="text-blue-600 group-hover:text-white transition-colors">
                    {service.icon === 'Stethoscope' && <Stethoscope className="w-8 h-8" />}
                    {service.icon === 'Syringe' && <Syringe className="w-8 h-8" />}
                    {service.icon === 'Scissors' && <Scissors className="w-8 h-8" />}
                    {service.icon === 'HeartPulse' && <HeartPulse className="w-8 h-8" />}
                  </div>
                </div>
                <h4 className="text-2xl font-serif font-bold text-slate-800 mb-4">{service.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">{service.description}</p>
                
                <div className="mt-auto flex flex-wrap gap-2">
                  {service.features?.map((feature) => (
                    <span key={feature} className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking & Calendar Section */}
      <section id="booking" className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-sm font-bold text-blue-600 tracking-[0.2em] uppercase mb-4">Availability</h2>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">Live Appointment Scheduler</h3>
                <p className="text-slate-500 max-w-xl text-sm leading-relaxed">Choose a date to see available time slots. Green dots indicate high availability days.</p>
              </div>
              <Calendar 
                selected={selectedDate} 
                onSelect={setSelectedDate} 
              />
            </div>
            
            <div className="lg:col-span-5 pt-12">
              <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-2xl border border-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                      <Clock className="text-white w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg uppercase tracking-tight">Select Time</h4>
                      <p className="text-xs text-slate-400 font-bold tracking-widest leading-none mt-1 uppercase italic">Limited slots today</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
                    {['09:00', '10:30', '11:15', '14:00', '15:30', '16:45', '18:00', '19:30', '20:15'].map(time => {
                      const isPastSlot = isToday(selectedDate) && time < format(currentTime, 'HH:mm');
                      return (
                        <button 
                          key={time}
                          disabled={isPastSlot}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-4 rounded-2xl font-bold text-sm transition-all border",
                            isPastSlot ? "opacity-20 cursor-not-allowed bg-slate-50 border-slate-100" :
                            selectedTime === time 
                              ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200 -translate-y-1" 
                              : "bg-white text-slate-600 border-slate-100 hover:border-blue-300 hover:text-blue-600"
                          )}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium">Selected Date</span>
                      <span className="font-bold text-slate-800">{format(selectedDate, 'eee, do MMM')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium">Preferred Time</span>
                      <span className={cn("font-bold", selectedTime ? "text-blue-600" : "text-slate-300 italic")}>
                        {selectedTime || 'Wait for selection'}
                      </span>
                    </div>
                  </div>

                  <button 
                    disabled={!selectedTime || bookingStatus === 'booking'}
                    onClick={handleBooking}
                    className={cn(
                      "w-full py-5 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all text-base",
                      !selectedTime 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                        : (bookingStatus === 'success' ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-200")
                    )}
                  >
                    {bookingStatus === 'idle' && (
                      <>
                        <MessageCircle className="w-5 h-5" />
                        Book via WhatsApp
                      </>
                    )}
                    {bookingStatus === 'booking' && (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    )}
                    {bookingStatus === 'success' && (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Redirecting...
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-bold mt-6 uppercase tracking-widest">No upfront payment required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-1 mb-6">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">Trusted by the Community</h3>
            <p className="text-slate-500 max-w-2xl mx-auto italic text-lg line-clamp-2">"Klinik Hello Doctor has been our family's first choice for years. The environment is always pristine."</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((review, i) => (
              <motion.div 
                key={review.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed mb-8">"{review.comment}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-blue-600 text-sm shadow-sm ring-4 ring-white">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">{review.name}</h5>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Verified Patient</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours Table Section */}
      <section id="hours" className="py-24 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-xs font-bold text-blue-400 tracking-[0.3em] uppercase mb-6">Clinic Dynamics</h2>
              <h3 className="text-4xl md:text-6xl font-serif font-bold text-white mb-10 leading-tight">Weekly Opening Hours</h3>
              <div className="space-y-3">
                {(Object.entries(BUSINESS_HOURS) as [keyof typeof BUSINESS_HOURS, typeof BUSINESS_HOURS.monday][]).map(([day, hours]) => {
                  const isCurToday = format(currentTime, 'eeee').toLowerCase() === day;
                  return (
                    <motion.div 
                      key={day} 
                      whileHover={{ x: 10 }}
                      className={cn(
                        "flex items-center justify-between p-6 rounded-3xl transition-all border",
                        isCurToday ? "bg-white text-slate-900 border-white shadow-2xl scale-[1.05]" : "bg-slate-800/50 text-slate-400 border-transparent hover:border-slate-700"
                      )}
                    >
                      <span className="font-bold capitalize text-lg">{day}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold tracking-tight">{hours.open} AM — {hours.close} PM</span>
                        {isCurToday && <span className="text-[9px] bg-blue-600 text-white px-3 py-1 rounded-full font-bold uppercase animate-pulse">TODAY</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="relative aspect-square md:aspect-auto md:h-[600px] flex items-center">
              <div className="absolute inset-0 bg-blue-600/20 blur-[150px] rounded-full animate-slow-pulse" />
              <div className="relative glass border-white/5 p-12 rounded-[64px] shadow-2xl">
                <div className="flex items-center gap-4 mb-12">
                   <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center">
                     <Info className="w-8 h-8 text-white" />
                   </div>
                   <div>
                     <h4 className="text-2xl font-serif font-bold">Expert Note</h4>
                     <p className="text-slate-400 text-sm">Advice from Dr. Hello</p>
                   </div>
                </div>
                <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed mb-12 italic border-l-4 border-blue-500 pl-8">
                  "Health is your greatest wealth. We prioritize hygiene, empathy, and speed to help you get back on your feet quickly."
                </p>
                <div className="flex items-center gap-6">
                  <img src="https://picsum.photos/seed/doc/100/100" className="w-20 h-20 rounded-[28px] object-cover ring-4 ring-slate-800" referrerPolicy="no-referrer" alt="Doctor" />
                  <div>
                    <h5 className="text-xl font-bold">Dr. Hello Doctor</h5>
                    <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Medical Director</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
           <div className="grid lg:grid-cols-3 gap-8">
             <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-50 p-10 rounded-[48px] border border-slate-100 h-full">
                  <h4 className="text-3xl font-serif font-bold text-slate-900 mb-8 leading-tight">Visit Us at <br />Desa Mentari</h4>
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                        <MapPin className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Our Location</p>
                        <p className="text-slate-800 text-sm font-medium leading-relaxed">Blok 6, Desa Mentari, PJS 6, 46000 Petaling Jaya, Selangor, Malaysia</p>
                        <a href="https://maps.google.com" className="text-blue-600 text-xs font-bold uppercase tracking-widest mt-2 block hover:underline">Get Directions</a>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                        <Phone className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Office</p>
                        <p className="text-slate-800 text-lg font-bold">+60 3-7877 ####</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                        <MessageCircle className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp Support</p>
                        <p className="text-slate-800 text-lg font-bold">+60 12-345 6789</p>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
             
             <div className="lg:col-span-2">
                <div className="rounded-[48px] overflow-hidden shadow-2xl h-[600px] border-[12px] border-white relative group">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15935.592186835252!2d101.62123!3d3.08234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4ba7a9991277%3A0xc3191393661fff2d!2sDesa%20Mentari!5e0!3m2!1sen!2smy!4v1713589000000!5m2!1sen!2smy" 
                    className="w-full h-full grayscale-[40%] group-hover:grayscale-0 transition-all duration-700"
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute bottom-8 left-8">
                     <div className="bg-white px-6 py-4 rounded-3xl shadow-xl flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
                         <MapPin className="text-white" />
                       </div>
                       <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">PJ Office</p>
                         <p className="text-sm font-bold text-slate-800">Desa Mentari, Selangor</p>
                       </div>
                     </div>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-24 px-4 overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/40">
                    <Stethoscope className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Klinik Hello Doctor</h2>
                    <p className="text-[10px] tracking-[0.3em] text-blue-400 uppercase font-black">Trusted since 2015</p>
                  </div>
                </div>
                <p className="text-slate-400 max-w-sm text-base leading-relaxed">
                  Dedicated to providing Petaling Jaya with elite medical care that bridges the gap between technology and traditional empathy.
                </p>
            </div>
            
            <div>
              <h5 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Explore</h5>
              <div className="flex flex-col gap-4 text-slate-500 text-sm">
                <a href="#services" className="hover:text-blue-400 transition-colors">Services Directory</a>
                <a href="#booking" className="hover:text-blue-400 transition-colors">Live Schedule</a>
                <a href="#hours" className="hover:text-blue-400 transition-colors">Weekly Timeline</a>
                <a href="#contact" className="hover:text-blue-400 transition-colors">Contact Support</a>
              </div>
            </div>

            <div>
              <h5 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Stay Connected</h5>
              <div className="flex flex-col gap-4 text-slate-500 text-sm font-bold">
                <a href="mailto:info@hellodoctor.my" className="hover:text-blue-400 transition-colors">info@hellodoctor.my</a>
                <p className="text-slate-600 text-xs mt-4">FOLLOW US ON SOCIALS</p>
                <div className="flex gap-4">
                  {['Facebook', 'Instagram', 'Twitter'].map(os => (
                    <div key={os} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer">
                      <div className="w-3 h-3 bg-white/20 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-slate-600 text-[10px] tracking-[0.4em] font-black uppercase">© 2026 HELLO DOCTOR MEDICAL GROUP</p>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
               <a href="#" className="hover:text-slate-400 transition-colors">Safety</a>
               <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
               <a href="#" className="hover:text-slate-400 transition-colors">Complaints</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col p-8 pt-24"
          >
            <div className="space-y-8">
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-5xl font-serif font-black block text-slate-900">Services</a>
              <a href="#booking" onClick={() => setIsMenuOpen(false)} className="text-5xl font-serif font-black block text-slate-900">Booking</a>
              <a href="#hours" onClick={() => setIsMenuOpen(false)} className="text-5xl font-serif font-black block text-slate-900">Hours</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-5xl font-serif font-black block text-slate-900">Contact</a>
            </div>
            <div className="mt-auto">
              <div className="p-8 bg-blue-600 rounded-[32px] text-white">
                <p className="text-xs font-bold tracking-widest uppercase mb-4 opacity-70">Need Emergency?</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">Call Now</p>
                  <Phone className="w-8 h-8" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}

// --- Calendar Component ---
function Calendar({ selected, onSelect }: { selected: Date, onSelect: (d: Date) => void }) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selected));
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

  return (
    <div className="bg-white p-6 md:p-12 rounded-[56px] shadow-2xl border border-white">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h4 className="text-3xl font-serif font-black text-slate-900">{format(currentMonth, 'MMMM')}</h4>
          <p className="text-[10px] font-bold tracking-[0.4em] text-blue-600 uppercase mt-2">{format(currentMonth, 'yyyy')} Availability</p>
        </div>
        <div className="flex gap-3">
          <button onClick={prevMonth} className="p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextMonth} className="p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-4 mb-6">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
          <div key={d} className="text-center text-[9px] font-black text-slate-300 tracking-widest uppercase">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-4">
        {Array.from({ length: getDay(days[0]) }).map((_, i) => <div key={`empty-${i}`} />)}
        {days.map(day => {
          const isBookable = !isPast(day) || isToday(day);
          const isSelected = isSameDay(day, selected);
          const availability = getMockAvailability(day);

          return (
            <button
              key={day.toISOString()}
              disabled={!isBookable}
              onClick={() => onSelect(day)}
              className={cn(
                "relative aspect-square rounded-[24px] md:rounded-[32px] transition-all flex flex-col items-center justify-center gap-1 group overflow-hidden",
                isSelected && "bg-blue-600 text-white shadow-2xl shadow-blue-200 scale-110 z-10",
                !isSelected && isBookable && "bg-slate-50/80 border border-slate-100 hover:bg-white hover:border-blue-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-50",
                !isBookable && "opacity-20 bg-slate-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "absolute top-0 right-0 w-8 h-8 rounded-bl-3xl opacity-0 transition-opacity",
                availability ? "bg-emerald-500/10 group-hover:opacity-100" : "bg-rose-500/10 group-hover:opacity-100"
              )} />
              
              <span className={cn("text-sm md:text-xl font-bold tracking-tighter", isSelected ? "text-white" : "text-slate-800")}>
                {format(day, 'd')}
              </span>
              
              {isBookable && (
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full ring-2 ring-white transition-all",
                  isSelected ? "bg-white scale-150" : (availability ? "bg-emerald-500" : "bg-rose-500")
                )} />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-[10px] font-black tracking-widest text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" /> AVAILABLE
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-50" /> FULLY BOOKED
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50" /> SELECTED
        </div>
      </div>
    </div>
  );
}

