import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { CustomAlert } from '../../../utils/Alert';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authApi } from '../../../api';

export default function RegisterScreen() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [date, setDate] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [sex, setSex] = useState<'Male' | 'Female' | null>(null);
  
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const otpRefs = useRef<Array<TextInput | null>>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleOtpChange = (text: string, index: number) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    if (!sanitized && text !== '') return;
    
    const newOtp = otp.split('');
    newOtp[index] = sanitized;
    setOtp(newOtp.join(''));

    if (sanitized && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (step !== 6 || countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await authApi.resendOtp(email);
      setCountdown(60);
      CustomAlert.success('OTP Sent', 'A new verification code has been sent to your email.');
    } catch (error: any) {
      CustomAlert.error('Failed to resend', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = email.includes('@') && mobilePhone.length >= 10;
  const isStep2Valid = firstName.trim().length > 0 && lastName.trim().length > 0;
  const isStep3Valid = dateOfBirth !== '' && sex !== null;
  const isStep4Valid = province.trim().length > 0 && city.trim().length > 0 && barangay.trim().length > 0;
  const isStep5Valid = password.length > 5 && password === confirmPassword;
  const isStep6Valid = otp.length === 6;

  const handleNext = async () => {
    if (step === 5) {
      setIsLoading(true);
      try {
        await authApi.register({
          email,
          mobilePhone,
          firstName,
          middleName,
          lastName,
          dateOfBirth,
          sex,
          province,
          city,
          barangay,
          password
        });
        setStep(6);
      } catch (error: any) {
        CustomAlert.error('Registration Failed', error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp(email, otp);
      CustomAlert.success('Success', 'Registration complete!');
      router.replace('/');
    } catch (error: any) {
      CustomAlert.error('Verification Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }
    if (event.type === 'dismissed') {
      return;
    }
    if (selectedDate) {
      setDate(selectedDate);
      // Format as YYYY-MM-DD to ensure it is correctly parsed by the backend
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setDateOfBirth(`${year}-${month}-${day}`);
    }
  };

  const handleMobilePhoneChange = (text: string) => {
    setMobilePhone(text.replace(/[^0-9]/g, ''));
  };

  const handleNameChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (text: string) => {
    const sanitized = text.replace(/[^a-zA-Z\s-]/g, '').replace(/\s{2,}/g, ' ').trimStart();
    setter(sanitized);
  };

  const handleAddressChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (text: string) => {
    setter(text.trimStart());
  };

  const handlePasswordChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (text: string) => {
    const sanitized = text.replace(/\s/g, '');
    setter(sanitized);
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1: return "Contact Information";
      case 2: return "Your Name";
      case 3: return "Personal Details";
      case 4: return "Your Address";
      case 5: return "Secure your account";
      case 6: return "Verify your email";
      default: return "";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-container-margin"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="items-center mb-xl mt-xl">
            <View className="h-[80px] w-[80px] bg-primary rounded-xl items-center justify-center shadow-level-1 mb-md">
              <Text className="text-on-primary text-headline-lg font-bold">CS</Text>
            </View>
            <Text className="text-headline-lg text-on-background font-bold text-center">
              Create Account
            </Text>
            <Text className="text-body-md text-on-surface-variant text-center mt-xs">
              {getStepSubtitle()} (Step {step} of 6)
            </Text>
          </View>

          <View className="bg-surface rounded-lg p-md shadow-level-1 gap-md">
            {step === 1 && (
              <>
                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">Email Address</Text>
                  <View className="flex-row items-center h-touch-target-min px-md bg-surface-container-lowest rounded-md border border-outline-variant focus:border-primary">
                    <Ionicons name="mail-outline" size={20} color="#6f797a" style={{ marginRight: 8 }} />
                    <TextInput
                      className="flex-1 text-body-md text-on-surface"
                      placeholder="Enter your email"
                      placeholderTextColor="#6f797a"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">Mobile Phone</Text>
                  <View className="flex-row items-center h-touch-target-min px-md bg-surface-container-lowest rounded-md border border-outline-variant focus:border-primary">
                    <Ionicons name="call-outline" size={20} color="#6f797a" style={{ marginRight: 8 }} />
                    <TextInput
                      className="flex-1 text-body-md text-on-surface"
                      placeholder="Enter your mobile phone number"
                      placeholderTextColor="#6f797a"
                      keyboardType="phone-pad"
                      value={mobilePhone}
                      onChangeText={handleMobilePhoneChange}
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={handleNext}
                  disabled={!isStep1Valid}
                  className={`h-touch-target-min rounded-xl items-center justify-center mt-sm ${isStep1Valid ? 'bg-primary active:opacity-80' : 'bg-surface-container-highest opacity-50'}`}
                >
                  <Text className={`text-label-lg font-bold ${isStep1Valid ? 'text-on-primary' : 'text-on-surface-variant'}`}>Next</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">First Name</Text>
                  <View className="flex-row items-center h-touch-target-min px-md bg-surface-container-lowest rounded-md border border-outline-variant focus:border-primary">
                    <Ionicons name="person-outline" size={20} color="#6f797a" style={{ marginRight: 8 }} />
                    <TextInput
                      className="flex-1 text-body-md text-on-surface"
                      placeholder="Enter your first name"
                      placeholderTextColor="#6f797a"
                      value={firstName}
                      onChangeText={handleNameChange(setFirstName)}
                    />
                  </View>
                </View>

                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">Middle Name</Text>
                  <View className="flex-row items-center h-touch-target-min px-md bg-surface-container-lowest rounded-md border border-outline-variant focus:border-primary">
                    <Ionicons name="person-outline" size={20} color="#6f797a" style={{ marginRight: 8 }} />
                    <TextInput
                      className="flex-1 text-body-md text-on-surface"
                      placeholder="Enter your middle name (optional)"
                      placeholderTextColor="#6f797a"
                      value={middleName}
                      onChangeText={handleNameChange(setMiddleName)}
                    />
                  </View>
                </View>

                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">Last Name</Text>
                  <View className="flex-row items-center h-touch-target-min px-md bg-surface-container-lowest rounded-md border border-outline-variant focus:border-primary">
                    <Ionicons name="person-outline" size={20} color="#6f797a" style={{ marginRight: 8 }} />
                    <TextInput
                      className="flex-1 text-body-md text-on-surface"
                      placeholder="Enter your last name"
                      placeholderTextColor="#6f797a"
                      value={lastName}
                      onChangeText={handleNameChange(setLastName)}
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={handleNext}
                  disabled={!isStep2Valid}
                  className={`h-touch-target-min rounded-xl items-center justify-center mt-sm ${isStep2Valid ? 'bg-primary active:opacity-80' : 'bg-surface-container-highest opacity-50'}`}
                >
                  <Text className={`text-label-lg font-bold ${isStep2Valid ? 'text-on-primary' : 'text-on-surface-variant'}`}>Next</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleBack}
                  className="h-touch-target-min bg-surface-container-highest rounded-xl items-center justify-center mt-xs active:opacity-80"
                >
                  <Text className="text-on-surface text-label-lg font-bold">Back</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 3 && (
              <>
                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">Date of Birth</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <View className="flex-row items-center h-touch-target-min px-md bg-surface-container-lowest rounded-md border border-outline-variant focus:border-primary" pointerEvents="box-none">
                      <Ionicons name="calendar-outline" size={20} color="#6f797a" style={{ marginRight: 8 }} />
                      <Text className={`flex-1 text-body-md ${dateOfBirth ? 'text-on-surface' : 'text-[#6f797a]'}`}>
                        {dateOfBirth || "MM/DD/YYYY"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  
                  {showDatePicker && Platform.OS === 'web' && (
                    <Text className="text-error mt-xs text-body-sm">
                      Note: The native Date Picker does not support Web. Please test on an iOS or Android device/emulator.
                    </Text>
                  )}
                  
                  {showDatePicker && Platform.OS === 'ios' && (
                    <Modal transparent={true} animationType="slide" visible={showDatePicker}>
                      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View className="bg-surface p-md rounded-t-xl pb-xl">
                          <View className="flex-row justify-between items-center mb-md border-b border-outline-variant pb-sm">
                            <Text className="text-label-lg font-bold text-on-surface">Select Date</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                              <Text className="text-primary font-bold text-label-lg">Done</Text>
                            </TouchableOpacity>
                          </View>
                          <DateTimePicker
                            value={date}
                            mode="date"
                            display="spinner"
                            onChange={onChangeDate}
                            maximumDate={new Date()}
                          />
                        </View>
                      </View>
                    </Modal>
                  )}
                  {showDatePicker && Platform.OS === 'android' && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={onChangeDate}
                      maximumDate={new Date()}
                    />
                  )}
                </View>

                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">Sex</Text>
                  <View className="flex-row gap-md">
                    <TouchableOpacity
                      onPress={() => setSex('Male')}
                      className={`flex-1 flex-row h-touch-target-min rounded-md border items-center justify-center ${
                        sex === 'Male' ? 'bg-primary border-primary' : 'bg-surface-container-lowest border-outline-variant'
                      }`}
                    >
                      <Ionicons name="male-outline" size={18} color={sex === 'Male' ? 'white' : '#6f797a'} style={{ marginRight: 6 }} />
                      <Text className={`text-body-md font-medium ${sex === 'Male' ? 'text-on-primary' : 'text-on-surface'}`}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setSex('Female')}
                      className={`flex-1 flex-row h-touch-target-min rounded-md border items-center justify-center ${
                        sex === 'Female' ? 'bg-primary border-primary' : 'bg-surface-container-lowest border-outline-variant'
                      }`}
                    >
                      <Ionicons name="female-outline" size={18} color={sex === 'Female' ? 'white' : '#6f797a'} style={{ marginRight: 6 }} />
                      <Text className={`text-body-md font-medium ${sex === 'Female' ? 'text-on-primary' : 'text-on-surface'}`}>Female</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={handleNext}
                  disabled={!isStep3Valid}
                  className={`h-touch-target-min rounded-xl items-center justify-center mt-sm ${isStep3Valid ? 'bg-primary active:opacity-80' : 'bg-surface-container-highest opacity-50'}`}
                >
                  <Text className={`text-label-lg font-bold ${isStep3Valid ? 'text-on-primary' : 'text-on-surface-variant'}`}>Next</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleBack}
                  className="h-touch-target-min bg-surface-container-highest rounded-xl items-center justify-center mt-xs active:opacity-80"
                >
                  <Text className="text-on-surface text-label-lg font-bold">Back</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 4 && (
              <>
                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">Province</Text>
                  <View className="flex-row items-center h-touch-target-min px-md bg-surface-container-lowest rounded-md border border-outline-variant focus:border-primary">
                    <Ionicons name="map-outline" size={20} color="#6f797a" style={{ marginRight: 8 }} />
                    <TextInput
                      className="flex-1 text-body-md text-on-surface"
                      placeholder="Enter your province"
                      placeholderTextColor="#6f797a"
                      value={province}
                      onChangeText={handleAddressChange(setProvince)}
                    />
                  </View>
                </View>

                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">City / Municipality</Text>
                  <View className="flex-row items-center h-touch-target-min px-md bg-surface-container-lowest rounded-md border border-outline-variant focus:border-primary">
                    <Ionicons name="business-outline" size={20} color="#6f797a" style={{ marginRight: 8 }} />
                    <TextInput
                      className="flex-1 text-body-md text-on-surface"
                      placeholder="Enter your city or municipality"
                      placeholderTextColor="#6f797a"
                      value={city}
                      onChangeText={handleAddressChange(setCity)}
                    />
                  </View>
                </View>

                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">Barangay</Text>
                  <View className="flex-row items-center h-touch-target-min px-md bg-surface-container-lowest rounded-md border border-outline-variant focus:border-primary">
                    <Ionicons name="home-outline" size={20} color="#6f797a" style={{ marginRight: 8 }} />
                    <TextInput
                      className="flex-1 text-body-md text-on-surface"
                      placeholder="Enter your barangay"
                      placeholderTextColor="#6f797a"
                      value={barangay}
                      onChangeText={handleAddressChange(setBarangay)}
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={handleNext}
                  disabled={!isStep4Valid}
                  className={`h-touch-target-min rounded-xl items-center justify-center mt-sm ${isStep4Valid ? 'bg-primary active:opacity-80' : 'bg-surface-container-highest opacity-50'}`}
                >
                  <Text className={`text-label-lg font-bold ${isStep4Valid ? 'text-on-primary' : 'text-on-surface-variant'}`}>Next</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleBack}
                  className="h-touch-target-min bg-surface-container-highest rounded-xl items-center justify-center mt-xs active:opacity-80"
                >
                  <Text className="text-on-surface text-label-lg font-bold">Back</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 5 && (
              <>
                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">Password</Text>
                  <View className="flex-row items-center h-touch-target-min px-md bg-surface-container-lowest rounded-md border border-outline-variant focus:border-primary">
                    <Ionicons name="lock-closed-outline" size={20} color="#6f797a" style={{ marginRight: 8 }} />
                    <TextInput
                      className="flex-1 text-body-md text-on-surface"
                      placeholder="Create a password (min 6 chars)"
                      placeholderTextColor="#6f797a"
                      value={password}
                      onChangeText={handlePasswordChange(setPassword)}
                      secureTextEntry
                    />
                  </View>
                </View>

                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">Confirm Password</Text>
                  <View className="flex-row items-center h-touch-target-min px-md bg-surface-container-lowest rounded-md border border-outline-variant focus:border-primary">
                    <Ionicons name="lock-closed-outline" size={20} color="#6f797a" style={{ marginRight: 8 }} />
                    <TextInput
                      className="flex-1 text-body-md text-on-surface"
                      placeholder="Confirm your password"
                      placeholderTextColor="#6f797a"
                      value={confirmPassword}
                      onChangeText={handlePasswordChange(setConfirmPassword)}
                      secureTextEntry
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={handleNext}
                  disabled={!isStep5Valid || isLoading}
                  className={`h-touch-target-min rounded-xl items-center justify-center mt-sm flex-row ${isStep5Valid && !isLoading ? 'bg-primary active:opacity-80' : 'bg-surface-container-highest opacity-50'}`}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className={`text-label-lg font-bold ${isStep5Valid ? 'text-on-primary' : 'text-on-surface-variant'}`}>Next</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleBack}
                  className="h-touch-target-min bg-surface-container-highest rounded-xl items-center justify-center mt-xs active:opacity-80"
                >
                  <Text className="text-on-surface text-label-lg font-bold">Back</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 6 && (
              <>
                <View className="gap-xs">
                  <Text className="text-label-lg text-on-surface font-semibold">Enter OTP</Text>
                  <Text className="text-body-sm text-on-surface-variant mb-xs">
                    We've sent a verification code to {email}.
                  </Text>
                  <View className="flex-row justify-between w-full mt-sm">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => { otpRefs.current[index] = ref; }}
                        className="w-[45px] h-[55px] bg-surface-container-lowest rounded-md border border-outline-variant text-center text-headline-sm text-on-surface focus:border-primary"
                        keyboardType="number-pad"
                        maxLength={1}
                        value={otp[index] || ''}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      />
                    ))}
                  </View>
                  <View className="flex-row justify-end mt-xs">
                    {countdown > 0 ? (
                      <Text className="text-body-sm text-on-surface-variant font-medium">
                        Resend code in {countdown}s
                      </Text>
                    ) : (
                      <TouchableOpacity onPress={handleResend}>
                        <Text className="text-body-sm text-primary font-bold">
                          Resend OTP
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={handleRegister}
                  disabled={!isStep6Valid || isLoading}
                  className={`h-touch-target-min rounded-xl items-center justify-center mt-sm flex-row ${isStep6Valid && !isLoading ? 'bg-primary active:opacity-80' : 'bg-surface-container-highest opacity-50'}`}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className={`text-label-lg font-bold ${isStep6Valid ? 'text-on-primary' : 'text-on-surface-variant'}`}>Verify & Register</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleBack}
                  className="h-touch-target-min bg-surface-container-highest rounded-xl items-center justify-center mt-xs active:opacity-80"
                >
                  <Text className="text-on-surface text-label-lg font-bold">Back</Text>
                </TouchableOpacity>
              </>
            )}

            <View className="flex-row justify-center mt-sm">
              <Text className="text-on-surface-variant text-body-md">Already have an account? </Text>
              <Link href="/pages/auth/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primary text-body-md font-bold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
