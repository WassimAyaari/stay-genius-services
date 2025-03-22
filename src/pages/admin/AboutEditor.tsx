
import React, { useState, useEffect } from 'react';
import { useHotelConfig } from '@/hooks/useHotelConfig';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Building2, Users, Award, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { InfoItem, FeatureItem } from '@/lib/types';

const AboutEditor = () => {
  const { aboutData, isLoadingAbout, updateAboutData } = useHotelConfig();
  const [formData, setFormData] = useState(null);
  const [activeTab, setActiveTab] = useState('welcome');

  useEffect(() => {
    if (aboutData) {
      // Parse JSON strings if necessary
      const parsedData = {
        ...aboutData,
        important_numbers: Array.isArray(aboutData.important_numbers) 
          ? aboutData.important_numbers 
          : JSON.parse(aboutData.important_numbers || '[]'),
        hotel_policies: Array.isArray(aboutData.hotel_policies) 
          ? aboutData.hotel_policies 
          : JSON.parse(aboutData.hotel_policies || '[]'),
        facilities: Array.isArray(aboutData.facilities) 
          ? aboutData.facilities 
          : JSON.parse(aboutData.facilities || '[]'),
        additional_info: Array.isArray(aboutData.additional_info) 
          ? aboutData.additional_info 
          : JSON.parse(aboutData.additional_info || '[]'),
        features: Array.isArray(aboutData.features) 
          ? aboutData.features 
          : JSON.parse(aboutData.features || '[]'),
      };
      setFormData(parsedData);
    }
  }, [aboutData]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInfoItemChange = (type, index, field, value) => {
    setFormData(prev => {
      const updatedItems = [...prev[type]];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      return {
        ...prev,
        [type]: updatedItems
      };
    });
  };

  const handleFeatureChange = (index, field, value) => {
    setFormData(prev => {
      const updatedFeatures = [...prev.features];
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        [field]: value
      };
      return {
        ...prev,
        features: updatedFeatures
      };
    });
  };

  const addInfoItem = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], { label: '', value: '' }]
    }));
  };

  const removeInfoItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { title: '', description: '', icon: 'Info' }]
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;

    updateAboutData(formData);
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'History': return <History />;
      case 'Building2': return <Building2 />;
      case 'Users': return <Users />;
      case 'Award': return <Award />;
      default: return <History />;
    }
  };

  if (isLoadingAbout || !formData) {
    return (
      <Layout>
        <div className="container py-8">
          <h1 className="text-2xl font-bold mb-4">Loading About Section Editor...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit About Section</h1>
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="welcome">Welcome</TabsTrigger>
            <TabsTrigger value="directory">Directory</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="mission">Mission</TabsTrigger>
          </TabsList>

          <TabsContent value="welcome" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Welcome Section</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="welcome_title">Section Title</Label>
                  <Input 
                    id="welcome_title" 
                    name="welcome_title" 
                    value={formData.welcome_title || ''} 
                    onChange={handleTextChange}
                  />
                </div>

                <div>
                  <Label htmlFor="welcome_description">Main Description</Label>
                  <Textarea 
                    id="welcome_description" 
                    name="welcome_description" 
                    value={formData.welcome_description || ''} 
                    onChange={handleTextChange}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="welcome_description_extended">Extended Description</Label>
                  <Textarea 
                    id="welcome_description_extended" 
                    name="welcome_description_extended" 
                    value={formData.welcome_description_extended || ''} 
                    onChange={handleTextChange}
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="directory" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Directory & Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="directory_title">Section Title</Label>
                  <Input 
                    id="directory_title" 
                    name="directory_title" 
                    value={formData.directory_title || ''} 
                    onChange={handleTextChange}
                  />
                </div>

                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Important Numbers</h3>
                      <Button type="button" variant="outline" size="sm" onClick={() => addInfoItem('important_numbers')}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                    
                    {formData.important_numbers.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input 
                          placeholder="Label"
                          value={item.label || ''} 
                          onChange={(e) => handleInfoItemChange('important_numbers', index, 'label', e.target.value)}
                          className="flex-1"
                        />
                        <Input 
                          placeholder="Value"
                          value={String(item.value) || ''} 
                          onChange={(e) => handleInfoItemChange('important_numbers', index, 'value', e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeInfoItem('important_numbers', index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Hotel Policies</h3>
                      <Button type="button" variant="outline" size="sm" onClick={() => addInfoItem('hotel_policies')}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                    
                    {formData.hotel_policies.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input 
                          placeholder="Label"
                          value={item.label || ''} 
                          onChange={(e) => handleInfoItemChange('hotel_policies', index, 'label', e.target.value)}
                          className="flex-1"
                        />
                        <Input 
                          placeholder="Value"
                          value={String(item.value) || ''} 
                          onChange={(e) => handleInfoItemChange('hotel_policies', index, 'value', e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeInfoItem('hotel_policies', index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Facilities & Amenities</h3>
                      <Button type="button" variant="outline" size="sm" onClick={() => addInfoItem('facilities')}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                    
                    {formData.facilities.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input 
                          placeholder="Label"
                          value={item.label || ''} 
                          onChange={(e) => handleInfoItemChange('facilities', index, 'label', e.target.value)}
                          className="flex-1"
                        />
                        <Input 
                          placeholder="Value"
                          value={String(item.value) || ''} 
                          onChange={(e) => handleInfoItemChange('facilities', index, 'value', e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeInfoItem('facilities', index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Additional Information</h3>
                      <Button type="button" variant="outline" size="sm" onClick={() => addInfoItem('additional_info')}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                    
                    {formData.additional_info.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input 
                          placeholder="Label"
                          value={item.label || ''} 
                          onChange={(e) => handleInfoItemChange('additional_info', index, 'label', e.target.value)}
                          className="flex-1"
                        />
                        <Input 
                          placeholder="Value"
                          value={String(item.value) || ''} 
                          onChange={(e) => handleInfoItemChange('additional_info', index, 'value', e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeInfoItem('additional_info', index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Features Grid</h2>
                <Button type="button" variant="outline" onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-1" /> Add Feature
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.features.map((feature, index) => (
                  <Card key={index} className="p-4 relative">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>

                    <div className="flex flex-col items-center gap-2 mt-4">
                      <div className="bg-primary/10 p-3 rounded-full mb-3">
                        {getIconComponent(feature.icon)}
                      </div>
                      
                      <Input 
                        placeholder="Title"
                        value={feature.title || ''} 
                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                        className="text-center"
                      />
                      
                      <Textarea 
                        placeholder="Description"
                        value={feature.description || ''} 
                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                        className="text-center text-sm"
                        rows={2}
                      />
                      
                      <div className="w-full mt-2">
                        <Label htmlFor={`icon-${index}`}>Icon</Label>
                        <select 
                          id={`icon-${index}`}
                          value={feature.icon || 'History'} 
                          onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="History">History</option>
                          <option value="Building2">Building</option>
                          <option value="Users">Team</option>
                          <option value="Award">Award</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="mission" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Mission Statement</h2>
              
              <div>
                <Label htmlFor="mission">Mission</Label>
                <Textarea 
                  id="mission" 
                  name="mission" 
                  value={formData.mission || ''} 
                  onChange={handleTextChange}
                  rows={5}
                  className="mb-2"
                />
                <p className="text-sm text-gray-500">
                  A concise statement that defines the purpose and values of the hotel.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AboutEditor;
