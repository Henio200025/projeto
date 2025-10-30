import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, CheckCircle2, MessageSquare, Share2, Heart, ChevronLeft, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const mockService = {
  id: 1,
  title: 'Full-Stack Web Application Development',
  description: 'I will create a responsive, modern web application using the latest technologies including React, Node.js, and MongoDB. With over 5 years of experience in full-stack development, I deliver high-quality, scalable solutions tailored to your specific needs.',
  longDescription: `I specialize in building modern, scalable web applications that meet your business objectives. My services include:

• Custom web application development from scratch
• Frontend development with React, Vue, or Angular
• Backend development with Node.js, Python, or Java
• Database design and optimization
• API development and integration
• Responsive design for all devices
• Performance optimization
• Security best practices
• Testing and quality assurance
• Deployment and maintenance support

I follow agile methodology and maintain clear communication throughout the project. You'll receive regular updates and have the opportunity to provide feedback at each stage.`,
  freelancer: {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    rating: 4.9,
    reviews: 127,
    location: 'New York, USA',
    memberSince: '2019',
    completedProjects: 245,
    responseTime: '1 hour',
  },
  price: 2500,
  deliveryTime: '7 days',
  category: 'Web Development',
  tags: ['React', 'Node.js', 'MongoDB', 'Full-Stack', 'API Development', 'Responsive Design'],
  features: [
    'Source code included',
    'Responsive design',
    'Cross-browser compatibility',
    'Performance optimization',
    'Security best practices',
    'Documentation included',
    '30 days of support',
    'Revision included',
  ],
  packages: [
    {
      name: 'Basic',
      price: 1500,
      deliveryTime: '5 days',
      description: 'Simple web application with core features',
      features: ['Up to 5 pages', 'Basic functionality', 'Responsive design', '1 revision', '14 days support'],
    },
    {
      name: 'Standard',
      price: 2500,
      deliveryTime: '7 days',
      description: 'Full-featured web application',
      features: ['Up to 10 pages', 'Advanced functionality', 'API integration', '2 revisions', '30 days support'],
      popular: true,
    },
    {
      name: 'Premium',
      price: 4500,
      deliveryTime: '14 days',
      description: 'Enterprise-level web application',
      features: ['Unlimited pages', 'Custom features', 'Multiple integrations', 'Unlimited revisions', '90 days support'],
    },
  ],
  reviews: [
    {
      id: 1,
      author: 'John Martinez',
      avatar: 'JM',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Exceptional work! Sarah delivered exactly what we needed and went above and beyond. The code quality is outstanding and the application runs smoothly. Highly recommend!',
    },
    {
      id: 2,
      author: 'Emily Davis',
      avatar: 'ED',
      rating: 5,
      date: '1 month ago',
      comment: 'Very professional and communicative. Completed the project ahead of schedule with excellent attention to detail.',
    },
    {
      id: 3,
      author: 'Michael Brown',
      avatar: 'MB',
      rating: 4,
      date: '2 months ago',
      comment: 'Great experience working with Sarah. She understood our requirements perfectly and delivered a high-quality product.',
    },
  ],
};

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleContactSeller = () => {
    toast.success('Message sent to freelancer!');
    navigate('/messages');
  };

  const handleOrderNow = () => {
    toast.success('Order placed successfully!');
    navigate('/dashboard');
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const currentPackage = mockService.packages[selectedPackage];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/browse')} className="mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Browse
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Actions */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Badge className="mb-3">{mockService.category}</Badge>
                  <h1 className="text-3xl font-bold mb-2">{mockService.title}</h1>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={toggleFavorite}>
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Freelancer Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="w-12 h-12 cursor-pointer" onClick={() => navigate(`/freelancer/${mockService.freelancer.id}`)}>
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {mockService.freelancer.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold cursor-pointer hover:text-primary" onClick={() => navigate(`/freelancer/${mockService.freelancer.id}`)}>
                    {mockService.freelancer.name}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">{mockService.freelancer.rating}</span>
                      <span>({mockService.freelancer.reviews})</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {mockService.freelancer.location}
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={handleContactSeller}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="packages">Packages</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({mockService.reviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Service</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {mockService.longDescription}
                    </p>

                    <div>
                      <h3 className="font-semibold mb-3">What's Included:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {mockService.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Skills & Technologies:</h3>
                      <div className="flex flex-wrap gap-2">
                        {mockService.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="packages" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockService.packages.map((pkg, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all ${
                        selectedPackage === index ? 'ring-2 ring-primary' : 'hover:border-primary'
                      } ${pkg.popular ? 'border-primary' : ''}`}
                      onClick={() => setSelectedPackage(index)}
                    >
                      <CardHeader>
                        {pkg.popular && (
                          <Badge className="w-fit mb-2">Most Popular</Badge>
                        )}
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <CardDescription>{pkg.description}</CardDescription>
                        <div className="mt-4">
                          <div className="text-3xl font-bold">${pkg.price}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {pkg.deliveryTime} delivery
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 mt-6">
                {/* Reviews Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Client Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-2">{mockService.freelancer.rating}</div>
                        <div className="flex items-center gap-1 justify-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">{mockService.freelancer.reviews} reviews</div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-2">
                            <span className="text-sm w-8">{stars} star</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${stars === 5 ? 85 : stars === 4 ? 10 : 5}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{stars === 5 ? '85%' : stars === 4 ? '10%' : '5%'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                {mockService.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {review.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{review.author}</p>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Order Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Order This Service</CardTitle>
                  <CardDescription>Choose your package</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold">${currentPackage.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{currentPackage.name} Package</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Time</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {currentPackage.deliveryTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Revisions</span>
                      <span className="font-medium">
                        {currentPackage.features.find(f => f.includes('revision'))}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button className="w-full" size="lg" onClick={handleOrderNow}>
                      Order Now (${currentPackage.price})
                    </Button>
                    <Button className="w-full" variant="outline" size="lg" onClick={handleContactSeller}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Freelancer Stats */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Seller Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">{mockService.freelancer.memberSince}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completed projects</span>
                    <span className="font-medium">{mockService.freelancer.completedProjects}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Response time</span>
                    <span className="font-medium">{mockService.freelancer.responseTime}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => navigate(`/freelancer/${mockService.freelancer.id}`)}>
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}