import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-card border-b border-accent/20 px-4 py-6">
          <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Carrinho
          </h1>
        </header>

        <main className="flex flex-col items-center justify-center min-h-[70vh] px-4">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2 text-lg">Seu carrinho está vazio</p>
          <p className="text-sm text-muted-foreground mb-6">
            Adicione produtos para começar suas compras
          </p>
          <Link to="/">
            <Button className="bg-gradient-gold hover:opacity-90 text-primary font-semibold">
              Continuar comprando
            </Button>
          </Link>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="bg-card border-b border-accent/20 px-4 py-6 sticky top-0 z-40">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Carrinho
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-destructive hover:text-destructive"
          >
            Limpar tudo
          </Button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-4">
        {items.map((item) => (
          <Card key={`${item.id}-${item.flavor}-${item.size}`} className="border-accent/20">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  {item.flavor && (
                    <p className="text-xs text-muted-foreground">Sabor: {item.flavor}</p>
                  )}
                  {item.size && (
                    <p className="text-xs text-muted-foreground">Tamanho: {item.size}</p>
                  )}
                  <p className="text-lg font-bold text-accent mt-2">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-accent/30"
                    onClick={() => updateQuantity(`${item.id}-${item.flavor}-${item.size}`, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-accent/30"
                    onClick={() => updateQuantity(`${item.id}-${item.flavor}-${item.size}`, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeFromCart(`${item.id}-${item.flavor}-${item.size}`)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      {/* Checkout Footer */}
      <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-accent/20 px-4 py-4 z-40">
        <div className="max-w-screen-xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-accent">R$ {total.toFixed(2)}</span>
          </div>
          <Button className="w-full h-12 bg-gradient-gold hover:opacity-90 text-primary font-semibold text-lg">
            Finalizar Compra
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Cart;
