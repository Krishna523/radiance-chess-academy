import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import emailjs from 'https://esm.sh/@emailjs/browser@4';
import { Crown, Menu, X, Award, BookOpenCheck, Users, Trophy, Globe, BarChart3, CheckCircle2, ArrowRight, ArrowLeft, Facebook, Twitter, Instagram, Youtube, MessageCircle, ChevronDown, ChevronLeft, ChevronRight, Trash2, Brain, Target } from 'lucide-react';

// --- IMPORTANT: CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyCENrpQULXNNnSlrQqQZLpeebLmiodmoUQ",
  authDomain: "radiance-chess-academy.firebaseapp.com",
  projectId: "radiance-chess-academy",
  storageBucket: "radiance-chess-academy.appspot.com",
  messagingSenderId: "1031021894893",
  appId: "1:1031021894893:web:0c92b0ce59cdd1906980e4"
};
const EMAILJS_SERVICE_ID = "service_iooou0l";
const EMAILJS_TRIAL_TEMPLATE_ID = "template_vrkd0db";
const EMAILJS_PUBLIC_KEY = "NWt6wW2tYX6CFDqYx";

const EMAILJS_SERVICE_ID_HIRING = "service_tjf2rtr"
const EMAILJS_HIRING_TEMPLATE_ID = "template_solc2oq";
const EMAILJS_PUBLIC_KEY_Hiring = "tKP4mOD4yD6bjcn1R";

const CLOUDINARY_CLOUD_NAME = "dknf3a0pt";
const CLOUDINARY_UPLOAD_PRESET = "kjmp2cvx";


const WHATSAPP_PHONE_NUMBER = "17325682619";
const WHATSAPP_PREDEFINED_MESSAGE = "Hello! I would like to book a free trial.";

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// --- Reusable Components ---

const AnimatedSection = ({ children, className = '' }) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        let observer;

        const currentRef = ref.current;

        if (currentRef) {
            observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setInView(true);
                        if (observer && currentRef) {
                            observer.unobserve(currentRef);
                        }
                    }
                },
                {
                    threshold: 0.1,
                }
            );
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef && observer) {
                observer.unobserve(currentRef);
            }
        };
    }, []);


    return (
        <div
            ref={ref}
            className={`${className} transition-all duration-700 ease-out transform ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            {children}
        </div>
    );
};

const Header = ({ setPage, setHomeView, navigate }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (page, anchor = '') => {
        if (page === 'home') {
            setHomeView('main');
        }
        // Use the navigate function if provided, otherwise fallback to setPage
        if (navigate) {
            navigate(page);
        } else {
            setPage(page);
        }

        if (anchor) {
            setTimeout(() => {
                const element = document.querySelector(anchor);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Features', page: 'home', anchor: '#features' },
        { name: 'Blog', page: 'home', anchor: '#blog' },
        { name: 'Coach Hiring', page: 'hiring' },
        { name: 'Contact', page: 'contact' },
        { name: 'Terms&Policies', page: 'terms' },
        { name: 'FAQ', page: 'home', anchor: '#faq' },
    ];

    return (
        <header className={`sticky top-0 z-40 border-b border-gray-700 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-xl shadow-lg' : 'bg-gray-900/70 backdrop-blur-lg'}`}>
            <div className={`container mx-auto px-4 sm:px-6 flex justify-between items-center transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
                <a onClick={() => handleNavClick('home')} className="cursor-pointer text-lg sm:text-2xl font-bold text-amber-400 flex items-center">
                    <img src="/icon.png" alt="Radiance Chess Academy Logo" className={`mr-3 rounded-full object-cover transition-all duration-300 ${scrolled ? 'h-8 w-8 sm:h-10 sm:w-10' : 'h-10 w-10 sm:h-12 sm:w-12'}`} />
                    Radiance Chess Academy
                </a>
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map(link => (
                        <a key={link.name} onClick={() => handleNavClick(link.page, link.anchor)} className="cursor-pointer text-base font-medium text-gray-300 hover:text-amber-400 transition">
                            {link.name}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center">
                    <a onClick={() => handleNavClick('home', '#enroll')} className="cursor-pointer hidden sm:inline-block cta-button bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-base">
                        Book FREE Trial
                    </a>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden ml-2 p-2 text-gray-400 hover:text-white relative h-6 w-6">
                         <Menu className={`absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                         <X className={`absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
                    </button>
                </div>
            </div>
            {/* Animated Mobile Menu */}
            <div className={`
                md:hidden bg-gray-800 border-t border-gray-700
                overflow-hidden transition-all duration-500 ease-in-out
                ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <div className="py-2">
                    {navLinks.map(link => (
                          <a key={link.name} onClick={() => handleNavClick(link.page, link.anchor)} className="cursor-pointer block py-3 px-6 text-base text-gray-300 hover:bg-gray-700 hover:text-amber-400 transition">
                              {link.name}
                          </a>
                    ))}
                    <a onClick={() => handleNavClick('home', '#enroll')} className="cursor-pointer block py-3 px-6 text-amber-400 font-bold hover:bg-gray-700 transition">
                        Book FREE Trial
                    </a>
                </div>
            </div>
        </header>
    );
};

const Footer = ({ setPage, navigate }) => {
    
    const handleNavClick = (page) => {
        if(navigate) {
            navigate(page);
        } else {
            setPage(page);
        }
    }

    return (
        <footer className="bg-gray-900 text-white border-t border-gray-700 mt-auto">
            <div className="container mx-auto px-6 py-8">
                <div className="md:flex md:justify-between items-center text-center md:text-left">
                    <div className="mb-4 md:mb-0">
                        <a onClick={() => handleNavClick('home')} className="cursor-pointer text-xl font-bold text-amber-400 flex items-center justify-center md:justify-start">
                            <img src="/icon.png" alt="Radiance Chess Academy Logo" className="mr-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover" />
                            Radiance Chess Academy
                        </a>
                        <p className="text-gray-400 mt-2">Nurturing the next generation of chess champions.</p>
                    </div>
                    <div className="flex justify-center space-x-6 mt-4 md:mt-0">
                        <a href="https://www.facebook.com/share/1BYErEka53/" className="text-gray-400 hover:text-white"><Facebook /></a>
                        <a href="https://www.instagram.com/radiancechessacademy?igsh=MXBjYTJyam9iemI0Zw==" className="text-gray-400 hover:text-white"><Instagram /></a>
                    </div>
                </div>
                 <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm flex flex-col sm:flex-row justify-center items-center gap-x-4 gap-y-2">
                    <p>&copy; {new Date().getFullYear()} Radiance Chess Academy. All Rights Reserved.</p>
                    <span className="hidden sm:inline">|</span>
                    <a onClick={() => handleNavClick('terms')} className="cursor-pointer hover:text-white transition">Terms & Policies</a>
                </div>
            </div>
        </footer>
    );
};

const WhatsAppButton = () => {
    return (
        <a href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREDEFINED_MESSAGE)}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 group flex items-center">
            <span className="absolute right-20 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                Contact Us
            </span>
            <div className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-45">
                <img
                    src="/icons8-whatsapp.svg"
                    alt="WhatsApp Icon"
                    className="w-8 h-8"
                />
            </div>
        </a>
    );
};

