import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Shield, Clock, Star, Users, Briefcase, MessageSquare, ChevronRight, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const categories = [
  { id: 1, name: 'Web Development', icon: '💻', count: 1250 },
  { id: 2, name: 'Mobile Apps', icon: '📱', count: 850 },
  { id: 3, name: 'Design & Creative', icon: '🎨', count: 2100 },
  { id: 4, name: 'Writing & Content', icon: '✍️', count: 1650 },
  { id: 5, name: 'Marketing', icon: '📊', count: 980 },
  { id: 6, name: 'Video & Animation', icon: '🎬', count: 720 },
  { id: 7, name: 'Data Science', icon: '📈', count: 540 },
  { id: 8, name: 'Business Consulting', icon: '💼', count: 620 },
];

const featuredServices = [
  {
    id: 1,
    title: 'Professional Website Development',
    description: 'Full-stack web development with modern technologies',
    freelancer: { name: 'Sarah Johnson', avatar: 'SJ', rating: 4.9, reviews: 127 },
    price: 2500,
    deliveryTime: '7 days',
    category: 'Web Development',
  },
  {
    id: 2,
    title: 'Mobile App UI/UX Design',
    description: 'Beautiful and intuitive mobile app designs',
    freelancer: { name: 'Michael Chen', avatar: 'MC', rating: 5.0, reviews: 89 },
    price: 1800,
    deliveryTime: '5 days',
    category: 'Design & Creative',
  },
  {
    id: 3,
    title: 'SEO & Content Marketing',
    description: 'Boost your online presence with proven strategies',
    freelancer: { name: 'Emma Williams', avatar: 'EW', rating: 4.8, reviews: 156 },
    price: 1200,
    deliveryTime: '10 days',
    category: 'Marketing',
  },
  {
    id: 4,
    title: 'AI & Machine Learning Solutions',
    description: 'Custom ML models and AI integration',
    freelancer: { name: 'David Kumar', avatar: 'DK', rating: 4.9, reviews: 73 },
    price: 3500,
    deliveryTime: '14 days',
    category: 'Data Science',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'John Martinez',
    role: 'CEO, TechStart Inc',
    avatar: 'JM',
    content: 'Found the perfect developer for our project. The platform made it incredibly easy to connect with talented freelancers.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Lisa Anderson',
    role: 'Marketing Director',
    avatar: 'LA',
    content: 'The quality of work and professionalism exceeded our expectations. Highly recommend this platform!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Robert Taylor',
    role: 'Product Manager',
    avatar: 'RT',
    content: 'Seamless experience from start to finish. The messaging system and project tracking are excellent.',
    rating: 5,
  },
];

const stats = [
  { label: 'Active Freelancers', value: '50K+', icon: Users },
  { label: 'Projects Completed', value: '100K+', icon: Briefcase },
  { label: 'Client Satisfaction', value: '98%', icon: Star },
  { label: 'Avg. Response Time', value: '2 hrs', icon: Clock },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/browse?q=${searchQuery}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 text-sm px-4 py-1.5" variant="secondary">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              Trusted by 50,000+ businesses worldwide
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Find the Perfect
              <span className="block mt-2">
                <span className="gradient-text">Freelancer</span> for Your Project
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Connect with talented professionals ready to bring your vision to life. Post a project and get quotes within minutes.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-2 p-2 bg-card rounded-xl shadow-elegant border">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="What service are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-base border-0 focus-visible:ring-0 bg-transparent"
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8">
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {['Web Development', 'Design', 'Writing', 'Marketing'].map((cat) => (
                <Button
                  key={cat}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/browse?category=${cat}`)}
                  className="rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore Popular Categories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse thousands of services across different categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="card-hover cursor-pointer group border-2 hover:border-primary"
                onClick={() => navigate(`/browse?category=${category.name}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} services</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Services</h2>
              <p className="text-lg text-muted-foreground">Top-rated services from our best freelancers</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/browse')} className="hidden sm:inline-flex">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <Card key={service.id} className="card-hover cursor-pointer flex flex-col" onClick={() => navigate(`/service/${service.id}`)}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{service.category}</Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">{service.freelancer.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{service.freelancer.name}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{service.freelancer.rating}</span>
                        <span className="text-muted-foreground">({service.freelancer.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.deliveryTime}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t mt-auto">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-muted-foreground">Starting at</p>
                      <p className="text-xl font-bold">${service.price}</p>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Search,
                title: 'Find Services',
                description: 'Browse thousands of services or post your project requirements',
              },
              {
                step: '02',
                icon: MessageSquare,
                title: 'Connect & Discuss',
                description: 'Message freelancers directly to discuss your project details',
              },
              {
                step: '03',
                icon: Award,
                title: 'Get It Done',
                description: 'Collaborate with your freelancer and receive high-quality work',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative">
                  {index < 2 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary to-transparent" />
                  )}
                  <Card className="relative border-2">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-4 text-2xl font-bold">
                        {item.step}
                      </div>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10 text-secondary mb-4">
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription className="text-base">{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Our Platform</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The most trusted freelance marketplace
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Secure Payments', description: 'Your money is safe with our escrow system' },
              { icon: Zap, title: 'Fast Delivery', description: 'Get your projects completed on time' },
              { icon: Star, title: 'Top Talent', description: 'Work with verified, skilled professionals' },
              { icon: Users, title: '24/7 Support', description: 'Our team is here to help you anytime' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4 mx-auto">
                      <Icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted by businesses and entrepreneurs worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-2">
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10" />
            <CardContent className="relative p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied clients and freelancers. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-base" onClick={() => navigate('/browse')}>
                  Find Freelancers
                </Button>
                <Button size="lg" variant="outline" className="text-base" onClick={() => navigate('/create-service')}>
                  Become a Freelancer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}