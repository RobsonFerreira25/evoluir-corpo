import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  name: string;
  age: number;
  sex: 'male' | 'female';
  weight: number;
  height: number;
  current_level: 'beginner' | 'intermediate' | 'advanced';
  level_started_at: string;
  created_at: string;
  updated_at: string;
}

export interface HealthMetrics {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  dailyCalories: number;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data as Profile | null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const createProfile = async (profileData: Omit<Profile, 'id' | 'current_level' | 'level_started_at' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        ...profileData,
      })
      .select()
      .single();

    if (error) throw error;
    setProfile(data as Profile);
    return data;
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data as Profile);
    return data;
  };

  const calculateHealthMetrics = (p: Profile): HealthMetrics => {
    // Calculate BMI: weight (kg) / height² (m²)
    const heightInMeters = p.height / 100;
    const bmi = p.weight / (heightInMeters * heightInMeters);

    // BMI Category
    let bmiCategory: string;
    if (bmi < 18.5) {
      bmiCategory = 'Abaixo do peso';
    } else if (bmi < 25) {
      bmiCategory = 'Peso normal';
    } else if (bmi < 30) {
      bmiCategory = 'Sobrepeso';
    } else if (bmi < 35) {
      bmiCategory = 'Obesidade Grau I';
    } else if (bmi < 40) {
      bmiCategory = 'Obesidade Grau II';
    } else {
      bmiCategory = 'Obesidade Grau III';
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (p.sex === 'male') {
      bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + 5;
    } else {
      bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age - 161;
    }

    // Daily calories (assuming light activity factor 1.375)
    const dailyCalories = bmr * 1.375;

    return {
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      bmr: Math.round(bmr),
      dailyCalories: Math.round(dailyCalories),
    };
  };

  const healthMetrics = profile ? calculateHealthMetrics(profile) : null;

  return {
    profile,
    healthMetrics,
    loading,
    error,
    createProfile,
    updateProfile,
    refetch: fetchProfile,
  };
};