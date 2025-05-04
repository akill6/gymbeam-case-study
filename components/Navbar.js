import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogoClick = () => {
    if (user) {
      router.push("/products");
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4">
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src="/GymBeam.png" alt="GymBeam" className="h-8 w-auto" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center items-end gap-1 sm:gap-4 text-right sm:text-left">
          {user && (
            <span className="text-sm text-gray-700 leading-tight">
              Ahoj, {user.name}
            </span>
          )}
          <button
            onClick={logout}
            className="bg-black text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors duration-200"
          >
            Vystúpiť
          </button>
        </div>
      </div>
    </nav>
  );
}


