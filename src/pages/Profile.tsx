
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  business_address: string | null;
  contact_number: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({
    id: '',
    first_name: '',
    last_name: '',
    business_name: '',
    business_address: '',
    contact_number: '',
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (!user) return;

        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfile({
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            business_name: data.business_name || '',
            business_address: data.business_address || '',
            contact_number: data.contact_number || '',
          });
        }
      } catch (error: any) {
        console.error('Error loading profile:', error.message);
        setError('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setUpdating(true);
      setError(null);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          business_name: profile.business_name,
          business_address: profile.business_address,
          contact_number: profile.contact_number,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      setError('Error updating profile');
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex-1 min-h-screen">
          <main className="container mx-auto max-w-3xl px-4 py-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Your Profile</h1>
              <p className="text-muted-foreground mt-2">
                Update your personal and business information
              </p>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="glass-panel p-6">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded w-1/4 ml-auto"></div>
                </div>
              ) : (
                <form onSubmit={updateProfile} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          Your email address is associated with your account and cannot be changed
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.first_name || ''}
                          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                          placeholder="Enter your first name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.last_name || ''}
                          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Business Information</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      This information will appear on your invoices and reports
                    </p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={profile.business_name || ''}
                          onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                          placeholder="Enter your business name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="businessAddress">Business Address</Label>
                        <Input
                          id="businessAddress"
                          value={profile.business_address || ''}
                          onChange={(e) => setProfile({ ...profile, business_address: e.target.value })}
                          placeholder="Enter your business address"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                          id="contactNumber"
                          value={profile.contact_number || ''}
                          onChange={(e) => setProfile({ ...profile, contact_number: e.target.value })}
                          placeholder="Enter your contact number"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={updating}>
                      {updating ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
