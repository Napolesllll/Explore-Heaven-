'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon, 
  ArrowRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon 
} from '@heroicons/react/24/outline';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

function InputField({ id, label, type, icon: Icon, ...props }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="space-y-2 relative">
      <div className="relative">
        {Icon && <Icon className={`h-5 w-5 text-yellow-400 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${isFocused ? 'text-yellow-300' : ''}`} />}
        <input
          id={id}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          className="w-full pl-10 pr-12 py-4 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <label 
          htmlFor={id} 
          className={`absolute left-10 transition-all duration-300 transform ${
            props.value || isFocused 
              ? '-top-3 text-xs text-yellow-400 bg-gray-900 px-2 rounded-full' 
              : 'top-1/2 -translate-y-1/2 text-gray-400'
          } pointer-events-none`}
        >
          {label}
        </label>
        {type === 'password' && (
          <button 
            type="button" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SocialButton({ provider, label, iconSrc }: any) {
  return (
    <button
      type="button"
      onClick={() => signIn(provider, { callbackUrl: '/dashboard' })}
      className="flex items-center justify-center space-x-2 bg-gray-800/60 hover:bg-gray-700/90 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 border border-gray-700 hover:border-yellow-400/50 shadow-md hover:shadow-yellow-500/10"
    >
      <Image src={iconSrc} alt={label} width={20} height={20} className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particles: any[] = [];
    const particleCount = 50;
    
    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `rgba(255, 204, 0, ${Math.random() * 0.4 + 0.1})`
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full opacity-30 z-0"
    />
  );
};

export default function AuthForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const { name, email, password } = formData;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Por favor, ingresa un correo válido.');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z].*[a-zA-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        'La contraseña debe tener al menos 6 caracteres, incluir al menos dos letras y una mayúscula.'
      );
      return false;
    }

    if (activeTab === 'register' && name.trim() === '') {
      toast.error('El nombre es obligatorio para registrarse.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const { name, email, password } = formData;

    if (activeTab === 'register') {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || 'Error al registrar');
          setLoading(false);
          return;
        }

        toast.success('Registro exitoso. Iniciando sesión...');
      } catch (err) {
        toast.error('Error del servidor al registrar.');
        setLoading(false);
        return;
      }
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Bienvenido/a 👋');
      router.push('/dashboard');
    }

    setLoading(false);
  };

  const handleTabChange = (tab: 'login' | 'register') => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with subtle logo */}
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src="/images/logo-explore-heaven.png"
          alt="Logo Explore Heaven"
          fill
          className="object-contain object-center"
          quality={50}
        />
      </div>
      
      {/* Particle background */}
      <ParticleBackground />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/90 z-0" />

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-50 flex items-center space-x-1 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm border border-yellow-400/30 text-yellow-400 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-400/20"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span className="font-medium">Regresar</span>
      </button>

      {/* Main card */}
      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-4">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30"></div>
            <div className="relative w-full h-full bg-gray-800/80 backdrop-blur-sm border border-yellow-400/30 rounded-full flex items-center justify-center p-3 shadow-lg">
              <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
                <Image 
                  src="/images/logo-explore-heaven.png" 
                  alt="Explore Heaven Logo" 
                  width={80} 
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-1">Explore Heaven</h1>
          <p className="text-gray-400">Descubre experiencias únicas</p>
        </div>
        
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700/50">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 py-4 px-6 text-center font-bold transition-all duration-300 ${
                activeTab === 'login'
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-gray-800/50 to-transparent'
                  : 'text-gray-400 hover:text-yellow-300'
              }`}
              onClick={() => handleTabChange('login')}
            >
              Iniciar Sesión
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-bold transition-all duration-300 ${
                activeTab === 'register'
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-gray-800/50 to-transparent'
                  : 'text-gray-400 hover:text-yellow-300'
              }`}
              onClick={() => handleTabChange('register')}
            >
              Registrarse
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              {activeTab === 'register' && (
                <InputField
                  id="name"
                  label="Nombre"
                  type="text"
                  name="name"
                  placeholder=""
                  icon={UserIcon}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              )}

              <InputField
                id="email"
                label="Email"
                type="email"
                name="email"
                placeholder=""
                icon={EnvelopeIcon}
                value={formData.email}
                onChange={handleChange}
                required
              />

              <InputField
                id="password"
                label="Contraseña"
                type="password"
                name="password"
                placeholder=""
                icon={LockClosedIcon}
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center space-x-2 font-bold py-4 px-4 rounded-xl transition-all duration-300 mt-4 ${
                  loading
                    ? 'bg-yellow-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500'
                } text-gray-900 shadow-lg hover:shadow-yellow-500/30`}
              >
                <span>{activeTab === 'login' ? 'Ingresar' : 'Crear cuenta'}</span>
                {!loading && <ArrowRightIcon className="h-5 w-5" />}
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-700"></div>
              <span className="px-4 text-gray-500 text-sm">o continúa con</span>
              <div className="flex-1 border-t border-gray-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SocialButton
                provider="google"
                label="Google"
                iconSrc="https://authjs.dev/img/providers/google.svg"
              />
              <SocialButton
                provider="facebook"
                label="Facebook"
                iconSrc="https://authjs.dev/img/providers/facebook.svg"
              />
            </div>

            <div className="text-center text-gray-400 text-sm pt-4">
              {activeTab === 'login' ? (
                <>
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                    onClick={() => handleTabChange('register')}
                  >
                    Regístrate
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tienes cuenta?{' '}
                  <button
                    type="button"
                    className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                    onClick={() => handleTabChange('login')}
                  >
                    Inicia sesión
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Explore Heaven. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}