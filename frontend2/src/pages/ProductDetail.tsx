import { useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const navigate = useNavigate();
  const [selectedFlavor, setSelectedFlavor] = useState("Chocolate intenso");
  const [selectedSize, setSelectedSize] = useState("30 Porções");

  const flavors = [
    "Sonho de baunilha",
    "Chocolate intenso",
    "Cookies e creme",
    "Espiral de Mocha",
    "Sem sabor",
  ];

  const sizes = ["15 Porções", "30 Porções", "60 Porções"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-card border-b border-border z-40 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-primary">Evolv</h1>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Product Image */}
        <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden">
          <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded">
            ELITEBAR 100
          </div>
          <img
            src="https://grabthegold.com/cdn/shop/files/GrabTheGoldChocolatePeanutButterSnackBar12BarBox.jpg?v=1701980000&width=600"
            alt="Evolv Elite Protein Bar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h2 className="text-sm text-muted-foreground mb-1">Evolv Elite Protein Blend</h2>
          <h1 className="text-2xl font-bold mb-2">Evolv Elite Protein Bar</h1>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">R$59.99</span>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-warning text-warning" />
              <span className="font-semibold">4.8</span>
              <span className="text-sm text-muted-foreground">(2,345 Reviews)</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          Liberte seu potencial com nossa barra premium de proteínas de digestão rápida e recuperação muscular ótimos. 
          Alimente seu corpo com o melhor.
        </p>

        {/* Flavor Selection */}
        <div>
          <h3 className="font-bold mb-3">Escolha seu sabor</h3>
          <div className="flex flex-wrap gap-2">
            {flavors.map((flavor) => (
              <Button
                key={flavor}
                variant={selectedFlavor === flavor ? "default" : "outline"}
                onClick={() => setSelectedFlavor(flavor)}
                className="rounded-full"
              >
                {flavor}
              </Button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <h3 className="font-bold mb-3">Selecione o tamanho (porções)</h3>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => setSelectedSize(size)}
                className="flex-1"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <h3 className="font-bold mb-2">Detalhes do produto</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Criada para desempenho máximo, a barra de proteína Evolv Elite apresenta uma matriz de proteínas de múltiplas fontes, 
              incluindo Isolado de Whey, Caseína Micelar e Albumina de Ovo, garantindo uma liberação prolongada de aminoácidos. 
              Cada porção fornece 25g de proteína pura, essencial para reparo e síntese muscular. Fortificada com BCAAs e Glutamina, 
              acelera a recuperação e reduz dores musculares.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Ingredientes principais</h3>
            <p className="text-sm text-muted-foreground">
              Isolado de Proteína de Whey, Caseína Micelar, Albumina de Ovo, Aromas Naturais e Artificiais, Sucralose
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Modo de uso</h3>
            <p className="text-sm text-muted-foreground">
              Misture uma medida com 240-300 ml de água ou leite. Consuma diariamente.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Principais benefícios</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">•</span>
                <div>
                  <span className="font-semibold text-foreground">Crescimento muscular ideal:</span> Apoia o desenvolvimento de músculo magro e previne a degradação muscular.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">•</span>
                <div>
                  <span className="font-semibold text-foreground">Recuperação aprimorada:</span> Acelera o reparo muscular, reduzindo dores e fadiga.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">•</span>
                <div>
                  <span className="font-semibold text-foreground">Liberação prolongada de energia:</span> Mantém você energizado durante todo o dia.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="sticky bottom-0 bg-background pt-4 pb-6 border-t border-border -mx-4 px-4">
          <Button className="w-full h-14 text-lg font-semibold">
            Adicionar ao carrinho
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
