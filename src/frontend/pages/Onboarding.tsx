import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useNetwork } from 'src/shared/contexts/index.ts';
import { Button, Input, Dropdown, Card, Toast } from 'src/frontend/components/ui/index.ts';
import { COLORS, INDUSTRIES, INTERESTS } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

const Onboarding: React.FC = React.memo(() => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    industry: '',
    interests: [],
    location: '',
  });
  const [error, setError] = useState('');

  const { user, updateProfile } = useAuth();
  const { initializeNetwork } = useNetwork();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.onboardingCompleted) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.username.trim()) {
          setError('Username is required');
          return false;
        }
        break;
      case 2:
        if (!formData.industry) {
          setError('Please select an industry');
          return false;
        }
        break;
      case 3:
        if (formData.interests.length === 0) {
          setError('Please select at least one interest');
          return false;
        }
        break;
      case 4:
        if (!formData.location.trim()) {
          setError('Location is required');
          return false;
        }
        break;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        await updateProfile(formData);
        await initializeNetwork();
        Toast.success('Onboarding completed successfully!');
        navigate('/dashboard');
      } catch (err) {
        Toast.error('An error occurred during onboarding. Please try again.');
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Input
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            aria-label="Username"
          />
        );
      case 2:
        return (
          <Dropdown
            options={INDUSTRIES}
            value={formData.industry}
            onChange={(value) => handleInputChange('industry', value)}
            placeholder="Select your industry"
            aria-label="Industry"
          />
        );
      case 3:
        return (
          <Dropdown
            options={INTERESTS}
            value={formData.interests}
            onChange={(value) => handleInputChange('interests', value)}
            placeholder="Select your interests"
            multiple
            aria-label="Interests"
          />
        );
      case 4:
        return (
          <Input
            type="text"
            placeholder="Enter your location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            aria-label="Location"
          />
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Pollen8</h1>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={classNames(
                  'w-1/4 h-2 rounded-full',
                  i <= step ? 'bg-black' : 'bg-gray-300'
                )}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">Step {step} of 4</p>
        </div>
        {renderStep()}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button onClick={handleBack} variant="secondary">
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={handleNext} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="ml-auto">
              Complete
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
});

export default Onboarding;