import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Settings, LogOut } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border px-4 py-6">
        <h1 className="text-2xl font-bold text-primary">Perfil</h1>
      </header>

      <main className="px-4 py-6 space-y-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">Meus Dados</span>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">Configurações</span>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full">
          <LogOut className="h-5 w-5 mr-2" />
          Sair
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
