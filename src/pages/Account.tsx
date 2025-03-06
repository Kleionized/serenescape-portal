
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { AlertTriangle, LogOut, User, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');
  
  if (!user) return null;

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== user.email) {
      toast.error('Email addresses do not match');
      return;
    }

    try {
      // For now we'll just log the user out since we don't have direct access
      // to delete the account in Authentik through the client
      toast.info('Account deletion should be managed through your Authentik instance.');
      logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete account. Please try again later.');
      console.error('Error deleting account:', error);
    }
  };

  return (
    <PageContainer
      title="Account Settings"
      subtitle="Manage your account preferences and information"
    >
      <div className="grid gap-8 max-w-3xl mx-auto">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-safespace-primary/10 flex items-center justify-center text-safespace-primary">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h2 className="heading-sm">{user.fullName || 'User'}</h2>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h2 className="heading-sm mb-4 flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Sign out from Your Safe Space on this device
          </p>
          <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
        </div>

        <div className="glass-card rounded-xl p-6 border border-destructive/20">
          <h2 className="heading-sm mb-4 flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            <span>Delete Account</span>
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-gray-600 dark:text-gray-300">
                Deleting your account is permanent. All your data will be permanently removed and cannot be recovered.
              </p>
            </div>
            
            {isDeleting ? (
              <div className="space-y-4">
                <p className="font-medium">
                  To confirm, please enter your email address: <span className="text-destructive">{user.email}</span>
                </p>
                <input
                  type="email"
                  value={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-background dark:bg-gray-800 dark:text-white"
                  placeholder="Your email address"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={confirmDelete !== user.email}
                  >
                    Permanently Delete Account
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDeleting(false);
                      setConfirmDelete('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="destructive" 
                onClick={() => setIsDeleting(true)}
              >
                Delete Account
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Account;
