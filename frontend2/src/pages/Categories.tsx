import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal } from "lucide-react";

const Categories = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [showFilters, setShowFilters] = useState(false);

  const goals = [
    {
      title: "Perda de peso",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
    },
    {
      title: "Saúde e bem-estar",
      image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600",
    },
  ];

  const mainCategories = [
    { name: "Proteína e aminoácidos", count: "240 Produtos" },
    { name: "Vitaminas e minerais", count: "180 Produtos" },
    { name: "Controle de peso", count: "120 Produtos" },
    { name: "Pré-treino e energia", count: "95 Produtos" },
    { name: "Acessórios para treino", count: "70 Produtos" },
    { name: "Herbal e Natural", count: "60 Produtos" },
  ];

  const products = [
    {
      id: "1",
      name: "Whey Protein Isolate Premium",
      price: "R$89.99",
      image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400",
      badge: "WHEY",
      rating: 4.8,
    },
    {
      id: "2",
      name: "Creatina Monohidratada 300g",
      price: "R$45.50",
      image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
      badge: "TOP",
      rating: 4.9,
    },
    {
      id: "3",
      name: "BCAA 2:1:1 120 Cápsulas",
      price: "R$62.00",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      rating: 4.7,
    },
    {
      id: "4",
      name: "Glutamina 300g",
      price: "R$55.99",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
      rating: 4.6,
    },
  ];

  const sortProducts = (prods: typeof products) => {
    const sorted = [...prods];
    switch (sortBy) {
      case "price-asc":
        return sorted.sort(
          (a, b) =>
            parseFloat(a.price.replace("R$", "")) - parseFloat(b.price.replace("R$", ""))
        );
      case "price-desc":
        return sorted.sort(
          (a, b) =>
            parseFloat(b.price.replace("R$", "")) - parseFloat(a.price.replace("R$", ""))
        );
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  const filteredProducts = sortProducts(products).filter((product) => {
    const price = parseFloat(product.price.replace("R$", "").replace(",", "."));
    return price >= priceRange[0] && price <= priceRange[1];
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-accent/20 px-4 py-6 sticky top-0 z-40">
        <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
          Evolv
        </h1>
      </header>

      <main className="px-4 py-6 space-y-8">
        {/* Goals */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Explore por objetivo</h2>
          <div className="grid grid-cols-2 gap-4">
            {goals.map((goal) => (
              <Card
                key={goal.title}
                className="overflow-hidden cursor-pointer hover:shadow-gold transition-all duration-300 border-accent/20"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={goal.image}
                      alt={goal.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                      <h3 className="text-accent font-bold text-lg p-4">{goal.title}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Categories */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Principais categorias</h2>
          <div className="space-y-3">
            {mainCategories.map((category) => (
              <Card
                key={category.name}
                className="cursor-pointer hover:shadow-md transition-shadow border-accent/20"
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <span className="font-semibold">{category.name}</span>
                  <span className="text-sm text-accent font-semibold">{category.count}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Filters and Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Produtos</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-accent/30"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {showFilters && (
            <Card className="mb-4 border-accent/20">
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Ordenar por:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-accent/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Destaques</SelectItem>
                      <SelectItem value="price-asc">Menor preço</SelectItem>
                      <SelectItem value="price-desc">Maior preço</SelectItem>
                      <SelectItem value="rating">Melhor avaliação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Faixa de preço: R${priceRange[0]} - R${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={200}
                    step={10}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Categories;
