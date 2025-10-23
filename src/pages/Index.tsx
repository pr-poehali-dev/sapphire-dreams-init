import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const products: Product[] = [
    {
      id: 1,
      name: 'Абрама на час',
      price: 19990,
      image: 'https://v3b.fal.media/files/b/zebra/eMBk-BioRGXMKPWnnTtAk_output.png',
      category: 'Популярное',
      description: 'Абрама в вашем распоряжении целый час'
    },
    {
      id: 2,
      name: 'Абрама на день',
      price: 20499,
      image: 'https://v3b.fal.media/files/b/zebra/eMBk-BioRGXMKPWnnTtAk_output.png',
      category: 'Хит продаж',
      description: 'Целый день с Абрамой'
    },
    {
      id: 3,
      name: 'Абрама на всегда',
      price: 0,
      image: 'https://v3b.fal.media/files/b/zebra/eMBk-BioRGXMKPWnnTtAk_output.png',
      category: 'Бесплатно',
      description: 'Абрама остается с вами навсегда'
    }
  ];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: "Товар добавлен в корзину",
      description: product.name,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.email || !orderForm.phone) {
      toast({
        title: "Заполните все поля",
        description: "Для оформления заказа необходимо заполнить все обязательные поля",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Заказ оформлен!",
      description: `Спасибо, ${orderForm.name}! Мы свяжемся с вами в ближайшее время.`,
    });
    setCart([]);
    setOrderForm({ name: '', email: '', phone: '', address: '' });
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-cyan-50/30">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-secondary rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">А</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Абрама.Ру
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Icon name="Heart" size={24} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="User" size={24} />
            </Button>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={24} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold">Корзина покупок</SheetTitle>
                </SheetHeader>
                
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <Icon name="ShoppingBag" size={64} className="text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">Корзина пуста</p>
                    <p className="text-sm text-muted-foreground mt-2">Добавьте товары из каталога</p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    <div className="space-y-4">
                      {cart.map(item => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm">{item.name}</h3>
                                <p className="text-lg font-bold text-primary mt-1">
                                  {item.price === 0 ? 'Бесплатно' : `${item.price} ₽`}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Icon name="Minus" size={14} />
                                  </Button>
                                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 ml-auto text-destructive"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center text-xl font-bold">
                          <span>Итого:</span>
                          <span className="text-primary">
                            {getTotalPrice() === 0 ? 'Бесплатно' : `${getTotalPrice()} ₽`}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <form onSubmit={handleOrder} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Имя *</Label>
                        <Input
                          id="name"
                          value={orderForm.name}
                          onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                          placeholder="Иван Иванов"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={orderForm.email}
                          onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                          placeholder="ivan@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={orderForm.phone}
                          onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Адрес доставки</Label>
                        <Input
                          id="address"
                          value={orderForm.address}
                          onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                          placeholder="Улица, дом, квартира"
                        />
                      </div>
                      <Button type="submit" className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                        Оформить заказ
                      </Button>
                    </form>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-fade-in">
            Раздел Абрама
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Выберите подходящий тариф и получите Абраму в своё распоряжение
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-primary/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-3xl font-bold text-primary">
                        {product.price === 0 ? 'Бесплатно' : `${product.price} ₽`}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full h-12 font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                  >
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    {product.price === 0 ? 'Получить бесплатно' : 'В корзину'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20 p-12 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 text-center">
          <h3 className="text-3xl font-bold mb-4">Станьте частью сообщества Абрама</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Подпишитесь на рассылку и получайте эксклюзивные предложения и новости первыми
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <Input placeholder="Ваш email" className="h-12" />
            <Button className="h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              Подписаться
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Абрама.Ру
              </h4>
              <p className="text-gray-400">
                Интернет-магазин услуг Абрамы с доставкой по всей России
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@abrama.ru
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (999) 123-45-67
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Социальные сети</h4>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Icon name="Instagram" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Icon name="Facebook" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Icon name="Twitter" size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Абрама.Ру. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
