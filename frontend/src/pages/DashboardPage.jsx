import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, DollarSign, Star, TrendingUp, Clock, MessageSquare, Plus, Eye, Calendar, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Navbar from '@/components/Navbar';

const mockDashboardData = {
  stats: [
    { label: 'Active Projects', value: '5', change: '+12%', icon: Briefcase, trend: 'up' },
    { label: 'Total Earnings', value: '$12,450', change: '+23%', icon: DollarSign, trend: 'up' },
    { label: 'Avg. Rating', value: '4.9', change: '+0.2', icon: Star, trend: 'up' },
    { label: 'Response Rate', value: '98%', change: '+5%', icon: TrendingUp, trend: 'up' },
  ],
  activeProjects: [
    {
      id: 1,
      title: 'E-commerce Website Development',
      client: { name: 'John Martinez', avatar: 'JM' },
      status: 'In Progress',
      progress: 65,
      deadline: '5 days',
      budget: 2500,
    },
    {
      id: 2,
      title: 'Mobile App UI Design',
      client: { name: 'Emily Davis', avatar: 'ED' },
      status: 'In Progress',
      progress: 40,
      deadline: '8 days',
      budget: 1800,
    },
    {
      id: 3,
      title: 'API Integration Service',
      client: { name: 'Michael Brown', avatar: 'MB' },
      status: 'Review',
      progress: 90,
      deadline: '2 days',
      budget: 1200,
    },
  ],
  recentOrders: [
    {
      id: 1,
      service: 'Full-Stack Development',
      client: 'Sarah Wilson',
      date: '2024-01-15',
      amount: 2500,
      status: 'Completed',
    },
    {
      id: 2,
      service: 'UI/UX Design',
      client: 'Tom Anderson',
      date: '2024-01-14',
      amount: 1200,
      status: 'Completed',
    },
    {
      id: 3,
      service: 'SEO Optimization',
      client: 'Lisa Chen',
      date: '2024-01-13',
      amount: 800,
      status: 'In Progress',
    },
  ],
  myServices: [
    {
      id: 1,
      title: 'Full-Stack Web Development',
      price: 2500,
      orders: 45,
      rating: 4.9,
      views: 1250,
      status: 'Active',
    },
    {
      id: 2,
      title: 'UI/UX Design Service',
      price: 1800,
      orders: 38,
      rating: 5.0,
      views: 980,
      status: 'Active',
    },
    {
      id: 3,
      title: 'API Development',
      price: 1500,
      orders: 32,
      rating: 4.8,
      views: 750,
      status: 'Active',
    },
  ],
};

export default function DashboardPage() {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success/10 text-success';
      case 'In Progress':
        return 'bg-primary/10 text-primary';
      case 'Review':
        return 'bg-accent/10 text-accent';
      case 'Active':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your overview</p>
          </div>
          <Button onClick={() => navigate('/create-service')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Service
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockDashboardData.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    <span className="text-success">{stat.change}</span>
                    <span>from last month</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Active Projects</TabsTrigger>
            <TabsTrigger value="services">My Services</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>

          {/* Active Projects */}
          <TabsContent value="projects" className="space-y-4">
            {mockDashboardData.activeProjects.map((project) => (
              <Card key={project.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                              {project.client.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{project.client.name}</span>
                        </div>
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/messages')}>Message Client</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{project.deadline} left</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span>${project.budget}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate('/messages')}>
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* My Services */}
          <TabsContent value="services" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockDashboardData.myServices.map((service) => (
                <Card key={service.id} className="card-hover cursor-pointer" onClick={() => navigate(`/service/${service.id}`)}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-base line-clamp-2">{service.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Service</DropdownMenuItem>
                          <DropdownMenuItem>View Analytics</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Pause Service</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-bold text-lg">${service.price}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-sm font-semibold">{service.orders}</div>
                        <div className="text-xs text-muted-foreground">Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {service.rating}
                        </div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3" />
                          {service.views}
                        </div>
                        <div className="text-xs text-muted-foreground">Views</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Order History */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your order history and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDashboardData.recentOrders.map((order) => (
                      <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{order.service}</TableCell>
                        <TableCell>{order.client}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-semibold">${order.amount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Orders
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-hover cursor-pointer" onClick={() => navigate('/messages')}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-base">Messages</CardTitle>
                <CardDescription>3 unread messages</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="card-hover cursor-pointer" onClick={() => navigate('/create-service')}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-base">New Service</CardTitle>
                <CardDescription>Create a new offering</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="card-hover cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-base">Analytics</CardTitle>
                <CardDescription>View performance</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}