"use client";

import {
  useState,
  useEffect,
  useRef,
  InputHTMLAttributes,
  useCallback,
  memo,
} from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { toast } from "react-hot-toast";

// Tipado para InputField props
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  type: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  error?: string;
}

const InputField = memo<InputFieldProps>(
  ({ id, label, type, icon: Icon, error, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const togglePassword = useCallback(() => {
      setShowPassword((v) => !v);
    }, []);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    return (
      <div className="space-y-2 relative">
        <div className="relative">
          {Icon && (
            <Icon
              className={`h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                error
                  ? "text-red-400"
                  : isFocused
                    ? "text-yellow-300"
                    : "text-yellow-400"
              }`}
            />
          )}
          <input
            id={id}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            className={`w-full pl-10 pr-12 py-4 bg-gray-800/60 border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-700 focus:ring-yellow-500 focus:border-transparent"
            }`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          <label
            htmlFor={id}
            className={`absolute left-10 transition-all duration-300 transform pointer-events-none ${
              (props.value as string) || isFocused
                ? `-top-3 text-xs px-2 rounded-full ${
                    error
                      ? "text-red-400 bg-gray-900"
                      : "text-yellow-400 bg-gray-900"
                  }`
                : "top-1/2 -translate-y-1/2 text-gray-400"
            }`}
          >
            {label}
          </label>
          {type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
              onClick={togglePassword}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-red-400 text-sm mt-1 ml-1">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";

// Tipado para SocialButton props
interface SocialButtonProps {
  provider: string;
  label: string;
  iconSrc: string;
}

const SocialButton = memo<SocialButtonProps>(({ provider, label, iconSrc }) => {
  const handleSignIn = useCallback(() => {
    signIn(provider, { callbackUrl: "/dashboard" });
  }, [provider]);

  return (
    <button
      type="button"
      onClick={handleSignIn}
      className="flex items-center justify-center space-x-2 bg-gray-800/60 hover:bg-gray-700/90 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 border border-gray-700 hover:border-yellow-400/50 shadow-md hover:shadow-yellow-500/10"
    >
      <Image
        src={iconSrc}
        alt={label}
        width={20}
        height={20}
        className="h-5 w-5"
        loading="lazy"
      />
      <span>{label}</span>
    </button>
  );
});

SocialButton.displayName = "SocialButton";

// Particle background optimizado con requestIdleCallback
const ParticleBackground = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Reducir número de partículas para mejor rendimiento
    const PARTICLE_COUNT = 25;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      // Reinicializar partículas solo si cambia el tamaño
      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.3, // Reducir velocidad
          speedY: (Math.random() - 0.5) * 0.3,
          color: `rgba(255,204,0,${Math.random() * 0.3 + 0.1})`,
        }));
      }
    };

    resize();

    let lastTime = 0;
    const TARGET_FPS = 30; // Reducir FPS para mejor rendimiento
    const FRAME_DURATION = 1000 / TARGET_FPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime < FRAME_DURATION) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Optimizar rebote en bordes
        if (p.x <= 0 || p.x >= canvas.width) p.speedX *= -1;
        if (p.y <= 0 || p.y >= canvas.height) p.speedY *= -1;

        // Usar fillRect en lugar de arc para mejor rendimiento en partículas pequeñas
        ctx.fillStyle = p.color;
        ctx.fillRect(
          p.x - p.radius,
          p.y - p.radius,
          p.radius * 2,
          p.radius * 2
        );
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Iniciar animación solo cuando el navegador esté disponible
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        animationRef.current = requestAnimationFrame(animate);
      });
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      requestAnimationFrame(resize);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30 z-0"
      style={{ willChange: "transform" }}
    />
  );
});

ParticleBackground.displayName = "ParticleBackground";

