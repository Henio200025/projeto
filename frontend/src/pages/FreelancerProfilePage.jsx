import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, Award, TrendingUp, MessageSquare, ChevronLeft, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const mockFreelancer = {
  id: 1,
  name: 'Sarah Johnson',
  avatar: 'SJ',
  title: 'Full-Stack Developer & UI/UX Designer',
  tagline: 'Building beautiful, scalable web applications',
  rating: 4.9,
  reviews: 127,
  location: 'New York, USA',
  memberSince: 'January 2019',
  completedProjects: 245,
  ongoingProjects: 3,
  responseTime: '1 hour',
  languages: ['English (Native)', 'Spanish (Fluent)'],
  hourlyRate: 75,
  availability: 'Available now',
  description: `I'm a passionate full-stack developer with over 5 years of experience building web applications for startups and enterprises. I specialize in React, Node.js, and modern web technologies.

My approach focuses on:
• Clean, maintainable code
• User-centered design
• Performance optimization
• Clear communication
• Timely delivery

I've worked with clients across various industries including fintech, healthcare, e-commerce, and SaaS. Let's build something great together!`,
  skills: [
    { name: 'React', level: 95 },
    { name: 'Node.js', level: 90 },
    { name: 'TypeScript', level: 88 },
    { name: 'MongoDB', level: 85 },
    { name: 'UI/UX Design', level: 82 },
    { name: 'Python', level: 78 },
  ],
  services: [
    {
      id: 1,
      title: 'Full-Stack Web Application Development',
      description: 'Custom web applications with React and Node.js',
      price: 2500,
      deliveryTime: '7 days',
      rating: 4.9,
      orders: 45,
    },
    {
      id: 2,
      title: 'UI/UX Design & Prototyping',
      description: 'Beautiful interfaces with Figma',
      price: 1200,
      deliveryTime: '5 days',
      rating: 5.0,
      orders: 38,
    },
    {
      id: 3,
      title: 'API Development & Integration',
      description: 'RESTful APIs and third-party integrations',
      price: 1800,
      deliveryTime: '6 days',
      rating: 4.8,
      orders: 32,
    },
  ],
  certifications: [
    { name: 'AWS Certified Developer', year: 2023 },
    { name: 'Google UX Design Professional', year: 2022 },
    { name: 'Meta React Developer', year: 2021 },
  ],
  education: [
    {
      degree: 'Bachelor of Computer Science',
      institution: 'MIT',
      year: '2015-2019',
    },
  ],
  reviews: [
    {
      id: 1,
      author: 'John Martinez',
      avatar: 'JM',
      rating: 5,
      date: '2 weeks ago',
      project: 'E-commerce Website',
      comment: 'Exceptional work! Sarah delivered exactly what we needed and went above and beyond. The code quality is outstanding and the application runs smoothly.',
    },
    {
      id: 2,
      author: 'Emily Davis',
      avatar: 'ED',
      rating: 5,
      date: '1 month ago',
      project: 'SaaS Dashboard',
      comment: 'Very professional and communicative. Completed the project ahead of schedule with excellent attention to detail.',
    },
    {
      id: 3,
      author: 'Michael Brown',
      avatar: 'MB',
      rating: 4,
      date: '2 months ago',
      project: 'Mobile App Backend',
      comment: 'Great experience working with Sarah. She understood our requirements perfectly and delivered a high-quality product.',
    },
  ],
};

export default function FreelancerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleContactFreelancer = () => {
    toast.success('Message sent!');
    navigate('/messages');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Profile Card */}
              <Card className="border-2">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {mockFreelancer.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{mockFreelancer.name}</CardTitle>
                  <CardDescription>{mockFreelancer.title}</CardDescription>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{mockFreelancer.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({mockFreelancer.reviews} reviews)</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" size="lg" onClick={handleContactFreelancer}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Me
                  </Button>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{mockFreelancer.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Member since {mockFreelancer.memberSince}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Responds in {mockFreelancer.responseTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed Projects</span>
                    <span className="font-semibold">{mockFreelancer.completedProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ongoing Projects</span>
                    <span className="font-semibold">{mockFreelancer.ongoingProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hourly Rate</span>
                    <span className="font-semibold">${mockFreelancer.hourlyRate}/hr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Availability</span>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      {mockFreelancer.availability}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockFreelancer.languages.map((lang, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        {lang}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-xl">
              <h1 className="text-3xl font-bold mb-2">{mockFreelancer.tagline}</h1>
              <p className="text-muted-foreground">Trusted by 100+ clients worldwide</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services ({mockFreelancer.services.length})</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({mockFreelancer.reviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6 mt-6">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {mockFreelancer.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockFreelancer.skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockFreelancer.certifications.map((cert, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-sm text-muted-foreground">{cert.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mockFreelancer.education.map((edu, index) => (
                      <div key={index}>
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.year}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <div className="grid grid-cols-1 gap-4">
                  {mockFreelancer.services.map((service) => (
                    <Card
                      key={service.id}
                      className="card-hover cursor-pointer"
                      onClick={() => navigate(`/service/${service.id}`)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-sm">{service.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">({service.orders} orders)</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {service.deliveryTime}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Starting at</p>
                          <p className="text-xl font-bold">${service.price}</p>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 mt-6">
                {mockFreelancer.reviews.map((review) => (
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
                            <div>
                              <p className="font-semibold">{review.author}</p>
                              <p className="text-xs text-muted-foreground">{review.project}</p>
                            </div>
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
        </div>
      </div>

      <Footer />
    </div>
  );
}