const Spinner = ({ color = 'text-white' }) => (
    <svg className={`animate-spin h-5 w-5 ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ImageSlideshow = () => {
    const slides = [
        { url: '/images/slide1.jpg', caption: 'District Level Tournament Winner' },
        { url: '/images/slide2.jpg', caption: 'State Level Tournament Winner' },
        { url: '/images/slide3.jpg', caption: 'District Level Tournament Winner' },
        { url: '/images/slide4.jpg', caption: 'State Level Tournament Winner' },
        { url: '/images/slide5.jpg', caption: 'State Level Tournament Winner' },
         { url: '/images/slide6.jpg', caption: 'District Level Tournament Winner' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
    const nextSlide = () => setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);

    useEffect(() => {
        const timer = setTimeout(nextSlide, 5000);
        return () => clearTimeout(timer);
    }, [currentIndex]);

    const getSlideStyle = (index) => {
        const totalSlides = slides.length;
        let offset = index - currentIndex;

        if (offset < -Math.floor(totalSlides / 2)) offset += totalSlides;
        if (offset > Math.floor(totalSlides / 2)) offset -= totalSlides;

        const isVisible = Math.abs(offset) <= 1;

        return {
            transform: `translateX(${offset * 50}%) scale(${offset === 0 ? 1 : 0.8})`,
            filter: `blur(${offset === 0 ? 0 : '4px'}) brightness(${offset === 0 ? 1 : 0.5})`,
            zIndex: totalSlides - Math.abs(offset),
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.5s ease-in-out',
        };
    };

    return (
        <div className="h-[300px] sm:h-[500px] w-full relative flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full sm:h-3/4">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl"
                        style={getSlideStyle(index)}
                    >
                        <img
                            src={slide.url}
                            alt={slide.caption}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/1f2937/a855f7?text=Image+Error"; }}
                        />
                    </div>
                ))}
            </div>
            <div className="absolute bottom-4 sm:bottom-16 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full z-20 text-sm sm:text-base">
                {slides[currentIndex].caption}
            </div>
            <button onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-5 text-2xl rounded-full p-2 bg-black/30 hover:bg-black/50 text-white cursor-pointer z-30 transition">
                <ChevronLeft size={30} />
            </button>
            <button onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-5 text-2xl rounded-full p-2 bg-black/30 hover:bg-black/50 text-white cursor-pointer z-30 transition">
                <ChevronRight size={30} />
            </button>
        </div>
    );
};

// --- Page Components ---

// --- NEW COMPONENT: Blog Detail Page (For separate URL) ---
const BlogDetailPage = ({ id, navigate }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) {
                setError(true);
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, "posts", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><Spinner /></div>;
    if (error || !post) return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-white">
            <h2 className="text-2xl mb-4">Post not found</h2>
            <button onClick={() => navigate('home')} className="text-amber-400 hover:underline">Return to Home</button>
        </div>
    );

    return (
        <main className="py-20 md:py-32">
            <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20 max-w-4xl bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700">
                <button onClick={() => navigate('home')} className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-8">
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
                </button>
                <div className="prose prose-invert prose-lg max-w-none">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">{post.title || 'Untitled Post'}</h1>
                    <p className="text-xl text-gray-300 mb-10">{post.summary || 'No summary available.'}</p>
                    <div className="mt-12 flex flex-col md:flex-row items-start gap-8 bg-gray-800/80 p-6 rounded-lg border border-gray-700">
                        <img src={post.studentImageUrl || 'https://placehold.co/600x400/1f2937/a855f7?text=Image'} alt={`Photo of ${post.studentName || 'Student'}`} className="w-full md:w-1/3 rounded-lg object-cover" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/1f2937/a855f7?text=Image+Error"; }}/>
                        <div className="w-full md:w-2/3">
                            <h2 className="text-2xl font-bold text-white mb-4">1. {post.studentName || 'Anonymous Student'}</h2>
                            <p className="text-gray-300 mb-6">{post.studentBio || 'No biography provided.'}</p>
                             <div className="mt-6">
                                <h3 className="text-amber-400 font-semibold text-lg">Parent's Feedback:</h3>
                                <p className="italic text-gray-400">"{post.parentFeedback || 'No feedback provided.'}"</p>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-amber-400 font-semibold text-lg">Coach feedback on {post.studentName || 'the student'}:</h3>
                                <p className="italic text-gray-400">"{post.coachFeedback || 'No feedback provided.'}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

const HomePage = ({ view, setView, navigateToPost, navigate }) => {
    const [blogPosts, setBlogPosts] = useState([]);

    useEffect(() => {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setBlogPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => console.error("Error fetching blog posts:", error));
        return () => unsubscribe();
    }, []);

    // NOTE: Instead of setting local 'detail' state, we navigate to the blog URL
    const handleViewDetail = (post) => {
        navigateToPost(post.id);
    };

    const PostCard = ({ post, onCardClick }) => (
        <div onClick={() => onCardClick(post)} className='bg-gray-800/80 rounded-lg overflow-hidden border border-gray-700 flex flex-col group cursor-pointer shadow-sm hover:shadow-lg transition-shadow h-full'>
            <div className="overflow-hidden">
                <img src={post?.studentImageUrl || 'https://placehold.co/600x400/1f2937/a855f7?text=Image'} alt={`Photo of ${post?.studentName || 'Student'}`} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/1f2937/a855f7?text=Image+Error"; }}/>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition">{post?.title || 'Untitled Post'}</h3>
                <p className="mt-2 text-gray-400 text-sm flex-grow line-clamp-3">{post?.summary || 'No summary available.'}</p>
                <span className="mt-4 text-amber-400 font-semibold inline-flex items-center">Read More <ArrowRight className="ml-2 h-4 w-4" /></span>
            </div>
        </div>
    );

    if (view === 'allPosts') {
        return (
            <div className="py-20 md:py-32">
                 <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20 bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">All "Star of the Month" Posts</h2>
                        <button onClick={() => setView('main')} className="inline-flex items-center text-amber-400 hover:text-amber-300">
                            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.length > 0 ? blogPosts.map((post) => (
                            <PostCard key={post.id} post={post} onCardClick={handleViewDetail} />
                        )) : <p className="text-gray-400 col-span-full text-center">No posts yet.</p>}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <main>
            {/* Hero Section */}
            <section className="py-20 md:py-32">
                 <div className="container mx-auto px-4 sm:px-6 text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl py-16 sm:py-24 border border-gray-700 opacity-0 animate-fade-in-down">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                        Unlock Your Child's <span className="text-amber-400">Genius</span> with Chess
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                        Join our fun & interactive online classes for kids aged 5-16. Our FIDE-rated coaches are here to guide your child from their first move to checkmate.
                    </p>
                    <div className="mt-10">
                        <a href="#enroll" className="nav-link cta-button bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-4 px-10 rounded-lg text-lg">
                            Enroll for a FREE Trial Class
                        </a>
                    </div>
                </div>
            </section>

            {/* Why Choose Chess? Section */}
            <AnimatedSection>
                <section className="py-20">
                     <div className="container mx-auto px-4 sm:px-6 max-w-6xl bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-700">
                        <div className="md:flex md:items-center md:gap-12">
                            <div className="md:w-1/2 mb-8 md:mb-0">
                                <img
                                    src="/why.png"
                                    alt="Child thinking over a chessboard"
                                    className="rounded-lg shadow-lg w-full h-auto object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/1f2937/a855f7?text=Image+Error"; }}
                                />
                            </div>
                            <div className="md:w-1/2 text-center md:text-left">
                                 <div className="flex items-center justify-center md:justify-start text-amber-400 mb-4">
                                     <Brain className="h-8 w-8 mr-3"/>
                                     <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose Chess?</h2>
                                 </div>
                                <p className="text-lg text-gray-300">
                                    Chess: Fuel for Young Minds! From playful strategies to serious thinking, chess is the perfect mix of fun and learning. It's not just a game — it's a brain workout that helps kids develop focus, confidence, and resilience from an early age.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Why Choose Radiance Section */}
            <AnimatedSection>
                <section id="features" className="py-20">
                    <div className="container mx-auto px-4 sm:px-6 bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-700">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose Radiance Chess Academy?</h2>
                            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">We provide a world-class learning environment to nurture the champion in your child.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             <div className="bg-gray-800/80 p-8 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-2"><div className="flex items-center justify-center bg-amber-500/10 h-16 w-16 rounded-full mb-6"><Award className="text-amber-400 h-8 w-8"/></div><h3 className="text-xl font-bold text-white mb-3">FIDE Rated Coaches</h3><p className="text-gray-400">Learn from experienced and certified international chess masters and trainers.</p></div>
                            <div className="bg-gray-800/80 p-8 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-2"><div className="flex items-center justify-center bg-amber-500/10 h-16 w-16 rounded-full mb-6"><BookOpenCheck className="text-amber-400 h-8 w-8"/></div><h3 className="text-xl font-bold text-white mb-3">Structured Curriculum</h3><p className="text-gray-400">A comprehensive syllabus designed by experts for all levels, from beginner to advanced.</p></div>
                            <div className="bg-gray-800/80 p-8 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-2"><div className="flex items-center justify-center bg-amber-500/10 h-16 w-16 rounded-full mb-6"><Users className="text-amber-400 h-8 w-8"/></div><h3 className="text-xl font-bold text-white mb-3">Small Group Classes</h3><p className="text-gray-400">Personalized attention guaranteed with a maximum of 5 students per batch.</p></div>
                             <div className="bg-gray-800/80 p-8 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-2"><div className="flex items-center justify-center bg-amber-500/10 h-16 w-16 rounded-full mb-6"><Trophy className="text-amber-400 h-8 w-8"/></div><h3 className="text-xl font-bold text-white mb-3">Regular Tournaments</h3><p className="text-gray-400">Opportunities to compete in weekly internal and major external chess tournaments.</p></div>
                             <div className="bg-gray-800/80 p-8 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-2"><div className="flex items-center justify-center bg-amber-500/10 h-16 w-16 rounded-full mb-6"><Globe className="text-amber-400 h-8 w-8"/></div><h3 className="text-xl font-bold text-white mb-3">Global Community</h3><p className="text-gray-400">Join a vibrant community of chess lovers from over 30 countries worldwide.</p></div>
                            <div className="bg-gray-800/80 p-8 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-2"><div className="flex items-center justify-center bg-amber-500/10 h-16 w-16 rounded-full mb-6"><BarChart3 className="text-amber-400 h-8 w-8"/></div><h3 className="text-xl font-bold text-white mb-3">Performance Tracking</h3><p className="text-gray-400">Regular progress reports and feedback sessions to monitor your child's growth.</p></div>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Our Purpose Section */}
            <AnimatedSection>
                <section className="py-20">
                     <div className="container mx-auto px-4 sm:px-6 max-w-6xl bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-700">
                         <div className="md:flex md:items-center md:gap-12 flex-row-reverse"> {/* Reversed column order */}
                            <div className="md:w-1/2 mb-8 md:mb-0">
                                <img
                                    src="/our_purpose.png"
                                    alt="Diverse group of kids playing chess"
                                    className="rounded-lg shadow-lg w-full h-auto object-cover"
                                     onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/1f2937/a855f7?text=Image+Error"; }}
                                />
                            </div>
                            <div className="md:w-1/2 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start text-amber-400 mb-4">
                                     <Target className="h-8 w-8 mr-3"/>
                                     <h2 className="text-3xl md:text-4xl font-bold text-white">Our Purpose</h2>
                                </div>
                                <p className="text-lg text-gray-300">
                                    At Radiance Chess Academy, we nurture more than just chess skills — we cultivate confident, curious, and resilient young minds. Our philosophy embraces the <span className="font-semibold">whole-child approach</span>, blending strategy and sportsmanship with creativity, character, and connection. Every session is crafted to spark joy, build friendships, and strengthen focus — empowering your child not just to play the game, but to shine in life. Whether it's their first pawn move or their path to competitive play, we're here to guide, uplift, and inspire every step of the way.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Trial Form Section */}
            <AnimatedSection>
                <TrialForm />
            </AnimatedSection>

            {/* Stars of the Month Section */}
            <AnimatedSection>
                <section id="blog" className="py-20">
                     <div className="container mx-auto px-4 sm:px-6 bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-700">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Stars of the Month</h2>
                            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Celebrating the hard work and success of our talented students.</p>
                        </div>

                        {blogPosts.length > 0 ? (
                            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:pb-0 md:snap-none -mx-4 px-4 md:mx-0 md:px-0">
                                {blogPosts.slice(0, 3).map((post, index) => (
                                    <div key={post.id} className="flex-shrink-0 w-5/6 sm:w-3/4 md:w-auto snap-center">
                                         <PostCard post={post} onCardClick={handleViewDetail}/>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400">Loading posts...</p>
                        )}

                        {blogPosts.length > 3 && (
                            <div className="text-center mt-12">
                                <button onClick={() => setView('allPosts')} className="cta-button bg-gray-700 hover:bg-gray-600 text-amber-400 font-bold py-3 px-8 rounded-lg">View All Posts</button>
                            </div>
                        )}
                    </div>
                </section>
            </AnimatedSection>

              {/* Achievements Section */}
                <AnimatedSection>
                <section id="achievements" className="py-20">
                    <div className="container mx-auto px-4 sm:px-6 bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-700">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Achievers</h2>
                            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Celebrating the victories and milestones of our students.</p>
                        </div>
                        <ImageSlideshow />
                    </div>
                </section>
            </AnimatedSection>

            {/* Final CTA Section */}
            <FinalCTA />

            {/* FAQ Section */}
            <AnimatedSection>
                <section id="faq" className="py-20">
                    <div className="container mx-auto px-4 sm:px-6 max-w-4xl bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-700">
                             <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-white">Frequently Asked Questions</h2></div>
                             <div className="space-y-4">
                                 <details className="bg-gray-800/80 p-6 rounded-lg group border border-gray-700"><summary className="flex justify-between items-center font-semibold text-white cursor-pointer">What is the right age for a child to start learning chess?<ChevronDown className="h-6 w-6 transition-transform duration-300 group-open:rotate-180 text-gray-400"/></summary><p className="text-gray-400 mt-4">The ideal age to start learning chess is typically between 5 and 7 years old. However, we have programs tailored for children up to 16 years. It's never too late to start!</p></details>

                                 <details className="bg-gray-800/80 p-6 rounded-lg group border border-gray-700"><summary className="flex justify-between items-center font-semibold text-white cursor-pointer">Do you prepare students for rated tournaments?<ChevronDown className="h-6 w-6 transition-transform duration-300 group-open:rotate-180 text-gray-400"/></summary><p className="text-gray-400 mt-4">Yes, absolutely. Our advanced curriculum is specifically designed to prepare students for FIDE-rated tournaments. We provide specialized training, opening preparation, and tournament strategy sessions.</p></details>
                                 <details className="bg-gray-800/80 p-6 rounded-lg group border border-gray-700"><summary className="flex justify-between items-center font-semibold text-white cursor-pointer">Can we change our batch timings after enrollment?<ChevronDown className="h-6 w-6 transition-transform duration-300 group-open:rotate-180 text-gray-400"/></summary><p className="text-gray-400 mt-4">We offer flexibility to change batches based on availability. Please contact our support team, and they will do their best to find a suitable slot that works for your new schedule.</p></details>
                            </div>
                    </div>
                </section>
            </AnimatedSection>

        </main>
    )
};

const TrialForm = ({ isPopup = false, onClose = () => {} }) => {
    const formRef = useRef();
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ message: '', type: '' });

        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TRIAL_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY)
            .then(() => {
                setStatus({ message: 'Thank you! Your trial request has been sent.', type: 'success' });
                formRef.current.reset();
                if(isPopup) setTimeout(onClose, 2000);
            }, (error) => {
                setStatus({ message: 'Oops! Something went wrong. Please try again.', type: 'error' });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const statusColor = status.type === 'success' ? 'text-green-400' : 'text-red-400';

    if (isPopup) {
         return (
                <form ref={formRef} onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input name="parentName" type="text" placeholder="Parent's Name" required className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        <input name="parentEmail" type="email" placeholder="Parent's Email" required className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        <input name="parentPhone" type="tel" placeholder="Parent's Phone Number" required className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        <input name="childName" type="text" placeholder="Child's Name" required className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        <input name="childAge" type="number" placeholder="Child's Age" required min="5" max="16" className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        <select name="chessExperience" required className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option value="" disabled>Chess Experience Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        <button type="submit" disabled={isLoading} className="w-full cta-button bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center">
                            {isLoading ? <Spinner color="text-gray-900" /> : 'Book My FREE Class'}
                        </button>
                    </div>
                    {status.message && <div className={`mt-4 text-center text-sm ${statusColor}`}>{status.message}</div>}
                </form>
            )
    }

    return (
        <section id="enroll" className="py-20">
            <div className="container mx-auto px-4 sm:px-6">
                 <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 lg:flex lg:items-center lg:gap-12 border-2 border-amber-500 shadow-lg shadow-amber-500/10">
                    <div className="lg:w-1/2 text-center lg:text-left">
                         <h2 className="text-3xl md:text-4xl font-bold text-white">Start Your Chess Journey Today!</h2>
                         <p className="mt-4 text-gray-300 text-lg">Book a <span className="font-bold text-amber-400">FREE, no-obligation</span> trial class and get a detailed performance assessment for your child.</p>
                         <div className="mt-8 space-y-4 text-gray-300">
                             <div className="flex items-center justify-center lg:justify-start"><CheckCircle2 className="h-6 w-6 text-green-400 mr-3"/><span>1-on-1 interaction with a senior coach</span></div>
                             <div className="flex items-center justify-center lg:justify-start"><CheckCircle2 className="h-6 w-6 text-green-400 mr-3"/><span>Experience our unique teaching method</span></div>
                             <div className="flex items-center justify-center lg:justify-start"><CheckCircle2 className="h-6 w-6 text-green-400 mr-3"/><span>Understand your child's strengths & weaknesses</span></div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 mt-10 lg:mt-0">
                        <div className="bg-gray-800/80 p-6 sm:p-8 rounded-lg border border-gray-700">
                            <h3 className="text-2xl font-bold text-center text-white mb-6">Fill in The Details to Enroll</h3>
                            <form ref={formRef} onSubmit={handleSubmit}>
                                <div className="space-y-5">
                                    <input name="parentName" type="text" placeholder="Parent's Name" required className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                    <input name="parentEmail" type="email" placeholder="Parent's Email" required className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                    <input name="parentPhone" type="tel" placeholder="Parent's Phone Number" required className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                    <input name="childName" type="text" placeholder="Child's Name" required className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                    <input name="childAge" type="number" placeholder="Child's Age" required min="5" max="16" className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                    <select name="chessExperience" required className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                        <option value="" disabled>Chess Experience Level</option>
                                        <option value="Beginner">Beginner (New to chess)</option>
                                        <option value="Intermediate">Intermediate (Knows the rules)</option>
                                        <option value="Advanced">Advanced (Plays tournaments)</option>
                                    </select>
                                    <button type="submit" disabled={isLoading} className="w-full cta-button bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-4 px-6 rounded-lg text-lg flex items-center justify-center">
                                        {isLoading ? <Spinner color="text-gray-900" /> : 'Submit & Book My FREE Class'}
                                    </button>
                                </div>
                            </form>
                           {status.message && <div className={`mt-4 text-center text-sm ${statusColor}`}>{status.message}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};

const HiringPage = () => {
    const formRef = useRef();
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ message: '', type: '' });

        const resumeFile = formRef.current.resumeFile.files[0];
        if (!resumeFile) {
            setStatus({ message: 'Please select a resume file.', type: 'error' });
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', resumeFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        // Add this line to fix the upload issue for non-image files
        formData.append('resource_type', 'auto');

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message || 'Cloudinary upload failed');

            const templateParams = {
                firstName: formRef.current.firstName.value,
                lastName: formRef.current.lastName.value,
                phone: formRef.current.phone.value,
                email: formRef.current.email.value,
                fideProfile: formRef.current.fideProfile.value,
                resumeUrl: data.secure_url
            };

            await emailjs.send(EMAILJS_SERVICE_ID_HIRING,EMAILJS_HIRING_TEMPLATE_ID, templateParams,EMAILJS_PUBLIC_KEY_Hiring );

            setStatus({ message: 'Thank you! Your application has been sent.', type: 'success' });
            formRef.current.reset();

        } catch (error) {
            console.error("Detailed Error:", error);
            setStatus({ message: `Oops! Something went wrong. Error: ${error.message || 'Unknown Error'}.`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const statusColor = status.type === 'success' ? 'text-green-400' : 'text-red-400';

    return (
        <main className="py-20">
            <section id="hiring">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                             <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-700">
                                 <div className="text-center mb-12">
                                     <h2 className="text-3xl md:text-4xl font-bold text-white">Join Our Team of Coaches</h2>
                                     <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                                         Our vision is to ignite passion for kids in the world of Chess. If you are passionate about Chess Coaching, start your first move by filling the form.
                                     </p>
                                 </div>
                                 <div className="bg-gray-800/80 p-6 sm:p-8 rounded-lg border border-gray-700">
                                     <form ref={formRef} onSubmit={handleSubmit}>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                             <div>
                                                 <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                                                 <input type="text" name="firstName" id="firstName" required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                                             </div>
                                             <div>
                                                 <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                                                 <input type="text" name="lastName" id="lastName" required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                                             </div>
                                             <div className="md:col-span-2">
                                                 <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                                                 <input type="tel" name="phone" id="phone" required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                                             </div>
                                             <div className="md:col-span-2">
                                                 <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                                                 <input type="email" name="email" id="email" required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                                             </div>
                                             <div className="md:col-span-2">
                                                 <label htmlFor="fideProfile" className="block text-sm font-medium text-gray-300 mb-2">FIDE Profile</label>
                                                 <input type="url" name="fideProfile" id="fideProfile" placeholder="e.g. https://ratings.fide.com/profile/..." className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                                             </div>
                                             <div className="md:col-span-2">
                                                 <label htmlFor="resumeFile" className="block text-sm font-medium text-gray-300 mb-2">Resume / CV *</label>
                                                 <input type="file" name="resumeFile" id="resumeFile" required accept=".pdf,.doc,.docx,.txt" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-300 hover:file:bg-amber-500/20 cursor-pointer"/>
                                             </div>
                                         </div>
                                         <div className="mt-8">
                                             <button type="submit" disabled={isLoading} className="w-full md:w-auto cta-button bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg flex items-center justify-center">
                                                 {isLoading ? <Spinner color="text-gray-900" /> : 'Submit Application'}
                                             </button>
                                         </div>
                                     </form>
                                      {status.message && <div className={`mt-6 text-center text-sm ${statusColor}`}>{status.message}</div>}
                                 </div>
                            </div>
                </div>
            </section>
        </main>
    )
};

const ContactPage = () => (
     <main className="py-20">
        <section id="contact">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-700">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Contact Us</h2>
                        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">We are here to help you get started on your chess journey.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               
                        {/* US Office */}
                        <div className="bg-gray-800/80 p-8 rounded-lg border border-gray-700 text-center">
                            <img src="https://flagcdn.com/w160/us.png" alt="USA Flag" className="w-20 h-auto mx-auto mb-6 rounded-md" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/160x85/1f2937/a855f7?text=US+Flag"; }}/>
                            <h3 className="text-xl font-bold text-white mb-2">UNITED STATES</h3>
                            <p className="text-gray-400">
                                Radiance Chess Academy USA, <br/>
500 w Madison Street, Chicago, IL 60661, <br/>United States.
                            </p>
                            <p className="text-gray-300 mt-4">
                                Contact us: <a href="tel:+17325682619" className="text-amber-400 hover:underline">+1 (732) 568-2619</a>
                            </p>
                            <p className="text-gray-300 mt-2">
                                Email: <a href="mailto:radiancechessacademy.online@gmail.com" className="text-amber-400 hover:underline break-all">radiancechessacademy.online@gmail.com</a>
                            </p>
                        </div>
                                 {/* India Office */}
                        <div className="bg-gray-800/80 p-8 rounded-lg border border-gray-700 text-center">
                            <img src="https://flagcdn.com/w160/in.png" alt="Indian Flag" className="w-20 h-auto mx-auto mb-6 rounded-md" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/160x107/1f2937/a855f7?text=IN+Flag"; }}/>
                            <h3 className="text-xl font-bold text-white mb-2">INDIA - HEADQUARTERS</h3>
                            <p className="text-gray-400">
                                Radiance Chess Academy, <br />
                                Near Tidel Park, Tharamani,<br/> Chennai – 600113, Tamil Nadu, India.
                            </p>
                            <p className="text-gray-300 mt-4">
                                Contact us: <a href="tel:+919342678754" className="text-amber-400 hover:underline">+91-93426 78754</a>
                            </p>
                            <p className="text-gray-300 mt-2">
                                Email: <a href="mailto:radiancechessacademy.online@gmail.com" className="text-amber-400 hover:underline break-all">radiancechessacademy.online@gmail.com</a>
                            </p>
                        </div>
                    </div>
                    {/* <div className="text-center mt-12">
                        <a href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREDEFINED_MESSAGE)}`} target="_blank" rel="noopener noreferrer" className="inline-block cta-button bg-gray-700 hover:bg-gray-600 text-amber-400 font-bold py-3 px-8 rounded-lg border border-gray-600">
                           <MessageCircle className="inline-block mr-2 -mt-1 "/> Message us on WhatsApp
                        </a>
                    </div> */}

                        <div className="text-center mt-12">
      <a
        href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREDEFINED_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center cta-button bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-8 rounded-lg border border-transparent transition-colors duration-300"
      >
        <img
          src="/icons8-whatsapp.svg"
          alt="WhatsApp Icon"
          className="inline-block mr-2 w-6 h-6"
        />
        Message us on WhatsApp
      </a>
    </div>
                </div>
            </div>
        </section>
    </main>
);

