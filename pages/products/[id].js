import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const primaryUrl = `https://fakestoreapi.com/products/${id}`;
      const fallbackUrl = `https://dummyjson.com/products/${id}`;

      try {
        const res = await fetch(primaryUrl);
        if (!res.ok) throw new Error("Hlavné rozhranie API neodpovedá");

        const data = await res.json();
        setProduct(data);
        } 
        
        catch (primaryError) {
        console.warn("Hlavné rozhranie API nie je k dispozícii:", primaryError.message);

        try {
          const res = await fetch(fallbackUrl);
          if (!res.ok) throw new Error("Alternatívne rozhranie API nereaguje");

          const data = await res.json();

          // Prispôsobenie údajov štruktúre fakestoreapi
          const adapted = {
            id: data.id,
            title: data.title,
            price: data.price,
            image: data.thumbnail,
            description: data.description,
            category: data.category || "other",
          };

            setProduct(adapted);
            setError("Zobrazený produkt je zo záložného zdroja.");
        } 
            catch (fallbackError) {
            console.error("Chyba pri oboch rozhraniach API:", fallbackError.message);
            setError("Nepodarilo sa načítať položku.");
            }
        }
    };

    if (user) {
      fetchProduct();
    }
  }, [id, user]);

  if (!user || !product) return null;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-white bg-black hover:bg-[#333333] px-4 py-2 rounded font-semibold transition-colors shadow-md"
            >
        <span className="text-lg">←</span> Späť
        </button>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded shadow">
          <img
            src={product.image}
            alt={product.title}
            className="w-full md:w-1/3 object-contain max-h-80"
          />

          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <p className="text-gray-500 italic mb-4">{product.category}</p>
            <p className="text-lg font-semibold text-green-600 mb-4">
              ${product.price}
            </p>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}
