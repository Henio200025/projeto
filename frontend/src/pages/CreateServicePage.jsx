import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const categories = [
  'Web Development',
  'Mobile Apps',
  'Design & Creative',
  'Writing & Content',
  'Marketing',
  'Video & Animation',
  'Data Science',
  'Business Consulting',
];

const deliveryTimeOptions = ['1 day', '3 days', '5 days', '7 days', '14 days', '30 days'];

export default function CreateServicePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    deliveryTime: '',
    features: [],
  });
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState([]);
  const [currentFeature, setCurrentFeature] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && tags.length < 8) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()],
      }));
      setCurrentFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.category || !formData.description || !formData.price || !formData.deliveryTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (tags.length === 0) {
      toast.error('Please add at least one tag');
      return;
    }

    if (formData.features.length === 0) {
      toast.error('Please add at least one feature');
      return;
    }

    // Mock success
    toast.success('Service created successfully!');
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Service</h1>
          <p className="text-muted-foreground">Fill in the details to list your service on the marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide essential details about your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Professional Web Development Service"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">Write a clear, descriptive title for your service</p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Service Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your service in detail. What will you deliver? What makes your service unique?"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 100 characters. Explain what you offer and why clients should choose you.
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Skills & Tags *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill or tag (e.g., React, SEO, Design)"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} disabled={tags.length >= 8}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pl-3 pr-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Add up to 8 relevant tags (Added: {tags.length}/8)</p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Delivery */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Delivery</CardTitle>
              <CardDescription>Set your service price and delivery time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Service Price (USD) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="500"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="pl-7"
                      min="5"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Minimum price is $5</p>
                </div>

                {/* Delivery Time */}
                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">Delivery Time *</Label>
                  <Select
                    value={formData.deliveryTime}
                    onValueChange={(value) => setFormData({ ...formData, deliveryTime: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery time" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryTimeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Service Features</CardTitle>
              <CardDescription>List what's included in your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Responsive design, Source code included"
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddFeature}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.features.length > 0 && (
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <span className="flex-1 text-sm">{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Add at least 3 features that are included in your service</p>
            </CardContent>
          </Card>

          {/* Requirements (Optional) */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements from Buyer (Optional)</CardTitle>
              <CardDescription>What information do you need from clients to get started?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Please provide your brand colors, logo files, target audience description, and any specific requirements."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" size="lg">
              Create Service
            </Button>
          </div>
        </form>

        {/* Tips Card */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Tips for a Successful Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use a clear, specific title that describes exactly what you offer</li>
              <li>• Write a detailed description highlighting your expertise and what makes you unique</li>
              <li>• Add relevant tags to help clients find your service</li>
              <li>• Price competitively based on your experience and market rates</li>
              <li>• Be realistic with delivery times - it's better to under-promise and over-deliver</li>
              <li>• List specific features and deliverables to set clear expectations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}