export default function AuthForm() {
  const router = useRouter();
  const { status } = useSession();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Redirigir si ya hay sesión
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Limpiar errores de forma optimizada
      setErrors((prev) => {
        if (!prev[name]) return prev;
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });

      // Validación de contraseñas optimizada
      if (
        name === "confirmPassword" ||
        (name === "password" && activeTab === "register")
      ) {
        const password = name === "password" ? value : formData.password;
        const confirmPassword =
          name === "confirmPassword" ? value : formData.confirmPassword;

        if (confirmPassword && password !== confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Las contraseñas no coinciden",
          }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.confirmPassword;
            return newErrors;
          });
        }
      }
    },
    [formData.password, formData.confirmPassword, activeTab]
  );

  const validateForm = useCallback(() => {
    const { name, email, password, confirmPassword } = formData;
    const newErrors: { [key: string]: string } = {};

    if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Por favor, ingresa un correo válido";

    if (!/^(?=.*[A-Z])(?=.*[a-zA-Z].*[a-zA-Z]).{6,}$/.test(password))
      newErrors.password = "Mínimo 6 caracteres, 2 letras y 1 mayúscula";

    if (activeTab === "register") {
      if (!name.trim()) newErrors.name = "El nombre es obligatorio";
      if (password !== confirmPassword)
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      if (!confirmPassword)
        newErrors.confirmPassword = "Confirma tu contraseña";
    }

    setErrors(newErrors);

    // Mostrar errores de forma batch
    const errorMessages = Object.values(newErrors);
    if (errorMessages.length > 0) {
      errorMessages.forEach((error) => toast.error(error));
    }

    return errorMessages.length === 0;
  }, [formData, activeTab]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setLoading(true);
      try {
        const { name, email, password } = formData;

        if (activeTab === "register") {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });

          let data: { error?: string; message?: string } = {};
          try {
            data = await res.json();
          } catch {
            data = { error: await res.text() };
          }

          if (!res.ok) {
            toast.error(
              res.status === 409
                ? "Este correo ya está registrado."
                : data.error || "Error al registrar"
            );
            if (res.status === 409) {
              setTimeout(() => setActiveTab("login"), 2000);
            }
            return;
          }

          toast.success(
            "¡Registro exitoso! Revisa tu correo para verificar tu cuenta."
          );
          setFormData({
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
          });
          router.push(
            "/auth/verify-request?email=" + encodeURIComponent(email)
          );
          return;
        }

        if (activeTab === "login") {
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });
          if (result?.error) {
            toast.error("Error al iniciar sesión. Verifica tus credenciales.");
          } else if (result?.ok) {
            window.location.href = "/dashboard";
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Error del servidor. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    },
    [formData, activeTab, validateForm, router]
  );

  const handleTabChange = useCallback(
    (tab: "login" | "register") => {
      if (tab === activeTab) return;
      setIsAnimating(true);
      setErrors({});
      setTimeout(() => {
        setActiveTab(tab);
        setFormData({ email: "", password: "", confirmPassword: "", name: "" });
        setIsAnimating(false);
      }, 200);
    },
    [activeTab]
  );

  const goHome = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src="/images/logo-explore-heaven.png"
          alt="Logo Explore Heaven"
          fill
          className="object-contain object-center"
          quality={30}
          priority={false}
          loading="lazy"
        />
      </div>

      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/90 z-0" />

      <button
        onClick={goHome}
        className="absolute top-6 left-6 z-50 flex items-center space-x-1 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm border border-yellow-400/30 text-yellow-400 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-400/20"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span className="font-medium">Regresar</span>
      </button>

      <div className="w-full max-w-md z-10">
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-4">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30"></div>
            <div className="relative w-full h-full bg-gray-800/80 backdrop-blur-sm border border-yellow-400/30 rounded-full flex items-center justify-center p-3 shadow-lg">
              <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/logoExploreee.png"
                  alt="Explore Heaven Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                  loading="eager"
                  priority
                />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-1">
            Explore Heaven
          </h1>
          <p className="text-gray-400">Descubre experiencias únicas</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700/50">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 py-4 px-6 text-center font-bold transition-all duration-300 ${
                activeTab === "login"
                  ? "text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-gray-800/50 to-transparent"
                  : "text-gray-400 hover:text-yellow-300"
              }`}
              onClick={() => handleTabChange("login")}
            >
              Iniciar Sesión
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-bold transition-all duration-300 ${
                activeTab === "register"
                  ? "text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-gray-800/50 to-transparent"
                  : "text-gray-400 hover:text-yellow-300"
              }`}
              onClick={() => handleTabChange("register")}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div
              className={`space-y-4 transition-all duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
            >
              {activeTab === "register" && (
                <InputField
                  id="name"
                  label="Nombre completo"
                  type="text"
                  name="name"
                  icon={UserIcon}
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
              )}

              <InputField
                id="email"
                label="Correo electrónico"
                type="email"
                name="email"
                icon={EnvelopeIcon}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              <InputField
                id="password"
                label="Contraseña"
                type="password"
                name="password"
                icon={LockClosedIcon}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                minLength={6}
              />

              {activeTab === "register" && (
                <InputField
                  id="confirmPassword"
                  label="Confirmar contraseña"
                  type="password"
                  name="confirmPassword"
                  icon={ShieldCheckIcon}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center space-x-2 font-bold py-4 px-4 rounded-xl transition-all duration-300 mt-6 ${
                  loading
                    ? "bg-yellow-600 cursor-not-allowed opacity-70"
                    : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 hover:shadow-yellow-500/30"
                } text-gray-900 shadow-lg`}
              >
                <span>
                  {loading
                    ? activeTab === "login"
                      ? "Iniciando sesión..."
                      : "Registrando..."
                    : activeTab === "login"
                      ? "Iniciar Sesión"
                      : "Crear Cuenta"}
                </span>
                {!loading && <ArrowRightIcon className="h-5 w-5" />}
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
              {activeTab === "login" ? (
                <>
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                    onClick={() => handleTabChange("register")}
                  >
                    Regístrate
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tienes cuenta?{" "}
                  <button
                    type="button"
                    className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                    onClick={() => handleTabChange("login")}
                  >
                    Inicia sesión
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        <div className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Explore Heaven. Todos los derechos
          reservados.
        </div>
      </div>
    </div>
  );
}
