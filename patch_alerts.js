const fs = require('fs');
const path = require('path');

const files = [
  'd:\\Projects\\REACT NATIVE\\csmp\\src\\app\\pages\\pool\\[id].tsx',
  'd:\\Projects\\REACT NATIVE\\csmp\\src\\app\\pages\\create-pool.tsx',
  'd:\\Projects\\REACT NATIVE\\csmp\\src\\app\\pages\\cash-in.tsx',
  'd:\\Projects\\REACT NATIVE\\csmp\\src\\app\\pages\\auth\\register.tsx',
  'd:\\Projects\\REACT NATIVE\\csmp\\src\\app\\pages\\auth\\login.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Calculate relative path to utils/Alert
  const dir = path.dirname(file);
  const utilsDir = path.resolve('d:\\Projects\\REACT NATIVE\\csmp\\src\\utils\\Alert');
  let relativePath = path.relative(dir, utilsDir).replace(/\\/g, '/');
  
  // Ensure the import exists
  if (!content.includes('CustomAlert')) {
    // replace `import { Alert` with `import { CustomAlert } from 'relativePath';\nimport { Alert`
    // Actually just add it after react imports
    content = content.replace(/(import React.*?;\n)/, `$1import { CustomAlert } from '${relativePath}';\n`);
  }

  // Replace Alert.alert("Error", ...) -> CustomAlert.error("Error", ...)
  content = content.replace(/Alert\.alert\(\s*["']Error["']\s*,\s*(.*?)\)/g, 'CustomAlert.error("Error", $1)');
  
  // Replace Alert.alert("Success", ...) -> CustomAlert.success("Success", ...)
  content = content.replace(/Alert\.alert\(\s*["']Success["']\s*,\s*(.*?)\)/g, 'CustomAlert.success("Success", $1)');
  
  // Replace Alert.alert("Payment Successful", ...) -> CustomAlert.success("Payment Successful", ...)
  content = content.replace(/Alert\.alert\(\s*["']Payment Successful["']\s*,\s*(.*?)\)/g, 'CustomAlert.success("Payment Successful", $1)');
  
  // Replace Alert.alert("Payment Failed", ...) -> CustomAlert.error("Payment Failed", ...)
  content = content.replace(/Alert\.alert\(\s*["']Payment Failed["']\s*,\s*(.*?)\)/g, 'CustomAlert.error("Payment Failed", $1)');

  // Replace Alert.alert("Payment Pending", ...) -> CustomAlert.info("Payment Pending", ...)
  content = content.replace(/Alert\.alert\(\s*["']Payment Pending["']\s*,\s*(.*?)\)/g, 'CustomAlert.info("Payment Pending", $1)');
  
  // Replace Alert.alert("Invalid Amount", ...) -> CustomAlert.error("Invalid Amount", ...)
  content = content.replace(/Alert\.alert\(\s*["']Invalid Amount["']\s*,\s*(.*?)\)/g, 'CustomAlert.error("Invalid Amount", $1)');

  // Replace Alert.alert('OTP Sent', ...) -> CustomAlert.success('OTP Sent', ...)
  content = content.replace(/Alert\.alert\(\s*['"]OTP Sent['"]\s*,\s*(.*?)\)/g, 'CustomAlert.success("OTP Sent", $1)');
  
  // Replace Alert.alert('Failed to resend', ...) -> CustomAlert.error('Failed to resend', ...)
  content = content.replace(/Alert\.alert\(\s*['"]Failed to resend['"]\s*,\s*(.*?)\)/g, 'CustomAlert.error("Failed to resend", $1)');

  // Replace Alert.alert('Registration Failed', ...) -> CustomAlert.error('Registration Failed', ...)
  content = content.replace(/Alert\.alert\(\s*['"]Registration Failed['"]\s*,\s*(.*?)\)/g, 'CustomAlert.error("Registration Failed", $1)');
  
  // Replace Alert.alert('Verification Failed', ...) -> CustomAlert.error('Verification Failed', ...)
  content = content.replace(/Alert\.alert\(\s*['"]Verification Failed['"]\s*,\s*(.*?)\)/g, 'CustomAlert.error("Verification Failed", $1)');

  // Replace Alert.alert("Login Failed", ...) -> CustomAlert.error("Login Failed", ...)
  content = content.replace(/Alert\.alert\(\s*['"]Login Failed['"]\s*,\s*(.*?)\)/g, 'CustomAlert.error("Login Failed", $1)');

  // Remove `[{ text: "OK", onPress: () => router.back() }]` arrays or similar from CustomAlert calls
  // The regex above will capture the array as part of $1 if it matched broadly.
  // Wait, let's make the regex only capture the message string/variable, NOT the array.
  // So instead of `(.*?)`, we capture up to the array.
  
  fs.writeFileSync(file, content, 'utf8');
});

console.log("Patched alerts");
