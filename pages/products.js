import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ProductsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Presmerovanie, ak nie je autorizované
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  // Vyhľadávanie údajov
  useEffect(() => {
    const fetchProducts = async () => {
      const primaryUrl = "https://fakestoreapi.com/products";
      const fallbackUrl = "https://dummyjson.com/products";

      try {
        const res = await fetch(primaryUrl);
        if (!res.ok) throw new Error("Hlavné rozhranie API neodpovedá");

        const data = await res.json();
        setProducts(data);
      } catch (primaryError) {
        console.warn("Hlavné rozhranie API nie je k dispozícii:", primaryError.message);

        try {
          const res = await fetch(fallbackUrl);
          if (!res.ok) throw new Error("Alternatívne rozhranie API nereaguje");

          const data = await res.json();

          // Prenesenie štruktúry do fakestoreapi
          const adapted = data.products.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            image: p.thumbnail,
          }));

          setProducts(adapted);
          setError("Načítanie položiek zo záložného zdroja.");
        } catch (fallbackError) {
          console.error("Chyba pri oboch rozhraniach API:", fallbackError.message);
          setError("Nepodarilo sa nahrať položky.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProducts();
    }
  }, [user]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Zoznam tovaru</h1>
        </div>

        {/* Stav zaťaženia */}
        {loading && <p className="text-gray-500">Nakladanie tovarov...</p>}

        {/* Chyba */}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Zoznam tovaru */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
               <div className="border p-4 rounded hover:shadow cursor-pointer bg-white flex flex-col h-[300px]">
                <img
                src={product.image}
                alt={product.title}
                className="h-40 w-full object-contain mb-4"
                />

                <div className="min-h-[48px]">
                    <h2 className="text-sm font-semibold line-clamp-2">{product.title}</h2>
                </div>

                    <p className="text-green-600 font-bold mt-2">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