{/* --- MODIFIED COMPONENT: FinalCTA --- */}
const FinalCTA = () => {
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREDEFINED_MESSAGE)}`;

    // SVG for WhatsApp Icon
    const WhatsAppIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-5 w-5">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.523-5.587-1.474l-6.355 1.666z"/>
        </svg>
    );

    return (
        <AnimatedSection>
                <section className="py-20">
        {/* Increased max-width */}
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-700 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Begin Your Child's Chess Journey? Start with Radiance!
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Have questions or need more info about our programs? Just reach out — we're happy to help!
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              // Changed button color and border to green
              className="inline-flex items-center justify-center cta-button bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors border border-green-600 shadow-lg"
            >
              <img
                src="/icons8-whatsapp.svg"
                alt="WhatsApp Icon"
                className="inline-block mr-2 w-6 h-6" // Added size and spacing
              />
              Contact Us
            </a>
          </div>
        </div>
      </section>
        </AnimatedSection>
    );
};

const TimedPopup = ({ page }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (page === 'admin' || sessionStorage.getItem('popupShown')) {
            return;
        }

        const timer = setTimeout(() => {
            setIsVisible(true);
            sessionStorage.setItem('popupShown', 'true');
        }, 10000); // 5 seconds

        return () => clearTimeout(timer);
    }, [page]);

    const closePopup = () => {
        setIsVisible(false);
    };

    return (
        <div
            id="timed-popup"
            onClick={closePopup}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300
                ${isVisible ? 'bg-black/70 backdrop-blur-sm opacity-100' : 'bg-transparent backdrop-blur-none opacity-0 pointer-events-none'}`}
        >
            <div
                id="popup-panel"
                onClick={(e) => e.stopPropagation()}
                className={`relative bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg p-8 transition-all duration-300
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
                <button onClick={closePopup} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                    <X />
                </button>
                <h3 className="text-2xl font-bold text-center text-white mb-6">Book Your FREE Trial Class!</h3>
                <TrialForm isPopup={true} onClose={closePopup} />
            </div>
        </div>
    );
};

const TermsPage = () => (
    <main className="py-20">
        <section id="terms">
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-700">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Terms and Policies</h2>

                    <div className="space-y-8 text-gray-300">
                        <div>
                            <h3 className="text-2xl font-semibold text-amber-400 mb-3">1. Terms and Policies</h3>
                            <p className="mb-4">Welcome to Radiance Chess Academy! By using our services, you agree to the following terms:</p>
                             <ul className="list-disc list-inside space-y-2 pl-4">
                                 <li>Classes are conducted online via Zoom or Google Meet.</li>
                                 <li>Payment must be completed in advance via Razorpay payment links.</li>
                                 <li>Misconduct or disruption during classes may result in termination of services without a refund.</li>
                                 <li>Radiance Chess Academy reserves the right to update these terms at any time.</li>
                             </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold text-amber-400 mb-3">2. Privacy Policy</h3>
                            <p className="mb-4">At Radiance Chess Academy, we prioritize your privacy.</p>
                             <ul className="list-disc list-inside space-y-2 pl-4">
                                 <li>We collect your name, email, phone number, and payment details for service delivery and communication purposes.</li>
                                 <li>All data is stored securely and used only for processing payments and arranging classes.</li>
                                 <li>We do not share your personal data with third parties, except for payment processing via Razorpay.</li>
                             </ul>
                            <p className="mt-4">For any queries related to data privacy, contact us at <a href="mailto:radiancechessacademy.online@gmail.com" className="text-amber-300 hover:underline">radiancechessacademy.online@gmail.com</a>.</p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold text-amber-400 mb-3">3. Refund and Cancellation Policy</h3>
                            <p className="mb-4">We strive to provide the best experience for our students. However, in certain cases, refunds or cancellations may be required:</p>
                             <ul className="list-disc list-inside space-y-2 pl-4">
                                 <li><strong>Refunds:</strong> Refunds are allowed only if a cancellation request is made within 48 hours of booking a class or package. The refund will be processed within 5-7 working days and credited to the original payment method.</li>
                                 <li><strong>Cancellations:</strong> Cancellations requested less than 24 hours before the class will not be refunded.</li>
                             </ul>
                            <p className="mt-4">For cancellations, contact us at <a href="mailto:radiancechessacademy.online@gmail.com" className="text-amber-300 hover:underline">radiancechessacademy.online@gmail.com</a>.</p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold text-amber-400 mb-3">4. Shipping/Delivery Policy</h3>
                            <p className="mb-4">As our services are fully online, no physical shipping is required.</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                 <li><strong>Delivery Timeline:</strong> Class schedules will be shared within 24 hours of payment confirmation.</li>
                            </ul>
                            <p className="mt-4">For any delays or issues, please contact us immediately.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
);

// --- Admin Page Component ---
const AdminPage = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [posts, setPosts] = useState([]);

    const formRef = useRef();
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ message: '', type: '' });

        const formData = new FormData(e.target);
        const imageFile = formData.get('studentImageFile');

        if (!imageFile || imageFile.size === 0) {
            setStatus({ message: 'Please select a student photo.', type: 'error' });
            setIsSubmitting(false);
            return;
        }

        try {
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', imageFile);
            cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
                method: 'POST',
                body: cloudinaryFormData
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message || 'Cloudinary upload failed');

            const newPost = {
                title: `Star of the Month - ${formData.get('month')} ${formData.get('year')}`,
                summary: formData.get('summary'),
                studentName: formData.get('studentName'),
                studentImageUrl: data.secure_url,
                studentBio: formData.get('studentBio'),
                parentFeedback: formData.get('parentFeedback'),
                coachFeedback: formData.get('coachFeedback'),
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "posts"), newPost);
            setStatus({ message: 'Post published successfully!', type: 'success' });
            e.target.reset();

        } catch (err) {
            console.error(err);
            setStatus({ message: 'Failed to publish post. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePost = async (postId) => {
        // Using console for confirmation as window.confirm is not allowed
        console.log(`Attempting to delete post ${postId}. Confirm this action.`);
        try {
            await deleteDoc(doc(db, "posts", postId));
        } catch (error) {
            console.error("Error deleting post:", error);
            console.error("Error: Could not delete the post.");
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 p-8 rounded-lg shadow-2xl w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-amber-400">Admin Login</h1>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="space-y-6">
                            <input name="email" type="email" placeholder="Email" required className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                            <input name="password" type="password" placeholder="Password" required className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
                        <button type="submit" className="mt-8 w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    const statusColor = status.type === 'success' ? 'text-green-400' : 'text-red-400';

    return (
        <main className="py-12">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg">Logout</button>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Create Post Form */}
                    <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl p-8 border border-gray-700">
                         <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Create "Star of the Month"</h2>
                         <form ref={formRef} onSubmit={handleCreatePost}>
                             <div className="space-y-4">
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <label className="block text-sm font-medium text-gray-300 mb-2">Month</label>
                                         <select name="month" required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                             <option>January</option><option>February</option><option>March</option><option>April</option><option>May</option><option>June</option>
                                             <option>July</option><option>August</option><option>September</option><option>October</option><option>November</option><option>December</option>
                                         </select>
                                     </div>
                                     <div>
                                         <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                                         <input name="year" type="number" defaultValue={new Date().getFullYear()} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                     </div>
                                 </div>
                                 <textarea name="summary" placeholder="Short Summary for the blog grid" required rows="3" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
                                 <input name="studentName" type="text" placeholder="Student's Name (e.g., Aarav S.)" required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                 <div>
                                      <label className="text-sm font-medium text-gray-300 mb-2 block">Student's Photo *</label>
                                      <input name="studentImageFile" type="file" required accept="image/*" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-300 hover:file:bg-amber-500/20 cursor-pointer"/>
                                 </div>
                                 <textarea name="studentBio" placeholder="Student's Bio / Story" required rows="5" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
                                 <textarea name="parentFeedback" placeholder="Parent's Feedback" required rows="4" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
                                 <textarea name="coachFeedback" placeholder="Coach's Feedback" required rows="4" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
                                 <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-8 rounded-lg transition flex items-center justify-center">
                                     {isSubmitting ? <Spinner color="text-gray-900"/> : 'Publish Post'}
                                 </button>
                                 {status.message && <p className={`mt-4 text-center text-sm ${statusColor}`}>{status.message}</p>}
                             </div>
                         </form>
                    </div>

                    {/* Manage Posts */}
                    <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Manage Posts</h2>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {posts.length > 0 ? posts.map(post => (
                                <div key={post.id} className="bg-gray-800/80 p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-white">{post.title}</p>
                                        <p className="text-sm text-gray-400">{post.studentName}</p>
                                    </div>
                                    <button onClick={() => handleDeletePost(post.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={20}/></button>
                                </div>
                            )) : <p className="text-gray-400">No posts found.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};


// --- Main App Component ---
export default function App() {
    const getPageFromPath = (path) => {
        // Handle blog detail path first
        if (path.startsWith('/blog/')) {
            return 'blog-detail';
        }

        const pageName = path.substring(1); // remove leading '/'
        switch (pageName) {
            case 'admin':
            case 'hiring':
            case 'contact':
            case 'terms':
                return pageName;
            case '':
            default:
                return 'home';
        }
    };

    const [page, setPage] = useState('home');
    const [currentPostId, setCurrentPostId] = useState(null);
    const [homeView, setHomeView] = useState('main');
    const [visible, setVisible] = useState(false);

    // Initial Load: Parse URL to set initial state
    useEffect(() => {
        const path = window.location.pathname;
        const initialPage = getPageFromPath(path);

        if (initialPage === 'blog-detail') {
            const id = path.split('/')[2];
            setCurrentPostId(id);
        }
        
        setPage(initialPage);
        setVisible(true);
    }, []);

    // Custom Navigate Function to handle history and state
    const navigate = (newPage, newPostId = null) => {
        let path = '/';
        
        if (newPage === 'home') {
            path = '/';
            setHomeView('main');
        } else if (newPage === 'blog-detail' && newPostId) {
            path = `/blog/${newPostId}`;
            setCurrentPostId(newPostId);
        } else {
            path = `/${newPage}`;
        }

        window.history.pushState({}, '', path);
        setPage(newPage);
        window.scrollTo(0, 0);
    };

    // Sync URL to state on back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;
            const newPage = getPageFromPath(path);
            
            if (newPage === 'blog-detail') {
                const id = path.split('/')[2];
                setCurrentPostId(id);
            }
            
            setPage(newPage);
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const renderPage = () => {
        switch (page) {
            case 'hiring':
                return <HiringPage />;
            case 'contact':
                return <ContactPage />;
            case 'terms':
                return <TermsPage />;
            case 'admin':
                return <AdminPage />;
            case 'blog-detail':
                return <BlogDetailPage id={currentPostId} navigate={navigate} />;
            case 'home':
            default:
                return <HomePage 
                    setPage={setPage} 
                    view={homeView} 
                    setView={setHomeView} 
                    navigateToPost={(id) => navigate('blog-detail', id)}
                    navigate={navigate}
                />;
        }
    };

    return (
        <>
            <style>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-2rem);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-down {
                    /* Apply animation with a delay to start after the main page fade-in */
                    animation: fadeInDown 1s ease-out 0.5s forwards;
                }
            `}</style>
            <div className={`bg-gray-900 text-white min-h-screen flex flex-col transition-opacity duration-700 ease-in ${visible ? 'opacity-100' : 'opacity-0'}`} style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2070&auto-format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}>
                <Header setPage={setPage} setHomeView={setHomeView} navigate={navigate} />
                <div className="flex-grow">
                    {renderPage()}
                </div>
                <Footer setPage={setPage} navigate={navigate} />
                <WhatsAppButton />
                <TimedPopup page={page} />
            </div>
        </>
    );
}