// components/WelcomeBanner.tsx
export default function WelcomeBanner({ name }: { name?: string | null }) {
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {name || "Explorer"}!
      </h1>
      <p className="mt-2 text-gray-800">
        Ready for your next safe adventure in Medellín?
      </p>
    </div>
  );
}
