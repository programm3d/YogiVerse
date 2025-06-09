import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Users,
  Heart,
  Sparkles,
  Star,
  TrendingUp,
  Award,
  CheckCircle,
} from "lucide-react";
import { useInView } from "react-intersection-observer";

const HomePage = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect with Yogis",
      description: "Join a community of yoga enthusiasts from around the world",
      color: "from-yoga-purple to-yoga-pink",
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: "Share Your Practice",
      description: "Upload and share your yoga videos, tips, and experiences",
      color: "from-yoga-pink to-yoga-orange",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Get Inspired",
      description: "Discover new poses, sequences, and meditation techniques",
      color: "from-yoga-orange to-yoga-teal",
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Yogis" },
    { number: "10K+", label: "Videos Shared" },
    { number: "100K+", label: "Poses Practiced" },
    { number: "4.9", label: "User Rating" },
  ];

  const benefits = [
    "Access to exclusive yoga content",
    "Connect with certified instructors",
    "Track your yoga journey",
    "Join live sessions and workshops",
    "Share your progress with the community",
    "Get personalized recommendations",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-12 sm:py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yoga-purple/10 to-yoga-pink/10 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-yoga-purple" />
              <span className="text-sm font-medium text-gray-700">
                Join 50,000+ Yogis Worldwide
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yoga-purple to-yoga-pink bg-clip-text text-transparent">
                YogiVerse
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your ultimate platform to connect, share, and grow with a global
              community of yoga practitioners
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/register"
                className="btn-primary inline-flex items-center text-lg px-8 py-4"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/feed"
                className="bg-white text-gray-800 font-medium py-4 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center"
              >
                Explore Community
                <Sparkles className="ml-2 w-5 h-5" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free to Join</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>Certified Instructors</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span>Track Progress</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-10 animate-float hidden lg:block">
            <div className="w-20 h-20 bg-gradient-to-r from-yoga-purple to-yoga-pink rounded-full opacity-20" />
          </div>
          <div className="absolute bottom-20 left-10 animate-float animation-delay-2000 hidden lg:block">
            <div className="w-32 h-32 bg-gradient-to-r from-yoga-orange to-yoga-teal rounded-full opacity-20" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={ref}
        className="px-4 py-16 sm:py-20 sm:px-6 lg:px-8 bg-white/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
          >
            Why Join YogiVerse?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
          >
            Everything you need to deepen your practice and connect with
            like-minded souls
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center text-white mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="px-4 py-16 sm:py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-yoga-purple to-yoga-pink text-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base opacity-90">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-yoga-purple to-yoga-pink bg-clip-text text-transparent">
                  Transform Your Practice
                </span>
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-yoga-purple/20 to-yoga-pink/20 rounded-3xl flex items-center justify-center">
                <Play className="w-24 h-24 text-yoga-purple" />
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-2 animate-pulse">
                <Star className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-yoga-purple to-yoga-pink rounded-3xl p-8 sm:p-12 text-white"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Begin Your Yoga Journey?
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Join thousands of yogis and transform your practice today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-yoga-purple font-semibold py-4 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/feed"
              className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-yoga-purple transition-all duration-200 inline-flex items-center justify-center"
            >
              Browse Content
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
