import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  badge?: string;
  rating?: number;
}

const ProductCard = ({ id, name, price, image, badge, rating }: ProductCardProps) => {
  const { addToCart } = useCart();
  const priceNumber = parseFloat(price.replace("R$", "").replace(",", "."));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id,
      name,
      price: priceNumber,
      image,
    });
  };

  return (
    <Link to={`/product/${id}`}>
      <Card className="overflow-hidden hover:shadow-gold transition-all duration-300 border-border/50">
        <CardContent className="p-0">
          <div className="relative aspect-square bg-muted">
            {badge && (
              <div className="absolute top-2 left-2 bg-gradient-gold text-primary text-xs font-bold px-2 py-1 rounded">
                {badge}
              </div>
            )}
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">{name}</h3>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-accent">{price}</p>
              {rating && (
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-accent">★</span>
                  <span className="font-semibold">{rating}</span>
                </div>
              )}
            </div>
            <Button
              className="w-full bg-gradient-gold hover:opacity-90 text-primary font-semibold"
              onClick={handleAddToCart}
            >
              Adicionar ao carrinho
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
