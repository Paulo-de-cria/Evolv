import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";

const Home = () => {
  const categories = [
    "Perda de peso",
    "Crescimento muscular",
    "Saúde e bem-estar",
    "Vitaminas e minerais",
  ];

  const featuredProducts = [
    {
      id: "1",
      name: "Whey Protein Isolate",
      price: "R$49.99",
      image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400",
      badge: "WHEY",
      rating: 4.8,
    },
    {
      id: "2",
      name: "Evolv Elite Protein Bar",
      price: "R$24.50",
      image: "https://grabthegold.com/cdn/shop/files/GrabTheGoldChocolatePeanutButterSnackBar12BarBox.jpg?v=1701980000&width=400",
      badge: "ELITEBAR",
      rating: 4.9,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-card border-b border-accent/20 z-40 px-4 py-4">
        <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4">
          Evolv
        </h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos ou categorias.."
            className="pl-10 h-12 border-accent/30 focus-visible:ring-accent"
          />
        </div>
      </header>

      <main className="px-4 py-6 space-y-8">
        {/* Featured Products */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Principais escolhas de hoje</h2>
          <div className="grid grid-cols-2 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Explorar categorias</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="h-20 text-base font-semibold border-accent/30 hover:bg-gradient-gold hover:text-primary transition-all duration-300"
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Professional Recommendations */}
        <section className="bg-gradient-primary text-white rounded-2xl p-6 shadow-gold">
          <h2 className="text-2xl font-bold mb-2 text-accent">
            Recomendações profissionais
          </h2>
          <p className="mb-4">Impulsione sua jornada com orientação especializada</p>
          <p className="text-sm mb-4 opacity-90">
            Planos personalizados de nutricionistas certificados.
          </p>
          <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-primary font-semibold">
            Saiba mais
          </Button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
