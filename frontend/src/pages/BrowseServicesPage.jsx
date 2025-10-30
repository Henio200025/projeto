import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Clock, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const mockServices = [
  {
    id: 1,
    title: 'Full-Stack Web Application Development',
    description: 'I will create a responsive, modern web application using React, Node.js, and MongoDB',
    freelancer: { name: 'Sarah Johnson', avatar: 'SJ', rating: 4.9, reviews: 127, location: 'New York, USA' },
    price: 2500,
    deliveryTime: '7 days',
    category: 'Web Development',
    tags: ['React', 'Node.js', 'MongoDB', 'Full-Stack'],
  },
  {
    id: 2,
    title: 'Professional Mobile App UI/UX Design',
    description: 'Beautiful and intuitive mobile app designs for iOS and Android platforms',
    freelancer: { name: 'Michael Chen', avatar: 'MC', rating: 5.0, reviews: 89, location: 'San Francisco, USA' },
    price: 1800,
    deliveryTime: '5 days',
    category: 'Design & Creative',
    tags: ['UI/UX', 'Mobile Design', 'Figma', 'Prototyping'],
  },
  {
    id: 3,
    title: 'SEO Optimization & Content Marketing Strategy',
    description: 'Comprehensive SEO audit and content marketing plan to boost your online presence',
    freelancer: { name: 'Emma Williams', avatar: 'EW', rating: 4.8, reviews: 156, location: 'London, UK' },
    price: 1200,
    deliveryTime: '10 days',
    category: 'Marketing',
    tags: ['SEO', 'Content Marketing', 'Analytics', 'Strategy'],
  },
  {
    id: 4,
    title: 'Custom Machine Learning Model Development',
    description: 'AI and ML solutions tailored to your business needs with full integration support',
    freelancer: { name: 'David Kumar', avatar: 'DK', rating: 4.9, reviews: 73, location: 'Bangalore, India' },
    price: 3500,
    deliveryTime: '14 days',
    category: 'Data Science',
    tags: ['Machine Learning', 'Python', 'TensorFlow', 'AI'],
  },
  {
    id: 5,
    title: 'Professional Video Editing & Post-Production',
    description: 'High-quality video editing for marketing, social media, and corporate videos',
    freelancer: { name: 'Lisa Rodriguez', avatar: 'LR', rating: 4.7, reviews: 94, location: 'Los Angeles, USA' },
    price: 800,
    deliveryTime: '4 days',
    category: 'Video & Animation',
    tags: ['Video Editing', 'Adobe Premiere', 'After Effects', 'Color Grading'],
  },
  {
    id: 6,
    title: 'E-commerce Store Setup & Optimization',
    description: 'Complete Shopify or WooCommerce store setup with conversion optimization',
    freelancer: { name: 'Alex Thompson', avatar: 'AT', rating: 4.8, reviews: 112, location: 'Toronto, Canada' },
    price: 1500,
    deliveryTime: '6 days',
    category: 'Web Development',
    tags: ['E-commerce', 'Shopify', 'WooCommerce', 'Conversion Optimization'],
  },
  {
    id: 7,
    title: 'Professional Copywriting for Marketing',
    description: 'Compelling copy that converts for websites, ads, and email campaigns',
    freelancer: { name: 'Rachel Green', avatar: 'RG', rating: 4.9, reviews: 145, location: 'Sydney, Australia' },
    price: 600,
    deliveryTime: '3 days',
    category: 'Writing & Content',
    tags: ['Copywriting', 'Marketing', 'Content Strategy', 'SEO Writing'],
  },
  {
    id: 8,
    title: 'Brand Identity & Logo Design',
    description: 'Complete brand identity package including logo, color palette, and brand guidelines',
    freelancer: { name: 'Carlos Martinez', avatar: 'CM', rating: 5.0, reviews: 167, location: 'Barcelona, Spain' },
    price: 1100,
    deliveryTime: '7 days',
    category: 'Design & Creative',
    tags: ['Branding', 'Logo Design', 'Visual Identity', 'Brand Guidelines'],
  },
];

const categories = [
  'All Categories',
  'Web Development',
  'Mobile Apps',
  'Design & Creative',
  'Writing & Content',
  'Marketing',
  'Video & Animation',
  'Data Science',
  'Business Consulting',
];

export default function BrowseServicesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState(0);

  const filteredServices = mockServices.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || service.category === selectedCategory;
    const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];
    const matchesRating = service.freelancer.rating >= minRating;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategory === category}
                onCheckedChange={() => setSelectedCategory(category)}
              />
              <Label htmlFor={category} className="text-sm cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={5000}
            step={100}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={() => setMinRating(rating)}
              />
              <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {rating}+
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Time */}
      <div>
        <h3 className="font-semibold mb-3">Delivery Time</h3>
        <div className="space-y-2">
          {['1 day', '3 days', '7 days', '14 days'].map((time) => (
            <div key={time} className="flex items-center space-x-2">
              <Checkbox id={time} />
              <Label htmlFor={time} className="text-sm cursor-pointer">
                {time}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button className="h-12 px-6">Search</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterPanel />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  {selectedCategory === 'All Categories' ? 'All Services' : selectedCategory}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredServices.length} services available
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Refine your search results</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterPanel />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="delivery">Fastest Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="card-hover cursor-pointer flex flex-col"
                  onClick={() => navigate(`/service/${service.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{service.category}</Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-1 mb-4">
                      {service.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {service.freelancer.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{service.freelancer.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{service.freelancer.rating}</span>
                            <span className="text-muted-foreground">({service.freelancer.reviews})</span>
                          </div>
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

            {/* Empty State */}
            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No services found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setPriceRange([0, 5000]);
                  setMinRating(0);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}