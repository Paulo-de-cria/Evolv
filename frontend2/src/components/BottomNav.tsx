import { Link, useLocation } from "react-router-dom";
import { Home, Grid, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

const BottomNav = () => {
  const location = useLocation();
  const { itemCount } = useCart();

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/categories", icon: Grid, label: "Categorias" },
    { to: "/cart", icon: ShoppingCart, label: "Carrinho", badge: itemCount },
    { to: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-accent/20 z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-accent text-primary text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
